import { useTheme } from '@/hooks/use-theme'
import { Image } from 'expo-image'
import { Href, router } from 'expo-router'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    FlatList,
    Pressable,
    useWindowDimensions,
    View,
    type ViewToken,
} from 'react-native'
import HorizontalIndicators from '../pagination/horizontalIndicators'

const GAP = 6
const AUTO_SCROLL_INTERVAL = 3000
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' // generic neutral placeholder

interface Banner {
    img: string | number // require() result or remote uri
    link?: Href
}

const banners: Banner[] = [
    {
        img: require('@/assets/images/static/farmingIllustration.png'),
    },
    {
        img: require('@/assets/images/static/home/banners/yield.png'),
        link: '/yieldPredictor',
    },
    {
        img: require('@/assets/images/static/home/banners/spray.png'),
        link: '/sprayCalculator',
    },
    {
        img: require('@/assets/images/static/home/banners/fertilizer.png'),
        link: '/fertilizerCalculator',
    },
]

interface BannerItemProps {
    item: Banner
    itemWidth: number
    onPress: (link?: Href) => void
}

const BannerItem = memo(({ item, itemWidth, onPress }: BannerItemProps) => (
    <Pressable
        onPress={() => onPress(item.link)}
        accessibilityRole="button"
        accessibilityLabel="Promotional banner"
        style={{
            borderRadius: 24,
            width: itemWidth,
            aspectRatio: 3 / 1,
            overflow: 'hidden',
        }}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
    >
        <Image
            source={item.img}
            style={{ width: itemWidth, aspectRatio: 3 / 1 }}
            contentFit="cover"
            transition={250}
            placeholder={{ blurhash: BLURHASH }}
            cachePolicy="memory-disk"
            recyclingKey={String(item.img)}
        />
    </Pressable>
))
BannerItem.displayName = 'BannerItem'

const HomeCta = () => {
    const theme = useTheme()
    const { width } = useWindowDimensions()

    const itemWidth = width - 32 - 16
    const snapInterval = itemWidth + GAP

    const flatListRef = useRef<FlatList<Banner>>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const currentIndexRef = useRef(0)
    const isDraggingRef = useRef(false)

    const [currentIndex, setCurrentIndex] = useState(0)

    const stopAutoScroll = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    const startAutoScroll = useCallback(() => {
        stopAutoScroll()

        intervalRef.current = setInterval(() => {
            if (isDraggingRef.current) return

            const next = (currentIndexRef.current + 1) % banners.length
            currentIndexRef.current = next
            setCurrentIndex(next)

            flatListRef.current?.scrollToOffset({
                offset: next * snapInterval,
                animated: true,
            })
        }, AUTO_SCROLL_INTERVAL)
    }, [stopAutoScroll, snapInterval])

    useEffect(() => {
        currentIndexRef.current = currentIndex
    }, [currentIndex])

    // Restart the timer (and re-sync offset) whenever screen width changes,
    // e.g. rotation, so items stay snapped correctly.
    useEffect(() => {
        startAutoScroll()
        return () => stopAutoScroll()
    }, [startAutoScroll, stopAutoScroll])

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            const index = viewableItems[0]?.index
            if (index != null) {
                currentIndexRef.current = index
                setCurrentIndex(index)
            }
        },
    ).current

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 60,
        waitForInteraction: false,
    }).current

    const getItemLayout = useCallback(
        (_: ArrayLike<Banner> | null | undefined, index: number) => ({
            length: snapInterval,
            offset: snapInterval * index,
            index,
        }),
        [snapInterval],
    )

    const handlePress = useCallback((link?: Href) => {
        if (link) router.navigate(link)
    }, [])

    const handleScrollBeginDrag = useCallback(() => {
        isDraggingRef.current = true
        stopAutoScroll()
    }, [stopAutoScroll])

    const handleScrollEndDrag = useCallback(() => {
        isDraggingRef.current = false
        startAutoScroll()
    }, [startAutoScroll])

    const renderItem = useCallback(
        ({ item }: { item: Banner }) => (
            <BannerItem item={item} itemWidth={itemWidth} onPress={handlePress} />
        ),
        [itemWidth, handlePress],
    )

    const keyExtractor = useCallback(
        (_: Banner, index: number) => `banner-${index}`,
        [],
    )

    const handleScrollToIndexFailed = useCallback(
        (info: { index: number }) => {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: info.index * snapInterval,
                    animated: false,
                })
            }, 50)
        },
        [snapInterval],
    )

    const contentContainerStyle = useMemo(() => ({ gap: GAP }), [])

    return (
        <View style={{ paddingLeft: 8 }}>
            <FlatList
                ref={flatListRef}
                data={banners}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={snapInterval}
                snapToAlignment="start"
                overScrollMode="never"
                contentContainerStyle={contentContainerStyle}
                keyExtractor={keyExtractor}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
                onMomentumScrollEnd={handleScrollEndDrag}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                getItemLayout={getItemLayout}
                renderItem={renderItem}
                removeClippedSubviews
                initialNumToRender={banners.length}
                maxToRenderPerBatch={banners.length}
                windowSize={3}
            />

            <View
                style={{
                    position: 'absolute',
                    bottom: 8,
                    zIndex: 1,
                    alignSelf: 'center',
                    pointerEvents: 'none',
                }}
            >
                <HorizontalIndicators
                    currentIndex={currentIndex}
                    total={banners.length}
                    color={theme.background.main}
                />
            </View>
        </View>
    )
}

export default HomeCta
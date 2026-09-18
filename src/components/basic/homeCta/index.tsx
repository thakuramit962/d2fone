import { useTheme } from '@/hooks/use-theme'
import { Href } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, ImageSourcePropType, View, type ViewToken } from 'react-native'
import HorizontalIndicators from '../pagination/horizontalIndicators'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width - 32 - 16
const GAP = 6
const AUTO_SCROLL_INTERVAL = 2000

interface Banners {
    img: ImageSourcePropType
    link?: Href

}
const banners: Banners[] = [
    {
        img: require('@/assets/images/static/farmingIllustration.png'),
        // link: '/yieldPredictor'
    },
    {
        img: require('@/assets/images/static/home/banners/yield.png'),
        link: '/yieldPredictor'
    },
    {
        img: require('@/assets/images/static/home/banners/spray.png'),
        link: '/sprayCalculator'
    },
    {
        img: require('@/assets/images/static/home/banners/fertilizer.png'),
        link: '/fertilizerCalculator'
    },
]

const HomeCta = () => {
    const theme = useTheme()
    const flatListRef = useRef<FlatList<number>>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => {
                const next = (prev + 1) % banners.length
                flatListRef.current?.scrollToOffset({
                    offset: next * (ITEM_WIDTH + GAP),
                    animated: true,
                })
                return next
            })
        }, AUTO_SCROLL_INTERVAL)
    }, [])

    const stopAutoScroll = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    useEffect(() => {
        startAutoScroll()
        return () => stopAutoScroll()
    }, [startAutoScroll, stopAutoScroll])

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) {
                setCurrentIndex(viewableItems[0].index)
            }
        }
    ).current

    return (
        <View
            style={{
                // marginHorizontal: -16,
                paddingLeft: 8,
            }}
        >
            <FlatList
                ref={flatListRef}
                data={banners}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="normal"
                snapToInterval={ITEM_WIDTH + GAP}
                snapToAlignment="start"
                contentContainerStyle={{ gap: GAP, }}
                keyExtractor={(_, index) => index.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                onScrollBeginDrag={stopAutoScroll}
                onScrollEndDrag={startAutoScroll}
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH + GAP,
                    offset: (ITEM_WIDTH + GAP) * index,
                    index,
                })}
                renderItem={({ item, index }) => (
                    <Image
                        key={index}
                        source={item?.img}
                        style={{
                            // height: 140,
                            borderRadius: 24,
                            width: ITEM_WIDTH,
                            aspectRatio: 3 / 1,
                        }}
                    />
                )}
            />

            <View
                style={{
                    position: 'absolute',
                    bottom: 8,
                    zIndex: 1,
                    alignSelf: 'center',
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
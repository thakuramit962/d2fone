import { HeartIcon, PauseIcon, PlayIcon } from '@/components/icons'
import { CommunityPostMediaType } from '@/models/communityPost'
import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    View,
    ViewToken,
} from 'react-native'
import ThemeText from '../../text/ThemeText'

interface MediaContentProps {
    media: CommunityPostMediaType[]
    height: number
    focused: boolean
    liked?: boolean
    onToggleLike?: () => void
}

interface MediaSlideProps {
    item: CommunityPostMediaType
    width: number
    height: number
    isActive: boolean
    liked?: boolean
    onToggleLike?: () => void
}

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 }

const ImageSlide = ({
    link,
    width,
    height,
    liked,
    onToggleLike,
}: {
    link: string
    width: number
    height: number
    liked?: boolean
    onToggleLike?: () => void
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    if (hasError) {
        return (
            <View style={[styles.slide, styles.center, { width, height }]}>
                <ThemeText
                    content="Couldn't load media"
                    variant="xs"
                    severity="secondary"
                />
            </View>
        )
    }

    return (
        <View style={[styles.slide, { width, height }]}>
            <Image
                source={{ uri: link }}
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
                onLoadEnd={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false)
                    setHasError(true)
                }}
            />

            {isLoading && (
                <View style={[StyleSheet.absoluteFill, styles.center]}>
                    <ActivityIndicator />
                </View>
            )}

            {onToggleLike && (
                <Pressable
                    onPress={onToggleLike}
                    hitSlop={12}
                    style={styles.likeButton}
                >
                    <HeartIcon
                        size={26}
                        // filled={!!liked}
                        color={liked ? '#f16334' : '#FFFFFF'}
                    />
                </Pressable>
            )}
        </View>
    )
}

const VideoSlide = ({
    link,
    width,
    height,
    isActive,
    liked,
    onToggleLike,
}: {
    link: string
    width: number
    height: number
    isActive: boolean
    liked?: boolean
    onToggleLike?: () => void
}) => {
    const player = useVideoPlayer(link, (p) => {
        p.loop = true
    })
    const [isPlaying, setIsPlaying] = useState(true)

    // Only the slide currently on screen plays; others stay paused so we're
    // not decoding/playing several videos at once.
    useEffect(() => {
        if (isActive) {
            player.play()
        } else {
            player.pause()
        }
    }, [isActive, player])

    // Listeners must be registered once per player instance and cleaned up,
    // otherwise every render adds a new listener (leak) and stale closures
    // pile up.
    useEffect(() => {
        const playingSub = player.addListener('playingChange', (p) =>
            setIsPlaying(p.isPlaying),
        )
        return () => {
            playingSub.remove()
        }
    }, [player])

    const { status } = useEvent(player, 'statusChange', {
        status: player.status,
    })

    // `timeUpdate`'s payload only carries `currentTime` (and buffering info) —
    // `duration` isn't part of it, so it's read straight off the player.
    // Since this re-renders on every `timeUpdate` tick, `player.duration`
    // stays fresh once the source has loaded.
    const { currentTime } = useEvent(player, 'timeUpdate', {
        currentTime: player.currentTime,
        currentLiveTimestamp: null,
        currentOffsetFromLive: null,
        bufferedPosition: player.bufferedPosition ?? 0,
    })
    const duration = player.duration

    const progress =
        duration && duration > 0
            ? Math.min(Math.max(currentTime / duration, 0), 1)
            : 0

    const togglePlayback = useCallback(() => {
        // Bug fix: this used to read `isPlaying ? player.pause : player.play`
        // which only referenced the function without ever calling it.
        if (isPlaying) {
            player.pause()
        } else {
            player.play()
        }
    }, [isPlaying, player])

    if (status === 'error') {
        return (
            <View style={[styles.slide, styles.center, { width, height }]}>
                <ThemeText
                    content="Couldn't load media"
                    variant="xs"
                    severity="secondary"
                />
            </View>
        )
    }

    return (
        <View style={[styles.slide, { width, height }]}>
            <VideoView
                player={player}
                style={StyleSheet.absoluteFill}
                contentFit="contain"
                nativeControls={false}
                fullscreenOptions={{
                    enable: false,
                }}
            />

            {/* Tap-anywhere target to toggle play/pause. Tint only shows
                while paused, so the video isn't washed out during playback. */}
            <Pressable
                onPress={togglePlayback}
                style={[
                    StyleSheet.absoluteFill,
                    styles.center,
                    !isPlaying && styles.pausedTint,
                ]}
            >
                {!isPlaying && status !== 'loading' && (
                    <PlayIcon size={48} opacity={0.9} />
                )}
            </Pressable>

            {status === 'loading' && (
                <View
                    style={[StyleSheet.absoluteFill, styles.center]}
                    pointerEvents="none"
                >
                    <ActivityIndicator />
                </View>
            )}

            {/* Small persistent play/pause indicator, top-left */}
            <Pressable
                onPress={togglePlayback}
                hitSlop={12}
                style={styles.playPauseButton}
            >
                {isPlaying ? (
                    <PauseIcon size={18} opacity={0.9} />
                ) : (
                    <PlayIcon size={18} opacity={0.9} />
                )}

            </Pressable>

            {onToggleLike && (
                <Pressable
                    onPress={onToggleLike}
                    hitSlop={12}
                    style={styles.likeButton}
                >
                    <HeartIcon
                        size={26}
                        // filled={!!liked}
                        color={liked ? '#f16334' : '#FFFFFF'}
                    />
                </Pressable>
            )}

            {/* Scrub/progress track */}
            <View style={styles.trackContainer} pointerEvents="none">
                <View style={styles.trackBackground}>
                    <View
                        style={[
                            styles.trackFill,
                            { width: `${progress * 100}%` },
                        ]}
                    />
                </View>
            </View>
        </View>
    )
}

const MediaSlide = memo(
    ({ item, width, height, isActive, liked, onToggleLike }: MediaSlideProps) =>
        item.type === 'img' ? (
            <ImageSlide
                link={item.link}
                width={width}
                height={height}
                liked={liked}
                onToggleLike={onToggleLike}
            />
        ) : (
            <VideoSlide
                link={item.link}
                width={width}
                height={height}
                isActive={isActive}
                liked={liked}
                onToggleLike={onToggleLike}
            />
        ),
)
MediaSlide.displayName = 'MediaSlide'

const MediaContent = ({ media, height, focused, liked, onToggleLike }: MediaContentProps) => {
    const [containerWidth, setContainerWidth] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const activeIndexRef = useRef(0)

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width)
        setContainerHeight(event.nativeEvent.layout.height)
    }, [])

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            const first = viewableItems[0]?.index
            if (first != null && first !== activeIndexRef.current) {
                activeIndexRef.current = first
                setActiveIndex(first)
            }
        },
    ).current

    const renderItem = useCallback(
        ({ item, index }: { item: CommunityPostMediaType; index: number }) => (
            <MediaSlide
                item={item}
                width={containerWidth}
                height={containerHeight}
                isActive={index === activeIndex && focused}
                liked={liked}
                onToggleLike={onToggleLike}
            />
        ),
        [containerWidth, containerHeight, activeIndex, focused, liked, onToggleLike],
    )

    const keyExtractor = useCallback(
        (item: CommunityPostMediaType, index: number) => `${item.type}-${index}-${item.link}`,
        [],
    )

    if (!media || media.length === 0) {
        return (
            <View style={[styles.center, { height }]}>
                <Image source={require('@/assets/images/static/d2f.png')} style={{ height: 120, width: 200, resizeMode: 'contain' }} />
            </View>
        )
    }

    return (
        <View style={{ height, flex: 1 }} onLayout={onLayout}>
            {containerWidth > 0 && (
                <FlatList
                    data={media}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    onViewableItemsChanged={onViewableItemsChanged}
                    getItemLayout={(_, index) => ({
                        length: containerWidth,
                        offset: containerWidth * index,
                        index,
                    })}
                    removeClippedSubviews
                    initialNumToRender={1}
                    maxToRenderPerBatch={2}
                    windowSize={3}
                />
            )}

            {media.length > 1 && (
                <View style={styles.pagination} pointerEvents="none">
                    {media.map((item, index) => (
                        <View
                            key={`dot-${index}-${item.link}`}
                            style={[
                                styles.dot,
                                index === activeIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    slide: {
        backgroundColor: '#0000000D',
        overflow: 'hidden',
    },

    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    pausedTint: {
        backgroundColor: '#00000066',
    },

    pagination: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF80',
    },

    dotActive: {
        width: 16,
        backgroundColor: '#FFFFFF',
    },

    likeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00000055',
        alignItems: 'center',
        justifyContent: 'center',
    },

    playPauseButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#00000055',
        alignItems: 'center',
        justifyContent: 'center',
    },

    trackContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 22,
    },

    trackBackground: {
        height: 3,
        borderRadius: 2,
        backgroundColor: '#FFFFFF40',
        overflow: 'hidden',
    },

    trackFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
})

export default memo(MediaContent)
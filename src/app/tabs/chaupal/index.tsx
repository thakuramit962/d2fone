import ScreenView from '@/components/basic/containers/screenView'
import CommunityPostCardSkelton from '@/components/basic/pages/chaupal/communityPostCardSkelton'

import { mapApiPostsToReels } from '@/components/basic/pages/chaupal/typePostMapper'
import Skelton from '@/components/basic/Skelton'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeChip from '@/components/basic/ThemeChip'
import { PlusIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import useCommunityPosts from '@/hooks/useCommunityPosts'
import { CommunityPost, CommunityPostReel } from '@/models/communityPost'
import { RootState } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import { router, useFocusEffect } from 'expo-router'
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { useTranslation } from 'react-i18next'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ListRenderItemInfo, RefreshControl,
    StyleSheet, View,
    ViewToken
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const CommunityPostCard = lazy(() => import('@/components/basic/pages/chaupal/communityPostCard'))
const FeedDetail = lazy(() => import('@/components/basic/pages/chaupal/feedDetail'))

const { width } = Dimensions.get('window')
const CARD_HORIZONTAL_MARGIN = 4
const IMAGE_HEIGHT = width * 0.58
const PAGE_LIMIT = 10


// Empty / Error states
// ---------------------------------------------------------------------------

const EmptyState = () => {
    const { t } = useTranslation()

    return (
        <View style={styles.center}>
            <View style={styles.emptyIconCircle}>
                <ThemeText content="🌾" style={styles.emptyIcon} />
            </View>
            <ThemeText content={t('feeds.noPosts')} style={styles.emptyTitle} />
            <ThemeText
                content={t('feeds.shareSomething')}
                style={styles.emptyText}
            />
        </View>
    )
}

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <View style={styles.center}>
        <View style={styles.errorIconCircle}>
            <ThemeText content="!" style={styles.errorIconText} />
        </View>
        <ThemeText content={message} style={styles.errorText} />
        <ThemeChip label="Retry" onPress={onRetry} />
    </View>
)




const Chaupal = () => {

    const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn)

    const theme = useTheme()
    const { t } = useTranslation()
    const { fetchLikes } = useCommunityPosts()
    const scrollRef = useRef<FlatList>(null);


    const [posts, setPosts] = useState<CommunityPostReel[]>([])
    const [selected, setSelected] = useState<CommunityPostReel | null>(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { top, bottom, } = useSafeAreaInsets()
    const REEL_HEIGHT = dimensions?.height - (top + bottom + 64)

    const [activePostIndex, setActivePostIndex] = useState(0)

    const fetchPosts = useCallback(
        async ({ isRefresh = false, isLoadMore = false, pageOverride }: {
            isRefresh?: boolean
            isLoadMore?: boolean
            pageOverride?: number
        } = {}) => {
            const targetPage = pageOverride ?? (isLoadMore ? page + 1 : 1)

            try {
                if (isRefresh) setRefreshing(true)
                else if (isLoadMore) setLoadingMore(true)
                else setLoading(true)

                setError(null)

                const res = await API.get(
                    `/v1/community-posts?limit=${PAGE_LIMIT}&page=${targetPage}`,
                )

                if (res.data?.status === 'success') {
                    const fetched: CommunityPost[] = res.data?.data?.data || []
                    const reels: CommunityPostReel[] = mapApiPostsToReels(fetched)
                    setPosts((prev) => (isLoadMore ? [...prev, ...reels] : reels))
                    setPage(targetPage)
                    setHasMore(fetched.length >= PAGE_LIMIT)
                } else {
                    setError('Unable to fetch community posts.')
                }
            } catch (err) {
                console.error('Error fetching community posts', err)
                setError('Something went wrong while loading posts.')
            } finally {
                setLoading(false)
                setRefreshing(false)
                setLoadingMore(false)
            }
        },
        [page],
    )

    useEffect(() => {
        fetchPosts()
        isLoggedIn && fetchLikes()
    }, [])

    const handleRefresh = useCallback(() => {
        setHasMore(true)
        fetchPosts({ isRefresh: true, pageOverride: 1 })
    }, [fetchPosts])

    const handleLoadMore = useCallback(() => {
        if (loadingMore || loading || refreshing || !hasMore) return
        fetchPosts({ isLoadMore: true })
    }, [fetchPosts, loadingMore, loading, refreshing, hasMore])

    const onViewableChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]?.index != null) {
            setActivePostIndex(viewableItems[0].index)
        }
    }).current

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 100,
    }).current


    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<CommunityPost>) =>
            <Suspense fallback={<CommunityPostCardSkelton height={REEL_HEIGHT} />}>
                <CommunityPostCard
                    post={item}
                    height={REEL_HEIGHT}
                    setSelected={setSelected}
                    focused={activePostIndex == index}
                />
            </Suspense>,
        [activePostIndex, REEL_HEIGHT],
    )


    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );

    return (
        <>
            <ScreenView bg={theme?.background.slate}>
                <Header withoutTopPadding backIcon label={t('feeds.title')} bg='transparent'
                    rightSlot={
                        <>
                            <ThemeButton icon={PlusIcon} label={t('feeds.createPost')}
                                onPress={() => router.navigate('/tabs/chaupal/createPost')}
                                variant='xs'
                                buttonStyle={{
                                    height: 30,
                                    width: 90
                                }} />
                        </>
                    } />

                {loading ? (
                    <CommunityPostCardSkelton height={REEL_HEIGHT} />
                ) : error && posts.length === 0 ? (
                    <ErrorState message={error} onRetry={() => fetchPosts()} />
                ) : (
                    <>
                        <FlatList
                            ref={scrollRef}
                            keyExtractor={item => item.post_id}
                            pagingEnabled
                            snapToInterval={REEL_HEIGHT}
                            decelerationRate="fast"
                            showsVerticalScrollIndicator={false}
                            onViewableItemsChanged={onViewableChanged}
                            viewabilityConfig={viewabilityConfig}
                            getItemLayout={(_, i) => ({ length: REEL_HEIGHT, offset: REEL_HEIGHT * i, index: i })}
                            data={posts}
                            renderItem={renderItem}
                            contentContainerStyle={styles.content}
                            initialNumToRender={6}
                            maxToRenderPerBatch={6}
                            windowSize={7}
                            removeClippedSubviews
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                />
                            }
                            onEndReachedThreshold={0.4}
                            onEndReached={handleLoadMore}
                            ListEmptyComponent={<EmptyState />}
                        />
                    </>
                )
                }

            </ScreenView>
            <>
                <Suspense fallback={<Skelton dimensions={{ height: REEL_HEIGHT }} content={<ActivityIndicator size={'large'} />} />} >
                    {/* {selected && */}
                    <FeedDetail closeAction={() => setSelected(null)} detail={selected} />
                    {/* } */}
                </Suspense>
            </>
        </>
    )
}

export default Chaupal



const styles = StyleSheet.create({
    content: {
        paddingHorizontal: CARD_HORIZONTAL_MARGIN,
        flexGrow: 1,
    },

    card: {
        borderRadius: 18,
        marginBottom: 16,
        padding: 14,
        borderWidth: StyleSheet.hairlineWidth,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },

    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },

    authorInfo: {
        flex: 1,
        marginLeft: 10,
    },

    authorName: {
        fontSize: 15,
        fontWeight: '700',
    },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },

    categoryPill: {
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },

    categoryPillText: {
        fontSize: 11,
        fontWeight: '600',
    },

    meta: {
        fontSize: 12,
    },

    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },

    description: {
        fontSize: 14,
        lineHeight: 21,
    },

    expandToggle: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 4,
    },

    mediaWrapper: {
        marginTop: 8,
        marginBottom: 6,
    },

    mediaTile: {
        width: '100%',
        height: IMAGE_HEIGHT,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#F2F2F2',
        marginBottom: 8,
    },

    mediaFill: {
        width: '100%',
        height: '100%',
    },

    carouselList: {
        borderRadius: 14,
    },

    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: -14,
        marginBottom: 8,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    dotActive: {
        backgroundColor: '#000000',
        width: 16,
    },

    dotInactive: {
        backgroundColor: '#D9D9D9',
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#000000',
        paddingTop: 10,
        marginTop: 4,
    },

    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingRight: 10,
    },

    likeIcon: {
        fontSize: 19,
    },

    likeText: {
        fontSize: 14,
        backgroundColor: '#000000',
        fontWeight: '600',
    },

    readMore: {
        fontSize: 14,
        fontWeight: '600',
        backgroundColor: '#000000',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 80,
        gap: 8,
    },

    loadingText: {
        backgroundColor: '#000000',
    },

    footerLoader: {
        paddingVertical: 20,
    },

    // Empty state
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },

    emptyIcon: {
        fontSize: 28,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#000000',
    },

    emptyText: {
        fontSize: 13,
        backgroundColor: '#83838360',
        textAlign: 'center',
    },

    // Error state
    errorIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FDECEA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },

    errorIconText: {
        fontSize: 22,
        fontWeight: '700',
    },

    errorText: {
        textAlign: 'center',
        marginBottom: 4,
    },

    // Skeleton
    skeletonCard: {
        shadowOpacity: 0,
        elevation: 0,
    },

    skeletonBlock: {
        backgroundColor: '#83838360',
    },

    skeletonLine: {
        backgroundColor: '#83838360',
        borderRadius: 6,
    },
})
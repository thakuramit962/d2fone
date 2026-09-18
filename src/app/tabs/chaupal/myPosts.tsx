import BottomSheet from '@/components/basic/bottomSheet'
import CompanyFooter from '@/components/basic/companyFooter'
import ScreenView from '@/components/basic/containers/screenView'
import MyPostItem from '@/components/basic/pages/chaupal/myPostItem'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { CommunityPost } from '@/models/communityPost'
import { dimensions } from '@/utils/app-helper'
import { router, useFocusEffect, useNavigation } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    ActivityIndicator,
    FlatList,
    Image,
    ListRenderItemInfo,
    RefreshControl,
    View
} from 'react-native'

const PAGE_SIZE = 10
const MY_POSTS_ENDPOINT = '/v1/my-post'

type MediaType = 'image' | 'video'

type SelectedMedia = {
    link: string
    type: MediaType
} | null

const getPostKey = (post: CommunityPost) => String(post.id ?? post.title)

const MyPosts = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const scrollRef = useRef<FlatList>(null);
    const navigation = useNavigation()

    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>(null)

    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const isMountedRef = useRef(true)
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const fetchMyPosts = useCallback(
        async (opts: { isRefresh?: boolean; isLoadMore?: boolean; pageOverride?: number } = {}) => {
            const { isRefresh = false, isLoadMore = false, pageOverride } = opts
            const targetPage = pageOverride ?? (isLoadMore ? page + 1 : 1)

            if (isRefresh) setRefreshing(true)
            else if (isLoadMore) setLoadingMore(true)
            else setLoading(true)

            setError(null)

            try {
                const res = await API.get(`${MY_POSTS_ENDPOINT}?limit=${PAGE_SIZE}&page=${targetPage}`)
                if (!isMountedRef.current) return

                if (res.data?.status === 'success') {
                    const fetched: CommunityPost[] = res.data?.data?.data ?? []
                    setPosts((prev) => (isLoadMore ? [...prev, ...fetched] : fetched))
                    setPage(targetPage)
                    setHasMore(fetched.length >= PAGE_SIZE)
                } else {
                    setError('Unable to fetch your posts. Please try again.')
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setError('Something went wrong while loading posts.')
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false)
                    setRefreshing(false)
                    setLoadingMore(false)
                }
            }
        },
        [page]
    )

    useEffect(() => {
        fetchMyPosts({ pageOverride: 1 })
    }, [])

    const handleRefresh = useCallback(() => {
        setHasMore(true)
        fetchMyPosts({ isRefresh: true, pageOverride: 1 })
    }, [fetchMyPosts])

    const handleLoadMore = useCallback(() => {
        if (loadingMore || loading || refreshing || !hasMore) return
        fetchMyPosts({ isLoadMore: true })
    }, [fetchMyPosts, loadingMore, loading, refreshing, hasMore])

    const link = selectedMedia?.link ?? ''
    const player = useVideoPlayer(link, (p) => {
        p.loop = false
    })

    const closeMediaSheet = useCallback(() => {
        try {
            player.pause()
        } catch {
        }
        setSelectedMedia(null)
    }, [player])

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<CommunityPost>) => (
            <MyPostItem detail={item} setSelectedMedia={setSelectedMedia} useFor='self' />
        ),
        []
    )

    const listFooter = useCallback(
        () => (
            <View>
                {loadingMore && (
                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                        <ActivityIndicator color={theme.text.primary} />
                    </View>
                )}
                {posts.length > 0 && (
                    <>
                        <ThemeDivider size={48} />
                        <CompanyFooter withoutBottomPadding />
                    </>
                )}
            </View>
        ),
        [loadingMore, posts.length, theme.text.primary]
    )


    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );


    return (
        <>
            <ScreenView>
                <Header
                    label={t('myPostItem.title')}
                    description={t('myPostItem.description')}
                    withoutTopPadding
                    backAction={() => {
                        if (router.canDismiss()) {
                            router.dismissAll()
                        }
                        // navigation.reset({
                        //     index: 0,
                        //     routes: [{ name: '/tabs/chaupal' as never }],
                        // })
                        navigation.goBack()
                    }}
                    rightSlot={
                        <>
                            <ThemeButton
                                // icon={PlusIcon}
                                label={t('myPostItem.createPost')}
                                onPress={() => router.navigate('/tabs/chaupal/createPost')}
                                variant='xs'
                                buttonStyle={{
                                    height: 30,
                                    width: 110
                                }} />
                        </>
                    } />

                {loading && posts.length === 0 ? (
                    <View style={{ paddingTop: 48, alignItems: 'center' }}>
                        <ActivityIndicator color={theme.text.primary} />
                    </View>
                ) : error && posts.length === 0 ? (
                    <View style={{ paddingTop: 48, alignItems: 'center', gap: 8 }}>
                        <ThemeText content={error} variant='sm' severity='secondary' />
                        <ActionText label='RETRY' withIcon={false} severity='main' action={() => fetchMyPosts({ pageOverride: 1 })} />
                    </View>
                ) : (
                    <FlatList
                        ref={scrollRef}
                        data={posts}
                        keyExtractor={getPostKey}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            paddingHorizontal: 8,
                            gap: 8,
                            flexGrow: 1,
                        }}
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={7}
                        removeClippedSubviews
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={listFooter}
                        ListEmptyComponent={
                            <View style={{ paddingTop: 48, alignItems: 'center' }}>
                                <ThemeText content={t('myPostItem.noPosts')} variant='sm' severity='secondary' />
                            </View>
                        }
                    />
                )}
            </ScreenView>

            {selectedMedia && (
                <BottomSheet height={dimensions.height - 120} onClose={closeMediaSheet} visible={Boolean(selectedMedia)}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingBottom: 32,
                        }}
                    >
                        {selectedMedia.type === 'image' && (
                            <Image
                                source={{ uri: selectedMedia.link }}
                                style={{
                                    width: dimensions.width - 32,
                                    height: dimensions.height - 240,
                                    marginHorizontal: 'auto',
                                    backgroundColor: theme.background.slate,
                                }}
                                resizeMode='contain'
                                borderRadius={16}
                            />
                        )}
                        {selectedMedia.type === 'video' && (
                            <VideoView
                                player={player}
                                style={{
                                    width: dimensions.width - 32,
                                    height: dimensions.height - 240,
                                    marginHorizontal: 'auto',
                                    backgroundColor: theme.background.slate,
                                }}
                                contentFit='contain'
                                nativeControls
                                fullscreenOptions={{
                                    enable: true,
                                }}
                            />
                        )}
                        <ActionText label='CLOSE' withIcon={false} severity='main' action={closeMediaSheet} />
                    </View>
                </BottomSheet>
            )}
        </>
    )
}

export default MyPosts
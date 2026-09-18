import ThemeText from '@/components/basic/text/ThemeText'
import ThemeChip from '@/components/basic/ThemeChip'
import { HeartIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { CommunityPost } from '@/models/communityPost'
import { dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FlatList,
    Image,
    ListRenderItemInfo,
    Pressable,
    TouchableHighlight,
    View
} from 'react-native'

type MediaType = 'image' | 'video'

type SelectedMedia = {
    link: string
    type: MediaType
} | null


const MyPostItem = memo(
    ({
        detail,
        setSelectedMedia,
        useFor
    }: {
        detail: CommunityPost
        setSelectedMedia?: React.Dispatch<React.SetStateAction<SelectedMedia>>
        useFor?: 'home' | 'self'
    }) => {
        const theme = useTheme()
        const { t } = useTranslation()
        const [expanded, setExpanded] = useState(false)

        const images: NonNullable<SelectedMedia>[] = (detail.image_url ?? []).map((el) => ({
            link: el,
            type: 'image',
        }))
        const videos: NonNullable<SelectedMedia>[] = (detail.video_link ?? []).map((el) => ({
            link: el,
            type: 'video',
        }))
        const mediaLinks: NonNullable<SelectedMedia>[] = [...images, ...videos]

        const renderMediaItem = useCallback(
            ({ item }: ListRenderItemInfo<NonNullable<SelectedMedia>>) => (
                <TouchableHighlight onPress={() =>
                    useFor == 'self'
                        ? setSelectedMedia?.({ link: item.link, type: item.type })
                        : router.navigate('/tabs/chaupal')
                }>
                    <Image
                        source={
                            item.type === 'image' ?
                                { uri: item.link }
                                : require('@/assets/images/static/video-thumb.png')
                        }
                        style={{
                            width: dimensions.width * 0.8,
                            height: 240,
                            backgroundColor: theme.background.slate,
                        }}
                        resizeMode={useFor == 'self' ? 'cover' : 'cover'}
                        borderRadius={16}
                    />
                </TouchableHighlight>
            ),
            [setSelectedMedia, theme.background.slate]
        )

        return (
            <Pressable
                onPress={() => useFor == 'self'
                    ? setExpanded((prev) => !prev)
                    : router.navigate('/tabs/chaupal')
                }
                style={{
                    borderRadius: 24,
                    padding: 12,
                    borderWidth: 1,
                    gap: 6,
                    borderColor: `${theme.text.primary}25`,
                }}
            >
                {useFor == 'self' &&
                    <ThemeChip
                        label={detail.approved_status === 1 ? t('myPostItem.status.published') : t('myPostItem.status.underReview')}
                        severity={detail.approved_status === 1 ? 'primary' : 'warning'}
                        type='solid'
                        containerStyle={{ alignSelf: 'flex-start' }}
                    />
                }
                <View>
                    <ThemeText content={detail.title} fontFamily='MontserratSemiBold' variant='xs' />
                    {detail.description && (
                        <ThemeText
                            content={detail.description}
                            variant='xs'
                            severity='secondary'
                            numberOfLines={expanded ? undefined : 2}
                        />
                    )}
                </View>

                {mediaLinks.length > 0 && (
                    <FlatList
                        data={mediaLinks}
                        keyExtractor={(item, index) => `${item.type}-${item.link}-${index}`}
                        snapToAlignment='start'
                        snapToInterval={dimensions.width * 0.8}
                        pagingEnabled
                        decelerationRate='fast'
                        renderItem={renderMediaItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: 8,
                        }}
                    />
                )}

                <View style={{
                    flexDirection: 'row',
                    gap: 6,
                    alignItems: 'center',
                }}>
                    <HeartIcon size={20} />
                    <ThemeText content={detail?.likes > 0 ? t('myPostItem.status.published', { count: detail?.likes }) : t('myPostItem.likes.none')} />
                </View>
            </Pressable>
        )
    }
)


export default MyPostItem
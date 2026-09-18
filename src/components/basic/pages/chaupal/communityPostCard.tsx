import { useTheme } from '@/hooks/use-theme'
import { CommunityPostReel } from '@/models/communityPost'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { memo, useCallback, useMemo } from 'react'
import {
    Image,
    Pressable,
    StyleSheet,
    View
} from 'react-native'

import { LinkIcon } from '@/components/icons'
import ThemeText from '../../text/ThemeText'
import LikeButton from './likeButton'
import MediaContent from './mediaContent'
import PostShareButton from './postShareButton'

interface CommunityPostCardProps {
    post: CommunityPostReel
    height: number
    setSelected: (post: CommunityPostReel) => void
    focused: boolean
}

const DEFAULT_AVATAR = require('@/assets/images/static/user.png')


const CommunityPostCard = ({
    post,
    height,
    setSelected,
    focused
}: CommunityPostCardProps) => {
    const theme = useTheme()
    const styles = useMemo(() => makeStyles(theme), [theme])

    const mediaHeight = Math.max(180, height * 0.55)

    const handleSelect = useCallback(() => {
        setSelected(post)
    }, [post, setSelected])


    return (
        <LinearGradient
            colors={[theme.background.main, theme.background.slate]}
            style={[styles.card, { height }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.authorRow}>
                    <Image
                        source={post.avtar ? { uri: `${post?.avtar}` } : DEFAULT_AVATAR}
                        style={styles.avatar}
                        accessibilityLabel={`${post.name}'s avatar`}
                    />

                    <View style={styles.authorMeta}>
                        <ThemeText
                            content={post.name}
                            fontFamily="InterSemiBold"
                            variant="xs"
                            numberOfLines={1}
                        />

                        <ThemeText
                            content={dayjs(post.updated_at).fromNow()}
                            fontFamily="InterRegular"
                            variant="xxs"
                            severity="secondary"
                        />
                    </View>
                    <Pressable
                        onPress={handleSelect}
                    >
                        <LinkIcon />
                    </Pressable>
                </View>

            </View>

            {/* Content */}
            <Pressable
                onPress={handleSelect}
                style={styles.content}
                accessibilityRole="button"
                accessibilityLabel={`Open post: ${post.title}`}
            >
                <ThemeText
                    content={post.title}
                    fontFamily="MontserratSemiBold"
                    variant='xs'
                    numberOfLines={2}
                />

                {!!post.description && (
                    <ThemeText
                        content={post.description}
                        numberOfLines={post?.media && post?.media?.length > 0 ? 2 : undefined}
                        variant='xs'
                        severity="secondary"
                    />
                )}
            </Pressable>

            {/* Media */}
            <View style={styles.mediaContainer}>
                {post?.media && <MediaContent media={post?.media} height={mediaHeight} focused={focused} />}

                {/* Like button */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 8,
                        alignSelf: "center",
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: "center",

                        gap: 8,
                    }}
                >
                    <LikeButton post_id={post?.post_id} like={post.likes} />
                    <PostShareButton post={post} />
                </View>
            </View>
        </LinearGradient>
    )
}

export default memo(CommunityPostCard)

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        card: {
            width: '100%',
            borderRadius: 24,
            overflow: 'hidden',
            padding: 10,
        },

        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 4,
            marginTop: 4,
        },

        authorRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginRight: 8,
        },

        avatar: {
            width: 36,
            height: 36,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: `${theme.text.primary}30`,
            backgroundColor: `${theme.text.disabled}30`,
        },

        authorMeta: {
            flex: 1,
        },

        shareButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            backgroundColor: `${theme.text.disabled}55`,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },

        shareButtonPressed: {
            opacity: 0.65,
            transform: [{ scale: 0.96 }],
        },

        shareLabel: {
            lineHeight: 13,
        },

        content: {
            paddingHorizontal: 4,
            paddingTop: 8,
            paddingBottom: 10,
        },

        mediaContainer: {
            flex: 1,
            minHeight: 180,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: `${theme.text.primary}20`,
            position: 'relative',
        },

        likeButton: {
            position: 'absolute',
            // Sits above the media carousel's pagination dots rather than
            // overlapping them.
            bottom: 26,
            alignSelf: 'center',

            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,

            backgroundColor: theme.text.primary,
            borderRadius: 18,

            paddingHorizontal: 14,
            paddingRight: 18,
            paddingVertical: 8,
        },

        likeButtonActive: {
            backgroundColor: theme.text.disabled ?? theme.text.primary,
        },

        likeButtonPressed: {
            opacity: 0.75,
            transform: [{ scale: 0.96 }],
        },
    })
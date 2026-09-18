import { SendIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { CommunityPostReel } from '@/models/communityPost'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import { useCallback } from 'react'
import { Alert, Platform, Pressable, Share } from 'react-native'

interface SharePayload {
    title: string
    message: string
    deepLink: string
}

const buildDeepLink = (postId: string): string =>
    Linking.createURL(`tabs/chaupal/${postId}`)

const buildSharePayload = (post: CommunityPostReel): SharePayload => {
    const deepLink = buildDeepLink(post.post_id)

    return {
        title: `${post.title} on D2F`,
        message: [post.title, post.description, '📲 Open in D2F:', deepLink].join(
            '\n',
        ),
        deepLink,
    }
}

const PostShareButton = ({ post }: { post: CommunityPostReel }) => {

    const theme = useTheme()

    const handleShare = useCallback(async () => {
        const payload = buildSharePayload(post)

        try {
            await Share.share(
                Platform.OS === 'ios'
                    ? {
                        title: payload.title,
                        message: payload.message,
                        url: payload.deepLink,
                    }
                    : {
                        title: payload.title,
                        message: payload.message,
                    },
                {
                    dialogTitle: 'Share this post',
                    subject: payload.title,
                },
            )
        } catch (error) {
            if (error instanceof Error && !/cancel|dismiss/i.test(error.message)) {
                Alert.alert(
                    'Share failed',
                    'Could not open the share sheet. You can copy the link instead.',
                    [
                        {
                            text: 'Copy link',
                            onPress: async () => {
                                await Clipboard.setStringAsync(payload.deepLink)
                            },
                        },
                        { text: 'Cancel', style: 'cancel' },
                    ],
                )
            }
        }
    }, [post])


    return (
        <Pressable
            onPress={handleShare}
            style={{
                backgroundColor: `${theme.text.primary}`,
                borderRadius: 28,
                borderCurve: 'continuous',
                height: 72, width: 72,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <SendIcon color={theme.background.main} size={32} />
        </Pressable>
    )
}

export default PostShareButton
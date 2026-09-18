import { HeartIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import useCommunityPosts from '@/hooks/useCommunityPosts'
import { useToast } from '@/hooks/useToast'
import { RootState } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import ThemeText from '../../text/ThemeText'

type Props = { post_id: string; like: number }
const DOUBLE_TAP_DELAY = 300

const LikeButton = memo(({ post_id, like }: Props) => {
    const theme = useTheme()
    const { likePost, isLiked } = useCommunityPosts()
    const { showToast } = useToast()
    const isLoggedIn = useSelector((s: RootState) => s.auth?.isLoggedIn)

    const alreadyLiked = useMemo(() => isLiked(post_id), [isLiked, post_id])
    const [boom, setBoom] = useState(false)

    const lastTap = useRef(0)
    const singleTapTimeout = useRef<NodeJS.Timeout | null>(null)

    const triggerLike = useCallback(async () => {
        if (!isLoggedIn) {
            router.navigate('/login')
            return
        }
        try {
            if (!alreadyLiked) setBoom(true)
            await likePost(post_id, alreadyLiked ? 'unlike' : 'like')
        } catch {
            setBoom(false)
            showToast('Error', `Couldn't like this post. Try again`, 'error')
        }
    }, [post_id, alreadyLiked, isLoggedIn, likePost, showToast])

    // double tap handler
    const handlePress = useCallback(() => {
        if (alreadyLiked) {
            triggerLike()
            return
        }
        const now = Date.now()
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            if (singleTapTimeout.current) clearTimeout(singleTapTimeout.current)
            triggerLike()
        } else {
            singleTapTimeout.current = setTimeout(() => {
            }, DOUBLE_TAP_DELAY)
        }
        lastTap.current = now
    }, [triggerLike])

    const formatCount = (count: number): string => {
        if (count < 1000) return `${count}`
        if (count < 1_000_000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`
        return `${(count / 1_000_000).toFixed(1)}m`
    }


    const likeLabel = useMemo(() => {
        if (like === 0 && !alreadyLiked) return 'No likes yet'
        const suffix = like === 1 ? '' : 's'
        return alreadyLiked ? `You + ${formatCount(like)} user${suffix}` : `Liked by ${formatCount(like)} user${suffix}`
    }, [like, alreadyLiked])

    const styles = useMemo(() => makeStyles(theme), [theme])

    return (
        <Pressable onPress={handlePress} style={[
            styles.button,
            {
                paddingBottom: alreadyLiked ? 16 : 4,
                flex: 1
            }
        ]}
            hitSlop={8}>
            <HeartIcon
                size={42}
                fill={alreadyLiked ? '#fe0d5a' : 'transparent'}
                strokeWidth={alreadyLiked ? 0 : 0.75}
                color={theme.background.main}
            />
            <View style={styles.textContainer}>
                <ThemeText content={alreadyLiked ? 'Liked' : 'Like it'} color={theme.background.main} variant="sm" fontFamily="MontserratSemiBold" />
                <ThemeText color={theme.background.slate} fontFamily="InterMediumItalic" content={likeLabel} />
            </View>

            {!alreadyLiked &&
                <ThemeText style={{
                    width: dimensions.width * 0.30,
                    marginHorizontal: 'auto',
                    textAlign: 'center',
                }}
                    size={8}
                    color={`${theme.background.slate}75`} fontFamily="InterRegular" content={'Double tap to like'} />
            }
            {boom && (
                <LottieView
                    source={require('@/assets/lottie/success.json')}
                    speed={1.2}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => setBoom(false)}
                    style={styles.lottie}
                />
            )}
        </Pressable>
    )
})

LikeButton.displayName = 'LikeButton'
export default LikeButton

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        button: {
            backgroundColor: `${theme.text.primary}90`,
            borderRadius: 28,
            borderCurve: 'continuous',
            padding: 16, paddingBottom: 4,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 8,
            maxWidth: 320,
        },
        textContainer: {
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderColor: `${theme.background.main}25`,
            paddingLeft: 16,
        },
        lottie: {
            position: 'absolute',
            height: 100,
            width: 100,
            top: -20,
            left: 16,
            zIndex: -1,
            pointerEvents: 'none',
        },
    })
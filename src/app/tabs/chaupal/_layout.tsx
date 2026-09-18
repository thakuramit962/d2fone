import { RootState } from '@/store/store'
import { Stack, router, useNavigation } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ChaupalLayout = () => {
    const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn)
    const navigation = useNavigation()

    const guardListener = useCallback(() => ({
        focus: () => {
            if (!isLoggedIn) {
                router.replace('/login')
            }
        },
    }), [isLoggedIn])

    // Reset to initial route whenever you leave this stack
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // dismiss all pushed screens in this stack
            if (router.canDismiss()) {
                router.dismissAll()
            }
        })
        return unsubscribe
    }, [navigation])

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom',
            }}
            initialRouteName="index"
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="myPosts" listeners={guardListener} />
            <Stack.Screen name="createPost" listeners={guardListener} />
            <Stack.Screen name="[id]" listeners={guardListener} />
        </Stack>
    )
}

export default ChaupalLayout
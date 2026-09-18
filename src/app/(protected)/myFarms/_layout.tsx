import { RootState } from '@/store/store'
import { router, Stack } from 'expo-router'
import { useSelector } from 'react-redux'

const FarmsLayout = () => {
    const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn)
    const guardListener = () => ({
        focus: () => {
            if (!isLoggedIn) {
                router.replace('/login')
            }
        },
    })
    return (
        <Stack
            initialRouteName='index'
            screenListeners={guardListener}
            screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom'
            }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='addFarm' />
            <Stack.Screen name='[id]' />
        </Stack>
    )
}

export default FarmsLayout
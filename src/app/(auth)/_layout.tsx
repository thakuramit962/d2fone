import { RootState } from '@/store/store'
import { router, Stack } from 'expo-router'
import { useSelector } from 'react-redux'

const AuthLayout = () => {

    const user = useSelector((state: RootState) => state.auth)

    return (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName={'login'}
            screenListeners={() => ({
                focus: () => {
                    if ((user?.isLoggedIn))
                        router.canGoBack() ? router.back() : router.navigate('/tabs/home')
                }
            })}

        >
            <Stack.Screen name="login" />
            <Stack.Screen name="loginWithPassword" />
            <Stack.Screen name="register" />
        </Stack>
    )
}

export default AuthLayout
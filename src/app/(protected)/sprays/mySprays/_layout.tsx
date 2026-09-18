import { Stack } from 'expo-router'

const MySprayLayout = () => {
    return (
        <Stack
            initialRouteName='index'
            screenOptions={{
                headerShown: false,

            }}>
            <Stack.Screen name='index' />

        </Stack>
    )
}

export default MySprayLayout
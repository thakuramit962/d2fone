import { Stack } from 'expo-router'

const SmartToolsLayout = () => {
    return (
        <Stack initialRouteName='index' screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
            <Stack.Screen name="index" />
        </Stack>
    )
}

export default SmartToolsLayout
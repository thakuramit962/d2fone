import { Stack } from 'expo-router'

const DisaterAlertsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
            initialRouteName={'index'}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" />

        </Stack>
    )
}

export default DisaterAlertsLayout
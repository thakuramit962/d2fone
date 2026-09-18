import { Stack } from 'expo-router'

const WeatherLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
            initialRouteName={'index'}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="weatherForecast" />
            <Stack.Screen name="disaterAlerts" />

        </Stack>
    )
}

export default WeatherLayout
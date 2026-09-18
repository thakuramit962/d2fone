import { Stack } from 'expo-router'

const FeedbackLayout = () => {
    return (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName={'index'}
        >
            <Stack.Screen name="index" />
        </Stack>
    )
}

export default FeedbackLayout
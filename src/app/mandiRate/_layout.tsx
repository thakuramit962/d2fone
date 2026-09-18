import { Stack } from 'expo-router'

const MandiRateLayout = () => {
    return (
        <Stack initialRouteName='index' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='index' />
        </Stack>
    )
}

export default MandiRateLayout
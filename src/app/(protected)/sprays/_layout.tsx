import { Stack } from 'expo-router'

const SprayLayout = () => {
    return (
        <Stack initialRouteName='index' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='mySprays' />
            <Stack.Screen name='droneSprays' />
            <Stack.Screen name='tractorSprays' />
            <Stack.Screen name='boomSprays' />
            <Stack.Screen name='manualSprays' />

            <Stack.Screen name='sprayTimeline' />


            <Stack.Screen name='bookSpray' />
        </Stack>
    )
}

export default SprayLayout
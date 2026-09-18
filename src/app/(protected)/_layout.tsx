// app/(app)/_layout.tsx
import { RootState } from '@/store/store';
import { Redirect, Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function ProtectedLayout() {

    const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn ?? false);

    if (!isLoggedIn) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
            <Stack.Screen name="myFarms" />
            <Stack.Screen name="sprays" />
            <Stack.Screen name="mySubscription" />
            <Stack.Screen name="yieldPredictor" />
            <Stack.Screen name="sprayCalculator" />
            <Stack.Screen name="fertilizerCalculator" />
            <Stack.Screen name="agricoins" />
            <Stack.Screen name="fylloServices" />
            <Stack.Screen name="eCom" />

            <Stack.Screen name="editprofile" />
            <Stack.Screen name="manageAccount" />
            <Stack.Screen name="myNotifications" />

            <Stack.Screen name="smartTools" />
        </Stack>
    );
}

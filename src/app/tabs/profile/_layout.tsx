import { RootState } from '@/store/store';
import { Redirect, Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function ProfileLayout() {
    const isLoggedIn = useSelector(
        (state: RootState) => state.auth.isLoggedIn
    );

    if (!isLoggedIn) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
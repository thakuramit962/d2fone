import LoadingScreen from '@/components/basic/containers/loadingScreen';
import { RootState } from '@/store/store';
import { Redirect, router, useFocusEffect } from 'expo-router';
import { lazy, Suspense, useCallback } from 'react';
import { useSelector } from 'react-redux';
const ProfilePage = lazy(() => import('@/components/basic/pages/profile/profilePage'))

const Profile = () => {
    const isLoggedIn = useSelector(
        (state: RootState) => state.auth.isLoggedIn
    );
    useFocusEffect(
        useCallback(() => {
            if (!isLoggedIn) {
                router.replace('/login');
            }
        }, [isLoggedIn])
    );


    if (!isLoggedIn) {
        return <Redirect href={'/login'} />;
    }

    return (
        <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
        </Suspense>
    )
}

export default Profile
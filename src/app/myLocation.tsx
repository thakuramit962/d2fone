import LoadingScreen from '@/components/basic/containers/loadingScreen'
import Header from '@/components/layout/navigation/Header'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

const LocationDetails = lazy(() => import('@/components/basic/user/locationDetails'))

const MyLocation = () => {

    const { t } = useTranslation()

    return (
        <View style={{ flex: 1 }}>
            <Header
                label={t('myLocation.label')}
                description={t('myLocation.tagline')}
            />
            <Suspense fallback={<LoadingScreen />}>
                <LocationDetails />
            </Suspense>
        </View>
    )
}

export default MyLocation
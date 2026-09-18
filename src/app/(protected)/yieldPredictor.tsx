import LoadingScreen from '@/components/basic/containers/loadingScreen'
import ScreenView from '@/components/basic/containers/screenView'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

const YieldPredictionForm = lazy(() => import('@/components/basic/pages/yieldPrediction/predictionForm'))


const YieldPredictor = () => {

    const theme = useTheme()
    const scrollRef = useScrollToTop()
    const { t } = useTranslation()

    return (
        <>
            <ScreenView>
                <Header
                    label={t('yieldPredictor.title')}
                    bg={theme.background.main}
                    withoutTopPadding
                />

                <ScrollView
                    ref={scrollRef}
                    style={{
                        padding: 8,
                        backgroundColor: theme.background.main
                    }}>
                    {/* form */}
                    <Suspense fallback={<LoadingScreen />}>
                        <YieldPredictionForm />
                    </Suspense>

                </ScrollView>
            </ScreenView>
        </>
    )
}

export default YieldPredictor

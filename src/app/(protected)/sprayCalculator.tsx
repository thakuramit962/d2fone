import React, { lazy, Suspense } from 'react'

import LoadingScreen from '@/components/basic/containers/loadingScreen'
import ScreenView from '@/components/basic/containers/screenView'
import Header from '@/components/layout/navigation/Header'

const SparyCalculatorForm = lazy(() => import('@/components/basic/pages/sprayCalculator/sparyCalculatorForm'))

const SprayCalculator: React.FC = () => {

    return (
        <ScreenView>
            <Header withoutTopPadding label={'Spray Calculator'} />
            <Suspense fallback={<LoadingScreen />}>
                <SparyCalculatorForm />
            </Suspense>
        </ScreenView>
    )
}

export default React.memo(SprayCalculator)
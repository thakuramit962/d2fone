import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'


import LoadingScreen from '@/components/basic/containers/loadingScreen'
import ThemeText from '@/components/basic/text/ThemeText'
import { AuthUserIcon, CalendarIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'

const AssignedDetails = React.lazy(() => import('./assignedDetails'))
const StartDetails = React.lazy(() => import('./startDetails'))
const CompletedDetails = React.lazy(() => import('./completedDetails'))
const DeliveredDetails = React.lazy(() => import('./deliveredDetails'))
const UpdatedDetails = React.lazy(() => import('./updatedDetails'))
const CancelleddDetails = React.lazy(() => import('./cancelleddDetails'))



const TimelineStep = ({ details }: {
    details: any
}) => {


    const theme = useTheme()
    const globalStyle = useGlobalStyle()

    const user = useSelector((state: RootState) => state.auth.isLoggedIn)

    const noDataKeys = ['created', 'acknowledged', ...(+(details?.refundAmount || 0) <= 0 ? ['delivered'] : [])]


    return (
        <View
            style={[
                {
                    gap: 8,
                    flex: 1,
                },
            ]}
        >
            {/* summary */}
            <View style={[globalStyle.rowBetweenTop, { gap: 4, }]}>
                <View>
                    <ThemeText content={`${details?.status}`} fontFamily='MontserratSemiBold' variant='sm' color={details.color} />
                    {user && (
                        <View style={[globalStyle.rowStartCenter, { gap: 4, }]}>
                            <AuthUserIcon height={12} width={12} color={theme?.text.disabled} />
                            <ThemeText content={`${details?.by}`} severity='secondary' />
                        </View>
                    )}
                </View>

                <View style={[globalStyle.rowStartCenter, { gap: 4, }]}>
                    <CalendarIcon height={12} width={12} color={theme?.text.disabled} />
                    <ThemeText content={`${dayjs(details?.at).format('DD MMM YYYY HH:mm:ss')}`} severity='secondary' />
                </View>
            </View>

            {/* details */}

            <View style={{
                backgroundColor: noDataKeys.includes(details.key) ? 'transparent' : `${details.color}10`,
                marginBottom: 24,
                padding: noDataKeys.includes(details.key) ? 0 : 8,
                borderRadius: 12,
                minHeight: noDataKeys.includes(details.key) ? 24 : 48,
                flex: 1,
                gap: 4,
            }}>
                {details?.key === 'assigned' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <AssignedDetails details={details} />
                    </React.Suspense>
                )}
                {details?.key === 'started' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <StartDetails details={details} />
                    </React.Suspense>
                )}
                {details?.key === 'completed' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <CompletedDetails details={details} />
                    </React.Suspense>
                )}
                {details?.key === 'delivered' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <DeliveredDetails details={details} />
                    </React.Suspense>
                )}
                {details?.key === 'updated' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <UpdatedDetails details={details} />
                    </React.Suspense>
                )}
                {details?.key === 'cancel' && (
                    <React.Suspense fallback={<LoadingScreen />}>
                        <CancelleddDetails details={details} />
                    </React.Suspense>
                )}
            </View>

        </View>
    )
}

export default TimelineStep

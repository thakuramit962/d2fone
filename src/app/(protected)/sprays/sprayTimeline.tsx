





import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useDispatch } from 'react-redux'

import Skelton from '@/components/basic/Skelton'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeChip from '@/components/basic/ThemeChip'
import { BillIcon, DoneIcon } from '@/components/icons'
import BackButton from '@/components/layout/navigation/BackButton'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { TimelineData } from '@/models/timeline'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { capitalizeWords, currencyFormatter, dimensions } from '@/utils/app-helper'


const TimelineStep = React.lazy(() => import('@/components/basic/pages/services/sprays/timelineStep'))

const SprayTimeline = () => {

    const theme = useTheme()

    const { orderId } = useLocalSearchParams()

    const idToFetch = `${orderId}`?.toUpperCase()?.replace(/^AWO-0*/, '');

    const dispatch = useDispatch()

    const [timelineDetails, setTimelineDetails] = useState<null | any>(null);
    const [fetching, setFetching] = useState(true);
    const [sortedTimeline, setSortedTimeline] = useState<TimelineData>({} as TimelineData);
    const statusColor = Object.values(sortedTimeline)[0]?.color
    const status = Object.values(sortedTimeline)[0]?.status


    const fetchDetails = useCallback(
        async (requestId: string) => {
            setFetching(true)
            dispatch(updateProcessingState(true))

            try {
                const res = await API.get(`/get_order_timeline/${requestId}`)
                if (res.data.statuscode === '200') {
                    setTimelineDetails(res.data?.data[0] ?? null);
                } else {
                    setTimelineDetails(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
                dispatch(updateProcessingState(false))
            }
        },
        [orderId]
    )

    useEffect(() => {
        if (timelineDetails) {
            const timelineData: TimelineData = {
                ...(timelineDetails?.delivered_date && {
                    delivered: {
                        available: !!timelineDetails?.delivered_date,
                        at: timelineDetails?.delivered_date,
                        by: timelineDetails?.delivered_created_by,
                        status: 'Delivered',
                        refundSignature: timelineDetails?.farmer_refund_signature,
                        amountReceived: timelineDetails?.amount_received,
                        accessAmount: timelineDetails?.added_amount,
                        refundAmount: timelineDetails?.refund_amount,
                        color: theme?.success,
                    }
                }),
                ...(timelineDetails?.completed_date && {
                    completed: {
                        available: !!timelineDetails?.completed_date,
                        at: timelineDetails?.completed_date,
                        by: timelineDetails?.updated_by,
                        status: 'Completed',
                        requestedAcreage: timelineDetails?.requested_acreage,
                        sprayedAcreage: timelineDetails?.sprayed_acreage,
                        droneAcreage: timelineDetails?.drone_acerage,
                        effectiveAmount: timelineDetails?.total_amount,
                        effectiveDiscount: timelineDetails?.total_discount,
                        effectivePayable: timelineDetails?.total_payable_amount,
                        accessAmount: timelineDetails?.added_amount,
                        refundAmount: timelineDetails?.refund_amount,
                        farmerSign: timelineDetails?.farmer_signature,
                        farmerImage: timelineDetails?.farmer_image,
                        farmImage: timelineDetails?.refund_image,
                        color: theme?.info,
                    }
                }),
                ...(timelineDetails?.spray_started_date && {
                    started: {
                        available: !!timelineDetails?.spray_started_created_by,
                        at: timelineDetails?.spray_started_date,
                        by: timelineDetails?.spray_started_created_by,
                        availablePerson:
                            timelineDetails?.farmer_available === '1'
                                ? 'Farmer(Self)'
                                : `Other Person (${capitalizeWords(
                                    timelineDetails?.available_person_name ?? ''
                                )} - ${timelineDetails?.available_person_phone})`,
                        freshWater: timelineDetails?.fresh_water,
                        chemicals: timelineDetails?.chemical_used_ids,
                        noc: timelineDetails?.noc_image,
                        status: 'Spray Started',
                        color: theme?.secondary,
                    }
                }),
                ...(timelineDetails?.cancel_date && {
                    cancel: {
                        available: !!timelineDetails?.cancel_date,
                        at: timelineDetails?.cancel_date,
                        by: timelineDetails?.cancel_created_by,
                        status: 'Service Request Cancelled',
                        color: theme?.error,
                        cancelRemarks: timelineDetails?.cancel_remarks,
                    }
                }),
                ...(timelineDetails?.aknowledged_date && {
                    acknowledged: {
                        available: !!timelineDetails?.aknowledged_date,
                        at: timelineDetails?.aknowledged_date,
                        by: timelineDetails?.aknowledged_created_by,
                        status: 'Acknowledged',
                        color: theme?.info,
                    }
                }),
                ...(timelineDetails?.assign_date && {
                    assigned: {
                        available: !!timelineDetails?.assign_date,
                        at: timelineDetails?.assign_date,
                        by: timelineDetails?.assign_created_by,
                        name: timelineDetails?.operator_name ?? '',
                        phone: timelineDetails?.operator_phone ?? '',
                        asset: timelineDetails?.asset ?? '',
                        status: 'Operator Assigned',
                        color: theme?.warning,
                    }
                }),
                ...(timelineDetails?.order_date && {
                    created: {
                        available: !!timelineDetails?.order_date,
                        at: timelineDetails?.order_date,
                        by: timelineDetails?.created_by,
                        status: 'Created',
                        color: theme?.primary,
                        amountReceived: timelineDetails?.amount_received,
                        payment_type: timelineDetails?.payment_type
                    }
                }),
                ...(timelineDetails?.amended_date && {
                    updated: {
                        available: !!timelineDetails?.amended_date,
                        at: timelineDetails?.amended_date,
                        by: timelineDetails?.amended_by_name,
                        status: 'Updated',
                        color: theme?.warning,
                        remarks: timelineDetails?.amended_remarks,
                    }
                }),
            }

            const sorted: TimelineData = Object.entries(timelineData)
                .sort(([, a], [, b]) => new Date(b.at).getTime() - new Date(a.at).getTime())
                .reduce((acc, [key, value]) => {
                    acc[key as keyof TimelineData] = value;
                    return acc;
                }, {} as TimelineData);

            setSortedTimeline(sorted);
        }
    }, [timelineDetails])

    useEffect(() => {
        fetchDetails(`${idToFetch}`)
    }, [orderId, fetchDetails])





    return (
        <ScrollView >
            <>
                <BackButton />
                {fetching
                    ? <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                    }}>
                        <Skelton dimensions={{ height: 48, width: dimensions.width * 0.75 }} />
                        <Skelton dimensions={{ height: 24, width: dimensions.width * 0.5 }} />
                    </View>
                    : <FixedTimelineDetails
                        details={{
                            orderId: orderId,
                            statusColor: statusColor,
                            status: status
                        }} />
                }

            </>

            <View style={{
                flex: 1,
                // minHeight: dimensions.height * 0.55,
            }}>
                {
                    fetching
                        ? <>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 16,
                                }}>
                                <Skelton dimensions={{
                                    height: dimensions.height * 0.55,
                                }} />
                            </View>
                        </>
                        : <>
                            {fetching
                                ? <View style={{ minHeight: dimensions.height * 0.75 }} />
                                : <View
                                    style={{
                                        flex: 1,
                                        paddingTop: 16,
                                    }}>
                                    {
                                        Object.entries(sortedTimeline).map(([key, val]: [string, any], index: number) => {
                                            return val?.available ? (
                                                <View
                                                    key={index}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'stretch',
                                                        gap: 4,
                                                        paddingHorizontal: 8,
                                                    }}>
                                                    <View style={{
                                                        alignItems: 'center',
                                                    }}>
                                                        <DoneIcon color={val.color} />
                                                        {index < Object.entries(sortedTimeline).length - 1 &&
                                                            <LinearGradient
                                                                style={{
                                                                    flex: 1,
                                                                    width: 1,
                                                                }}
                                                                colors={[`${val.color}10`, `${val.color}`]} />
                                                        }
                                                    </View>
                                                    <React.Suspense fallback={<Skelton dimensions={{ height: dimensions.height * 0.2, width: dimensions.width * 0.85 }} style={{ marginBottom: 8 }} />}>
                                                        <TimelineStep
                                                            key={index}
                                                            details={{ key: key, ...val }}
                                                        />
                                                    </React.Suspense>
                                                </View>
                                            )
                                                : null;
                                        })
                                    }
                                </View>
                            }

                            {(!fetching && Object.entries(sortedTimeline).length > 0) &&
                                <View style={{ flex: 1 }}>
                                    <PaymentDetails details={timelineDetails} />
                                </View>
                            }

                        </>
                }
            </View>

        </ScrollView>
    )
}

export default SprayTimeline


const FixedTimelineDetails = ({ details }: { details: any }) => {

    const theme = useTheme()

    return (
        <>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    height: 300,
                }}>

                <ThemeText content={`${details.orderId}`}
                    fontFamily='MontserratBold'
                    // color={theme?.background.slate}
                    style={{
                        fontSize: dimensions.width * 0.075
                    }} />

                <ThemeText content={`${details.status}`}
                    fontFamily='MontserratBold'
                    variant='sm'
                // color={theme?.background.slate}
                />

            </View>
        </>
    )
}

const PaymentDetails = ({ details }: { details: any }) => {

    const theme = useTheme()
    const globalStyle = useGlobalStyle()

    return (
        details ?
            <LinearGradient
                colors={[`#2ec4b6`, `${theme?.background.main}`]}
                style={{
                    marginTop: 56,
                    borderRadius: 24,
                    padding: 16, paddingBottom: 48,
                    minHeight: 300
                }}>
                <View style={[globalStyle.rowBetweenCenter, { marginBottom: 24 }]}>
                    <View>
                        <BillIcon color={theme?.background.main} style={{ opacity: 0.75 }} height={48} width={48} />
                        <ThemeText content={`Payment Details`} fontFamily='MontserratBlack' variant='md' color={theme?.background.main} />
                    </View>

                    <ThemeChip
                        type='solid'
                        label={details?.payment_type === '1' ? 'Prepaid' : 'Postpaid'}
                        severity={details?.payment_type === '1' ? 'primary' : 'warning'}
                        containerStyle={{
                            alignSelf: 'flex-start'
                        }}
                    />

                </View>


                {JSON.parse(details?.amount_received)?.length == 0 && (
                    <>
                        {details?.payment_required == 0 ?
                            (
                                <>
                                    <ThemeText
                                        variant='xs'
                                        style={{ textAlign: 'center', marginTop: 16, }}
                                        content={`Payment handled by client.`}
                                    />
                                </>
                            )
                            : (
                                <>
                                    <ThemeText
                                        variant='xs'
                                        style={{ textAlign: 'center', marginTop: 16, }}
                                        content={`No transaction found for now.`}
                                    />
                                </>
                            )}
                    </>
                )}


                {
                    (details?.refundAmount !== '0' ||
                        details?.accessAmount !== '0' ||
                        JSON.parse(details?.amount_received)?.length > 0) && (
                        <View style={{
                            gap: 8
                        }}>
                            {JSON.parse(details?.amount_received)?.length > 0 && (
                                <>
                                    <ThemeText
                                        color={theme?.text.primary}
                                        fontFamily='MontserratMedium'
                                        selectable
                                        style={{
                                            backgroundColor: theme?.background.main,
                                            padding: 4,
                                            borderRadius: 8,
                                        }}
                                        content={`👉   ${currencyFormatter(
                                            +JSON.parse(details?.amount_received)[0]?.amount
                                        )} received ${JSON.parse(details?.amount_received)[0]?.mode === '1' ? 'offline' : 'online'} with reference ${JSON.parse(details?.amount_received)[0]?.reference_no}`} />
                                </>
                            )}


                            {
                                (+details?.refundAmount > 0 || +details?.accessAmount > 0) && (
                                    <ThemeText
                                        color={+details?.refundAmount > 0 ? theme?.warning : theme?.text.primary}
                                        fontFamily='MontserratMedium'
                                        selectable
                                        style={{
                                            backgroundColor: theme?.background.main,
                                            padding: 4,
                                            borderRadius: 8,
                                        }}
                                        content={`👉   ${JSON.parse(details?.amount_received)?.length > 1
                                            ? `${currencyFormatter(+JSON.parse(details?.amount_received)[1]?.amount)} ${+details?.refundAmount > 0 ? 'refunded' : 'excess amount received'} ${JSON.parse(details?.amount_received)[1]?.mode === '1' ? 'offline' : 'online'
                                            } with reference ${JSON.parse(details?.amount_received)[1]?.reference_no}`
                                            : +details?.refundAmount > 0 ? `Refund of ${currencyFormatter(+details?.refundAmount)} initiated` : ``}`}
                                    />
                                )
                            }
                        </View >
                    )
                }
            </LinearGradient>
            : null
    )
}
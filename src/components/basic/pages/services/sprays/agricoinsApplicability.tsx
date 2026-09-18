import Skelton from '@/components/basic/Skelton'
import ThemeText from '@/components/basic/text/ThemeText'
import TextDivider from '@/components/basic/textDivider'
import ThemeDivider from '@/components/basic/ThemeDivider'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { RootState } from '@/store/store'
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'

interface RedemptionDetail {
    already_redeemed_free_acre: number
    eligible_total_free_acre: number
    financial_year: string
    remaining_free_acre: number
    total_sprayed_acreage: number
    wallet_balance: number
}

interface AgricoinsApplicabilityProps {
    actionable?: boolean
    onApply?: (applied: number) => void
}

interface RequestState {
    data: RedemptionDetail | null
    loading: boolean
    error: string | null
}

const INITIAL_STATE: RequestState = { data: null, loading: false, error: null }

const AgricoinsApplicability = ({ actionable = true, onApply }: AgricoinsApplicabilityProps) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const [state, setState] = useState<RequestState>(INITIAL_STATE)
    const [applied, setApplied] = useState<number>(0)
    const isMountedRef = useRef(true)

    const currentUser = useSelector((rootState: RootState) => rootState?.auth?.currentUser)

    const fetchApplicability = useCallback(() => {
        if (!currentUser?.emp_id) {
            setState({ data: null, loading: false, error: t('agricoinsApplicability.noAccount') })
            return
        }

        setState(prev => ({ ...prev, loading: true, error: null }))

        API.post('/agricoin-redeem-details', { emp_id: currentUser.emp_id })
            .then((res) => {
                if (!isMountedRef.current) return
                const { status, data, msg } = res?.data ?? {}
                if (status === 'success' && data) {
                    setState({ data, loading: false, error: null })
                } else {
                    setState({
                        data: null,
                        loading: false,
                        error: msg || t('agricoinsApplicability.fetchFailed'),
                    })
                }
            })
            .catch(() => {
                if (!isMountedRef.current) return
                setState({
                    data: null,
                    loading: false,
                    error: t('agricoinsApplicability.generic'),
                })
            })
    }, [currentUser?.emp_id, t])

    useEffect(() => {
        isMountedRef.current = true
        fetchApplicability()
        return () => { isMountedRef.current = false }
    }, [fetchApplicability])

    const { data, loading, error } = state
    const hasEligibleOffer = !!data && data.eligible_total_free_acre > 0 && data?.wallet_balance

    if (loading) {
        return <Skelton dimensions={{ height: 120, radius: 24 }} />
    }

    return (
        <>
            {error && (
                <View style={{
                    gap: 8,
                    borderWidth: 1,
                    borderColor: `${theme.text.primary}25`,
                    borderRadius: 24,
                    borderCurve: 'continuous',
                    padding: 12,
                }}>
                    <ThemeText content={error} size={13} />
                    <Pressable
                        onPress={fetchApplicability}
                        style={{
                            alignSelf: 'flex-start',
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 12,
                            borderCurve: 'continuous',
                            borderWidth: 1,
                        }}
                    >
                        <ThemeText content={t('retry')} fontFamily="MontserratSemiBold" size={13} />
                    </Pressable>
                </View>
            )}

            {!error && data && (
                <>
                    {hasEligibleOffer && (
                        <>
                            <TextDivider
                                alignment='left'
                                verticalAlign='flex-end'
                                label={t('agricoinsApplicability.title')}
                                labelProps={{
                                    content: t('agricoinsApplicability.title'),
                                    fontFamily: 'MontserratSemiBoldItalic',
                                    size: 12,
                                }} />

                            <View style={{
                                borderWidth: 1,
                                borderColor: `${theme.text.primary}25`,
                                borderRadius: 24,
                                borderCurve: 'continuous',
                                padding: 12,
                            }}>
                                <View style={{ flexDirection: "row", gap: 8, position: 'relative' }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <ThemeText content={t('agricoinsApplicability.eligiblePrefix')} fontFamily="MontserratSemiBoldItalic" size={14} />
                                            <ThemeText
                                                content={`${data.remaining_free_acre} ${data.remaining_free_acre === 1 ? t('agricoinsApplicability.freeAcre') : t('agricoinsApplicability.freeAcres')}`}
                                                fontFamily="MontserratExtraBoldItalic"
                                                size={14}
                                            />
                                            <ThemeText content="." fontFamily="MontserratSemiBoldItalic" size={14} />
                                        </View>

                                        <ThemeText
                                            content={t('agricoinsApplicability.description')}
                                            severity='secondary'
                                            size={12}
                                        />

                                        {data.remaining_free_acre > 0 && (
                                            <>
                                                <ThemeDivider size={8} />
                                                <ThemeText
                                                    severity='disabled'
                                                    content={t('agricoinsApplicability.earnedInFy', {
                                                        year: data.financial_year,
                                                        count: data.eligible_total_free_acre,
                                                        unit: data.eligible_total_free_acre === 1 ? t('agricoinsApplicability.freeAcre') : t('agricoinsApplicability.freeAcres'),
                                                        // for proper i18next plural handling:
                                                        // count: data.eligible_total_free_acre
                                                    })}
                                                    size={11}
                                                />
                                            </>
                                        )}
                                    </View>

                                    {actionable && (
                                        <>
                                            <Pressable
                                                onPress={() => {
                                                    const next = applied === 0 ? data.remaining_free_acre : 0
                                                    setApplied(next)
                                                    onApply?.(next)
                                                }}
                                                style={{
                                                    paddingHorizontal: 24,
                                                    backgroundColor: applied !== 0 ? theme.background.main : theme.text.primary,
                                                    height: 38,
                                                    borderRadius: 16,
                                                    borderCurve: 'continuous',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: applied !== 0 ? 1 : 0,
                                                }}
                                            >
                                                <ThemeText
                                                    content={applied !== 0 ? t('agricoinsApplicability.applied') : t('agricoinsApplicability.apply')}
                                                    fontFamily="MontserratSemiBold"
                                                    size={14}
                                                    color={applied !== 0 ? theme.text.primary : theme.background.main}
                                                />
                                            </Pressable>
                                            {applied !== 0 &&
                                                <LottieView
                                                    source={require('@/assets/lottie/success.json')}
                                                    speed={1}
                                                    autoPlay loop={false}
                                                    style={{ position: 'absolute', height: 100, width: 100, top: -20, right: 16, zIndex: -1 }}
                                                />
                                            }
                                        </>
                                    )}
                                </View>
                            </View>
                        </>
                    )}

                    {!actionable && (
                        <ThemeText
                            content={
                                data.already_redeemed_free_acre > 0
                                    ? t('agricoinsApplicability.redeemed', {
                                        count: data.already_redeemed_free_acre,
                                        year: data.financial_year,
                                        unit: data.already_redeemed_free_acre === 1 ? t('agricoinsApplicability.freeAcre') : t('agricoinsApplicability.freeAcres'),
                                    })
                                    : t('agricoinsApplicability.noFreeAcres', { year: data.financial_year })
                            }
                            size={13}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default AgricoinsApplicability
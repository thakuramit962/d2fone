import { AlertIcon, CheckmarkCircleIcon, CloseIcon } from '@/components/icons'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { capitalizeWords, dimensions } from '@/utils/app-helper'
import * as Haptics from 'expo-haptics'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    Pressable,
    UIManager,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import BottomSheet from '../bottomSheet'
import LoadingScreen from '../containers/loadingScreen'
import ThemeInput from '../inputs/ThemeInput'
import ThemeText from '../text/ThemeText'
import ThemeButton from '../ThemeButton'
import { UserIcon } from './explorePage/icon'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

// ---- Constants -------------------------------------------------------

const REFERRAL_MIN_LENGTH = 10
const REFERRAL_MAX_LENGTH = 12
const VERIFY_DEBOUNCE_MS = 450

// ---- Types -------------------------------------------------------------

interface ReferralFormValues {
    referral: string
}

interface ReferenceData {
    email: string
    name: string
    role: string
}

interface ReferenceState {
    data: ReferenceData | null
    error: string
}

interface AddReferralDrawerProps {
    /** Called after the drawer should be dismissed (both on manual close and after a successful submit). */
    onClose: () => void
    /** Called after the referral has been successfully attached to the user's account. */
    onSuccess?: (reference: ReferenceData) => void
    visible: boolean
}

// ---- Component -----------------------------------------------------------

const AddReferralDrawer = ({ onClose, onSuccess, visible }: AddReferralDrawerProps) => {
    const theme = useTheme()
    const globalStyle = useGlobalStyle()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const { bottom, left } = useSafeAreaInsets()
    const inputRef = useRef<any>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const verifyRequestId = useRef(0)

    const [processing, setProcessing] = useState<boolean>(false)
    const [verifying, setVerifying] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [reference, setReference] = useState<ReferenceState>({ data: null, error: '' })

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ReferralFormValues>({
        defaultValues: {
            referral: '',
        },
        mode: 'onSubmit',
    })

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus?.(), 350)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const animateStatusChange = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, [])


    const verifyReference = useCallback(
        (emp_id: string) => {
            const requestId = ++verifyRequestId.current
            setVerifying(true)

            API.post('fetch_user_details', { emp_id })
                .then((res) => {
                    if (requestId !== verifyRequestId.current) return // stale response, ignore

                    animateStatusChange()
                    if (res?.data?.status === 'success' && res?.data?.data) {
                        setReference({ data: res.data.data, error: '' })
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    } else {
                        setReference({ data: null, error: 'Invalid Referral Code' })
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    }
                })
                .catch(() => {
                    if (requestId !== verifyRequestId.current) return
                    animateStatusChange()
                    setReference({ data: null, error: 'Something went wrong. Please try again.' })
                })
                .finally(() => {
                    if (requestId === verifyRequestId.current) setVerifying(false)
                })
        },
        [animateStatusChange]
    )

    const updateReferral = useCallback(
        (emp_id: string): Promise<boolean> => {
            setSubmitting(true)
            setProcessing(true)
            dispatch(updateProcessingState(true))

            return API.post('/v1/add-referral', { referred_by: emp_id })
                .then((res) => {
                    return res?.data?.status === 'success' || !!res?.data
                })
                .catch(() => {
                    animateStatusChange()
                    setReference((prev) => ({ ...prev, error: 'Failed to add referral. Please try again.' }))
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    return false
                })
                .finally(() => {
                    setSubmitting(false)
                    setProcessing(false)
                    dispatch(updateProcessingState(false))
                })
        },
        [dispatch, animateStatusChange]
    )

    const onSubmit: SubmitHandler<ReferralFormValues> = useCallback(
        async (data) => {
            const code = data.referral?.trim()
            if (!code || !reference.data) return // guard: only submit an already-verified code

            const success = await updateReferral(code)
            if (success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                onSuccess?.(reference.data)
                onClose()
            }
        },
        [reference.data, updateReferral, onSuccess, onClose]
    )

    const handleReferralChange = useCallback(
        (value: string, onChange: (value: string) => void) => {
            onChange(value)
            verifyRequestId.current++ // invalidate any in-flight verification

            if (debounceRef.current) clearTimeout(debounceRef.current)

            if (value.length === 0) {
                animateStatusChange()
                setReference({ data: null, error: '' })
                setVerifying(false)
                return
            }

            if (value.length < REFERRAL_MIN_LENGTH) {
                animateStatusChange()
                setReference({ data: null, error: '' }) // don't show an error mid-type, just withhold success
                setVerifying(false)
                return
            }

            // Debounce: wait for the user to pause typing before hitting the API.
            debounceRef.current = setTimeout(() => {
                verifyReference(value.trim().toUpperCase())
            }, VERIFY_DEBOUNCE_MS)
        },
        [verifyReference, animateStatusChange]
    )

    const handleClearInput = useCallback(
        (onChange: (value: string) => void) => {
            onChange('')
            verifyRequestId.current++
            if (debounceRef.current) clearTimeout(debounceRef.current)
            animateStatusChange()
            setReference({ data: null, error: '' })
            setVerifying(false)
            inputRef.current?.focus?.()
        },
        [animateStatusChange]
    )

    const isSubmitDisabled = submitting || verifying || !reference.data

    return (
        <>
            <BottomSheet onClose={onClose} visible={visible} height={dimensions.height - 120} showCloseIcon>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={16}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingVertical: bottom,
                            paddingHorizontal: left * 2,
                            alignItems: 'center',
                            gap: 16,
                        }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/static/otherPages/subscription_illustration.png')}
                                style={{
                                    height: 160,
                                    width: 160,
                                    resizeMode: 'contain',
                                }}
                                accessibilityIgnoresInvertColors
                            />

                            <ThemeText
                                content={t('addReferralDrawer.description')}
                                severity="secondary"
                                style={{ textAlign: 'center', marginBottom: 8 }}
                            />

                            <View style={{ gap: 4, alignSelf: 'stretch', alignItems: 'stretch' }}>
                                <Controller
                                    control={control}
                                    name="referral"
                                    rules={{
                                        required: { value: true, message: t('addReferralDrawer.fields.required'), },
                                        minLength: {
                                            value: REFERRAL_MIN_LENGTH,
                                            message: t('addReferralDrawer.fields.tooShort'),
                                        },
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <View>
                                            <ThemeInput
                                                ref={inputRef}
                                                value={value}
                                                onChangeText={(text) => handleReferralChange(text, onChange)}
                                                onBlur={() => {
                                                    onBlur()
                                                    if (value) {
                                                        setValue('referral', value.trim().toUpperCase(), {
                                                            shouldValidate: true,
                                                        })
                                                    }
                                                }}
                                                placeholder={t('addReferralDrawer.a11y.inputLabel')}
                                                autoCapitalize="characters"
                                                icon={UserIcon}
                                                helperText={errors.referral ? errors.referral.message : ''}
                                                returnKeyType="done"
                                                error={!!errors.referral || !!reference.error}
                                                editable={!submitting}

                                                onSubmitEditing={handleSubmit(onSubmit)}
                                                maxLength={REFERRAL_MAX_LENGTH}
                                                accessibilityLabel="Referral code input"
                                                accessibilityHint="Enter the referral code you received, then submit"
                                            />

                                            {/* Right-aligned status affordance: spinner while checking, clear (x) once there's text */}
                                            {!!value && (
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        right: 12,
                                                        top: 0,
                                                        bottom: 0,
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {verifying ? (
                                                        <ActivityIndicator size="small" color={theme?.secondary} />
                                                    ) : (
                                                        <Pressable
                                                            onPress={() => handleClearInput(onChange)}
                                                            hitSlop={8}
                                                            accessibilityRole="button"
                                                            accessibilityLabel="Clear referral code"
                                                        >
                                                            <CloseIcon color={theme?.secondary} height={16} width={16} />
                                                        </Pressable>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                />

                                {(reference.data || reference.error) && (
                                    <View
                                        style={[globalStyle.row, globalStyle.alignCenter, { gap: 4 }]}
                                        accessibilityLiveRegion="polite"
                                    >
                                        {reference.data && (
                                            <CheckmarkCircleIcon color={theme?.success} height={16} width={16} />
                                        )}
                                        {reference.error && <AlertIcon color={theme?.error} height={16} width={16} />}
                                        <ThemeText
                                            severity={reference.error ? 'error' : 'success'}
                                            content={
                                                reference.data
                                                    ? capitalizeWords(`${reference.data.name}, ${reference.data.role}`)
                                                    : reference.error
                                            }
                                        />
                                    </View>
                                )}
                            </View>
                        </View>

                        <ThemeButton
                            label={submitting ? t('addReferralDrawer.buttons.submitting') : t('addReferralDrawer.buttons.submit')}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitDisabled}
                            loading={submitting}
                            style={{ width: 300 }}
                            accessibilityHint={
                                isSubmitDisabled && !submitting
                                    ? 'Enter a valid referral code to enable submit'
                                    : undefined
                            }
                        />


                        <Pressable onPress={onClose}>
                            <ThemeText content={t('addReferralDrawer.buttons.skipAndContinue')} fontFamily='MontserratSemiBold' variant='xs' />
                        </Pressable>

                    </View>

                </KeyboardAvoidingView>
            </BottomSheet>
            {processing && <LoadingScreen />}
        </>
    )
}

export default AddReferralDrawer
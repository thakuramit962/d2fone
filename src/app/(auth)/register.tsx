import ScreenView from '@/components/basic/containers/screenView'
import SelectInput from '@/components/basic/inputs/SelectInput/NewSelectInput'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { PasswordIcon, UserMultipleIcon, WarningIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { User } from '@/models/user'
import { updateAuth } from '@/slices/auth-slice'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { updateToast } from '@/slices/toast-slice'
import { capitalizeWords, dimensions } from '@/utils/app-helper'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useDispatch } from 'react-redux'

interface State { id: string; label: string; value: string }
interface RegisterFormValues {
    phone_number: string; otp: string; otp_id: string;
    name: string; address: string; state: string; referred_by: string; role: string
}

const Register = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { phone, otp_id, register_user, registered_farmer } = useLocalSearchParams<{
        phone: string; otp_id: string; register_user?: string; registered_farmer?: string
    }>()

    const isUser = register_user === '1'
    const isOnlyFarmer = registered_farmer === '1' && !isUser

    const otpRef = useRef<TextInput | null>(null)
    const nameRef = useRef<TextInput | null>(null)
    const addressRef = useRef<TextInput | null>(null)

    const [selectedState, setSelectedState] = useState<State[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [consent, setConsent] = useState(false)
    const isMounted = useRef(true)
    useEffect(() => () => { isMounted.current = false }, [])

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormValues>({
        defaultValues: { phone_number: phone ?? '', otp_id: otp_id ?? '', otp: '', name: '', address: '', state: '', referred_by: '', role: 'farmer' },
        mode: 'onTouched',
    })

    const sendOtp = useCallback(() => {
        if (!phone) return
        dispatch(updateProcessingState(true))
        API.post('send-otp', { phone_number: phone, role: 'farmer' })
            .then((res) => {
                if (!isMounted.current) return
                setValue('otp_id', res.data?.data?.otp_id)
                dispatch(updateToast({
                    title: t('auth.otp.sentTitle'),
                    message: t('auth.otp.sentMessage', { phone }),
                    severity: 'success',
                }))
            })
            .catch(() => {
                if (!isMounted.current) return
                dispatch(updateToast({ title: t('auth.toast.networkError'), message: t('auth.toast.resendFailed'), severity: 'error' }))
            })
            .finally(() => { if (isMounted.current) dispatch(updateProcessingState(false)) })
    }, [dispatch, phone, setValue, t])

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        if (isLoading) return
        if (!consent) {
            dispatch(updateToast({ title: t('auth.consent.title'), message: t('auth.consent.message'), severity: 'error' }))
            return
        }
        if (selectedState.length === 0) {
            dispatch(updateToast({ title: t('auth.toast.stateRequired'), message: t('auth.toast.stateRequiredMessage'), severity: 'error' }))
            return
        }
        setIsLoading(true)
        dispatch(updateProcessingState(true))
        try {
            const res = await API.post('user_register_request', data)
            if (!isMounted.current) return
            if (res.data?.status === 'success') {
                dispatch(updateAuth({
                    isLoggedIn: true,
                    currentUser: { ...res.data?.data?.user_data, farmerDetails: res.data?.data?.farmer_data } as User,
                    accessToken: res.data?.data?.access_token,
                }))
                dispatch(updateToast({ title: t('auth.toast.registration'), severity: 'success' }))
                router.replace({ pathname: '/tabs/home' })
            } else {
                dispatch(updateToast({ title: t('auth.toast.error'), message: res.data?.msg ?? t('auth.toast.generic'), severity: 'error' }))
            }
        } catch (err) {
            if (!isMounted.current) return
            dispatch(updateToast({ title: t('auth.toast.networkError'), message: t('auth.toast.networkErrorMessage'), severity: 'error' }))
        } finally {
            if (isMounted.current) { setIsLoading(false); dispatch(updateProcessingState(false)) }
        }
    }, [isLoading, consent, selectedState, dispatch, t])

    const submitForm = handleSubmit(onSubmit)

    return (
        <ScreenView>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Header />
                    <View style={styles.formWrapper}>
                        <ThemeText content={t('register.title')} size={20} fontFamily="MontserratBlack" color="#147A28" />
                        <ThemeText content={t('register.subtitle')} size={12} fontFamily="InterRegular" color="#3a3a3a" />
                        <ThemeDivider size={32} />

                        <Controller control={control} name="name"
                            rules={{ required: { value: true, message: t('register.fullName.required') }, minLength: { value: 2, message: t('register.fullName.tooShort') } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <ThemeInput ref={nameRef} value={value} label={t('register.fullName.label')} required size={42} maxLength={60}
                                    onChangeText={onChange} onBlur={onBlur} placeholder={t('register.fullName.placeholder')}
                                    keyboardType="default" autoComplete="name"
                                    helperText={errors.name?.message ?? ' '} returnKeyType="next" error={!!errors.name}
                                    enablesReturnKeyAutomatically autoFocus
                                    onSubmitEditing={() => addressRef.current?.focus()}
                                    importantForAccessibility="yes" accessibilityLabel={t('register.fullName.a11yLabel')} />
                            )}
                        />
                        <ThemeDivider size={8} />

                        <SelectInput required label={t('register.state.label')} size={42} variant="outlined"
                            options={STATES_LIST} defaultValues={selectedState}
                            onSelectionchange={(items: State[]) => { setSelectedState(items); setValue('state', items[0]?.value ?? '') }}
                            helperText={selectedState.length === 0 ? t('register.state.required') : ' '}
                            error={selectedState?.length == 0 ? 'true' : ''} />

                        <ThemeDivider size={8} />

                        <Controller control={control} name="address"
                            rules={{ required: { value: true, message: t('register.address.required') } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <ThemeInput ref={addressRef} value={value} label={t('register.address.label')} required size={42} maxLength={120}
                                    onChangeText={onChange} onBlur={onBlur} placeholder={t('register.address.placeholder')}
                                    keyboardType="default" autoComplete="address-line1"
                                    helperText={errors.address?.message ?? t('register.address.helper')} returnKeyType="next"
                                    error={!!errors.address} selectTextOnFocus enablesReturnKeyAutomatically
                                    onSubmitEditing={() => otpRef.current?.focus()}
                                    importantForAccessibility="yes" accessibilityLabel={t('register.address.a11yLabel')} />
                            )}
                        />
                        <ThemeDivider size={8} />

                        <Controller control={control} name="referred_by"
                            rules={{ minLength: { value: 8, message: t('register.referral.invalid') } }}
                            render={({ field: { onChange, value, onBlur } }) => (
                                <ThemeInput value={value} label={t('register.referral.label')} size={42}
                                    onChangeText={(text) => onChange(text.trim().toUpperCase())} onBlur={onBlur}
                                    placeholder={t('register.referral.placeholder')} icon={UserMultipleIcon}
                                    helperText={errors.referred_by?.message ?? ' '} returnKeyType="next"
                                    error={!!errors.referred_by} selectTextOnFocus enablesReturnKeyAutomatically maxLength={15}
                                    onSubmitEditing={() => otpRef.current?.focus()}
                                    importantForAccessibility="yes" accessibilityLabel={t('register.referral.a11yLabel')} />
                            )}
                        />
                        <ThemeDivider size={8} />

                        <Controller control={control} name="otp"
                            rules={{ required: { value: true, message: t('auth.otp.required') }, minLength: { value: 4, message: t('auth.otp.invalid') } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <ThemeInput ref={otpRef} value={value} label={t('auth.otp.label')} required size={42} isSecure
                                    onChangeText={onChange} onBlur={onBlur} placeholder="••••" keyboardType="number-pad" icon={PasswordIcon}
                                    autoComplete="one-time-code" textContentType="oneTimeCode"
                                    helperText={errors.otp?.message ?? ' '} returnKeyType="done" error={!!errors.otp} maxLength={4}
                                    selectTextOnFocus enablesReturnKeyAutomatically onSubmitEditing={submitForm}
                                    importantForAccessibility="yes" accessibilityLabel={t('auth.otp.a11yLabel')}
                                    accessibilityHint={t('auth.otp.enabled')} />
                            )}
                        />
                        <ThemeDivider size={8} />

                        <View style={[styles.infoRow, { backgroundColor: `${theme.info}20` }]}>
                            <WarningIcon height={16} width={16} color={theme.info} style={styles.infoIcon} />
                            <ThemeText content={t('auth.otp.info', { phone })} severity="secondary" style={styles.infoText} />
                            <ThemeText onPress={sendOtp} content={t('auth.otp.resend')} fontFamily="InterSemiBold" severity="info" />
                        </View>

                        <ThemeDivider size={48} />

                        <View style={styles.tcRow} accessibilityRole="text">
                            <Pressable onPress={() => setConsent((prev) => !prev)} style={styles.checkboxWrapper}
                                accessibilityRole="checkbox" accessibilityState={{ checked: consent }}
                                accessibilityLabel={t('auth.consent.a11yLabel')} hitSlop={8}>
                                <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#147A28" strokeWidth={1.5}
                                    accessibilityElementsHidden importantForAccessibility="no">
                                    <Path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
                                    {consent && <Path d="M8 12.5L10.5 15L16 9" strokeLinecap="round" strokeLinejoin="round" />}
                                </Svg>
                            </Pressable>
                            <View style={styles.tcTextBlock}>
                                <ThemeText content={t('auth.consent.prefix')} severity="secondary" />
                                <Link href="/policies" accessibilityRole="link">
                                    <ThemeText content={t('auth.consent.terms')} severity="info" />
                                </Link>
                            </View>
                        </View>

                        <ThemeDivider size={12} />

                        <View style={styles.ctaSection}>
                            <Pressable onPress={submitForm}
                                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed, (!consent || isLoading) && styles.ctaButtonDisabled]}
                                disabled={isLoading} android_ripple={{ color: '#ffffff30', borderless: false }}
                                accessibilityRole="button" accessibilityLabel={t('auth.actions.register')}
                                accessibilityState={{ busy: isLoading, disabled: isLoading || !consent }}>
                                {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> :
                                    <ThemeText content={t('auth.actions.register')} fontFamily="MontserratBold" size={18} color="#ffffff" />}
                            </Pressable>
                        </View>
                        <ThemeDivider size={32} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenView>
    )
}

export default Register

const styles = StyleSheet.create({
    flex: { flex: 1 }, scrollContent: { flexGrow: 1 },
    formWrapper: { paddingHorizontal: dimensions.width * 0.125 },
    infoRow: { borderRadius: 8, alignItems: 'center', flexDirection: 'row', gap: 2, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
    infoIcon: { marginRight: 4 }, infoText: { marginRight: 8 },
    checkboxWrapper: { height: 24, width: 24, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    tcRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tcTextBlock: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
    ctaSection: { justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24 },
    ctaButton: { backgroundColor: '#141414', borderRadius: 16, width: 250, height: 48, justifyContent: 'center', alignItems: 'center' },
    ctaButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    ctaButtonDisabled: { opacity: 0.6 },
})

interface State { id: string; label: string; value: string }
const INDIAN_STATES = ['ANDAMAN & NICOBAR ISLANDS', 'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHANDIGARH', 'CHHATTISGARH', 'DADRA & NAGAR HAVELI & DAMAN & DIU', 'DELHI', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH', 'JAMMU & KASHMIR', 'JHARKHAND', 'KARNATAKA', 'KERALA', 'LADAKH', 'LAKSHADWEEP', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA', 'PUDUCHERRY', 'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL']
const STATES_LIST: State[] = INDIAN_STATES.map((state, index) => ({
    id: `state-${index + 1}`, label: state, value: capitalizeWords(state),
})).sort((a, b) => a.label.localeCompare(b.label))
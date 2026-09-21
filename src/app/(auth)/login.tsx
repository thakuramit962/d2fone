import ScreenView from '@/components/basic/containers/screenView'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { MobileIcon, PasswordIcon, WarningIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import useFarms from '@/hooks/use-farms'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/useToast'
import { User } from '@/models/user'
import { updateAuth } from '@/slices/auth-slice'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { updateToast } from '@/slices/toast-slice'
import { dimensions, PHONE_REGEX, sanitizePhone } from '@/utils/app-helper'
import { Link, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useDispatch } from 'react-redux'

interface LoginFormValues { phone: string; otp: string }
type LoginStep = 'phoneVerify' | 'otpVerify'
interface AuthMeta {
    otp_id: string
    phone_number: string
    register_user: boolean
    registered_farmer: boolean
}

const Login: React.FC = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const router = useRouter()
    const dispatch = useDispatch()
    const phoneRef = useRef<TextInput | null>(null)
    const otpRef = useRef<TextInput | null>(null)
    const { showToast } = useToast()
    const { fetchFarms, loading } = useFarms()

    const [step, setStep] = useState<LoginStep>('phoneVerify')
    const [isLoading, setIsLoading] = useState(false)
    const [consent, setConsent] = useState(true)
    const [authMeta, setAuthMeta] = useState<AuthMeta | null>(null)
    const isMounted = useRef(true)
    useEffect(() => () => { isMounted.current = false }, [])

    const { control, handleSubmit, formState: { errors }, watch } = useForm<LoginFormValues>({
        defaultValues: { phone: '', otp: '' },
        mode: 'onTouched',
    })

    const handlePhoneVerify = useCallback(async (phone: string) => {
        dispatch(updateProcessingState(true))
        try {
            const res = await API.post('/send_otp_to_user', { phone_number: phone })
            if (!isMounted.current) return
            if (res.data?.status === 'success') {
                const { otp_id, register_user, registered_farmer } = res.data.data
                const isExistingUser = register_user == 1 || registered_farmer == 1
                if (isExistingUser) {
                    setAuthMeta({ otp_id, phone_number: phone, register_user: register_user == 1, registered_farmer: registered_farmer == 1 })
                    setStep('otpVerify')
                    setTimeout(() => otpRef.current?.focus(), 100)
                } else {
                    router.replace({ pathname: '/(auth)/register', params: { phone, otp_id, register_user, registered_farmer } })
                }
            } else {
                showToast(t('auth.toast.error'), res.data?.msg ?? t('auth.toast.generic'), 'error')
            }
        } catch (err) {
            if (!isMounted.current) return
            console.error('Send OTP failed:', err)
            showToast(t('auth.toast.networkError'), t('auth.toast.networkErrorMessage'), 'error')
        } finally {
            if (isMounted.current) { dispatch(updateProcessingState(false)); setIsLoading(false) }
        }
    }, [dispatch, router, showToast, t])

    const handleOtpVerify = useCallback(async (otp: string) => {
        if (!authMeta) {
            dispatch(updateToast({ title: t('auth.toast.sessionExpired'), message: t('auth.toast.sessionExpiredmessage'), severity: 'error' }))
            setStep('phoneVerify')
            return
        }
        const { otp_id, phone_number, register_user, registered_farmer } = authMeta
        const isUser = register_user
        const isOnlyFarmer = registered_farmer && !register_user
        dispatch(updateProcessingState(true))
        try {
            const dataToProceed = { otp_id, phone_number, otp, ...(isOnlyFarmer ? { role: 'farmer' } : {}) }
            const url = isOnlyFarmer ? 'user_create_request' : 'user_login_request'
            const res = await API.post(url, dataToProceed)
            if (!isMounted.current) return
            if (res.data?.status == 'success') {
                const authData = {
                    isLoggedIn: true,
                    currentUser: { ...res.data?.data?.user_data, farmerDetails: res.data?.data?.farmer_data } as User,
                    accessToken: res.data?.data?.access_token,
                }
                await dispatch(updateAuth(authData))
                dispatch(updateToast({ title: isUser ? t('auth.toast.successLogin') : t('auth.toast.registration'), severity: 'success' }))
                router.replace({ pathname: '/tabs/home', params: { newUser: isOnlyFarmer ? 'yes' : 'no' } })
                fetchFarms({})
            } else {
                dispatch(updateToast({ title: t('auth.toast.error'), severity: 'error', message: res.data?.msg ?? t('auth.toast.generic') }))
            }
        } catch (err) {
            if (!isMounted.current) return
            console.error('OTP verification failed:', err)
            dispatch(updateToast({ title: t('auth.toast.networkError'), message: t('auth.toast.networkErrorMessage'), severity: 'error' }))
        } finally {
            if (isMounted.current) { dispatch(updateProcessingState(false)); setIsLoading(false) }
        }
    }, [authMeta, dispatch, router, t])

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        if (isLoading) return
        if (!consent) {
            dispatch(updateToast({ title: t('auth.consent.title'), message: t('auth.consent.message'), severity: 'error' }))
            return
        }
        setIsLoading(true)
        if (step === 'phoneVerify') await handlePhoneVerify(data.phone)
        else await handleOtpVerify(data.otp)
    }, [isLoading, consent, step, dispatch, handlePhoneVerify, handleOtpVerify, t])

    const submitForm = handleSubmit(onSubmit)

    return (
        <ScreenView>
            <ScrollView stickyHeaderIndices={[0]}>
                <Header />
                <View style={styles.formWrapper}>
                    <Text accessibilityRole="header" style={styles.headingContainer}>
                        <ThemeText content={t('auth.login')} size={20} fontFamily="MontserratBlack" color="#147A28" />
                        <ThemeText content={t('auth.toAccount')} size={20} fontFamily="MontserratBold" color="#3a3a3a" />
                    </Text>
                    <ThemeDivider size={32} />
                    <Controller
                        control={control} name="phone"
                        rules={{
                            required: { value: true, message: t('auth.mobile.required') },
                            pattern: { value: PHONE_REGEX, message: t('auth.mobile.invalid') },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemeInput
                                ref={phoneRef} value={value} label={t('auth.mobile.label')} required size={42}
                                onChangeText={(input) => onChange(sanitizePhone(input))} onBlur={onBlur}
                                placeholder={t('auth.mobile.placeholder')} keyboardType="number-pad" icon={MobileIcon}
                                autoComplete="tel" textContentType="telephoneNumber"
                                helperText={errors.phone?.message ?? ' '} returnKeyType="next" error={!!errors.phone}
                                editable={step === 'phoneVerify'} clearTextOnFocus selectTextOnFocus enablesReturnKeyAutomatically
                                onSubmitEditing={() => step === 'phoneVerify' ? submitForm() : otpRef.current?.focus()}
                                autoFocus importantForAccessibility="yes"
                                accessibilityLabel={t('auth.mobile.a11yLabel')} accessibilityHint={t('auth.mobile.a11yHint')}
                            />
                        )}
                    />
                    <ThemeDivider size={8} />
                    <Controller
                        control={control} name="otp"
                        rules={{
                            required: step === 'otpVerify' ? { value: true, message: t('auth.otp.required') } : undefined,
                            minLength: { value: 4, message: t('auth.otp.invalid') },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemeInput
                                ref={otpRef} value={value} label={t('auth.otp.label')}
                                required={step === 'otpVerify'} size={42} secureTextEntry onChangeText={onChange} onBlur={onBlur}
                                placeholder="••••" keyboardType="number-pad" icon={PasswordIcon}
                                textContentType="oneTimeCode" autoComplete="sms-otp"
                                helperText={step === 'phoneVerify' ? t('auth.otp.beforePhoneHelper') : errors.otp?.message ?? ' '}
                                returnKeyType="done" error={!!errors.otp} maxLength={4} clearTextOnFocus={false}
                                selectTextOnFocus editable={step === 'otpVerify'} enablesReturnKeyAutomatically
                                onSubmitEditing={submitForm} importantForAccessibility="yes"
                                accessibilityLabel={t('auth.otp.a11yLabel')}
                                accessibilityHint={step === 'phoneVerify' ? t('auth.otp.disabled') : t('auth.otp.enabled')}
                            />
                        )}
                    />
                    {step === 'otpVerify' && <>
                        <ThemeDivider size={4} />
                        <View style={[styles.infoRow, { backgroundColor: `${theme.info}20` }]}>
                            <WarningIcon height={16} width={16} color={theme?.info} style={styles.infoIcon} />
                            <ThemeText content={t('auth.otp.info', { phone: watch('phone') })} severity="secondary" style={styles.infoText} />
                            <ThemeText onPress={submitForm} content={t('auth.otp.resend')} fontFamily="InterSemiBold" severity="info" />
                        </View>
                    </>}
                    <ThemeDivider size={4} />
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
                    <ThemeDivider size={28} />
                    <View style={styles.ctaSection}>
                        <Pressable onPress={submitForm}
                            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed, isLoading && styles.ctaButtonDisabled]}
                            disabled={isLoading} android_ripple={{ color: '#ffffff30', borderless: false }}
                            accessibilityRole="button"
                            accessibilityLabel={step === 'phoneVerify' ? t('auth.actions.sendOtp') : t('auth.actions.login')}
                            accessibilityState={{ busy: isLoading, disabled: isLoading }}>
                            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> :
                                <ThemeText content={step === 'phoneVerify' ? t('auth.actions.sendOtp') : t('auth.actions.login')}
                                    fontFamily="MontserratBold" size={18} color="#ffffff" />}
                        </Pressable>
                    </View>
                    <ThemeDivider size={24} />
                    <ThemeText content={t('auth.actions.havingIssue')} severity='secondary' size={11} style={{ textAlign: 'center' }} />
                    <Pressable onPress={() => router.replace('/(auth)/loginWithPassword')}>
                        <ThemeText content={t('auth.actions.loginWithPassword')} severity='info' size={11}
                            fontFamily='MontserratMedium' style={{ textAlign: 'center' }} />
                    </Pressable>
                </View>
                <ThemeDivider size={48} />
                <ActionText action={() => router.replace('/tabs/home')} label={t('auth.actions.skipExplore')}
                    withIcon={false} severity='main' fontFamily="MontserratSemiBold" style={styles.skipText}
                    accessibilityRole="link" accessibilityLabel={t('auth.actions.skipA11y')} />
            </ScrollView>
            <View style={styles.bottomSection}>
                <Image source={require('../../../assets/images/static/loginBg.png')} resizeMode="cover"
                    style={styles.bgImage} accessibilityElementsHidden importantForAccessibility="no" />
            </View>
        </ScreenView>
    )
}

export default Login

const styles = StyleSheet.create({
    formWrapper: { paddingHorizontal: dimensions.width * 0.125 },
    headingContainer: { width: 140 },
    checkboxWrapper: { height: 24, width: 24, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    tcRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tcTextBlock: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
    ctaSection: { justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24 },
    ctaButton: { backgroundColor: '#141414', borderRadius: 16, width: 250, height: 48, justifyContent: 'center', alignItems: 'center' },
    ctaButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    ctaButtonDisabled: { opacity: 0.6 },
    bottomSection: { position: 'absolute', width: dimensions.width, minHeight: dimensions.height * 0.25, bottom: 0, zIndex: -1, gap: 16, alignItems: 'center' },
    skipText: { textAlign: 'center' },
    bgImage: { width: dimensions.width, height: dimensions.height * 0.25 },
    infoRow: { borderRadius: 8, alignItems: 'center', flexDirection: 'row', gap: 2, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
    infoIcon: { marginRight: 4 },
    infoText: { marginRight: 8 },
})
import ScreenView from '@/components/basic/containers/screenView'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { MobileIcon, PasswordIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import useFarms from '@/hooks/use-farms'
import { useToast } from '@/hooks/useToast'
import { User } from '@/models/user'
import { updateAuth } from '@/slices/auth-slice'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { updateToast } from '@/slices/toast-slice'
import { dimensions, PHONE_REGEX, sanitizePhone } from '@/utils/app-helper'
import { Link, useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useDispatch } from 'react-redux'

interface LoginFormValues {
    phone: string
    password: string
}

const LoginWithPassword: React.FC = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()
    const phoneRef = useRef<TextInput | null>(null)
    const passwordRef = useRef<TextInput | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [consent, setConsent] = useState(true)
    const { showToast } = useToast()
    const { fetchFarms } = useFarms()

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        defaultValues: { phone: '', password: '' },
        mode: 'onTouched',
    })

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        if (isLoading) return
        if (!consent) {
            return showToast(t('auth.consent.missingTitle'), t('auth.consent.missingMessage'), 'error')
        }
        dispatch(updateProcessingState(true))
        try {
            const res = await API.post('user_login_request', {
                password: data.password,
                phone_number: data.phone
            })
            if (res.data?.status == 'success') {

                const authData = {
                    isLoggedIn: true,
                    currentUser: { ...res.data?.data?.user_data, farmerDetails: res.data?.data?.farmer_data } as User,
                    accessToken: res.data?.data?.access_token,
                }
                await dispatch(updateAuth(authData))
                dispatch(updateToast({ title: t('auth.toast.successLogin'), severity: 'success' }))
                router.replace({ pathname: '/tabs/home' })
                fetchFarms({})

            } else {
                dispatch(updateToast({
                    title: t('auth.toast.error'),
                    severity: 'error',
                    message: res.data?.msg ?? t('auth.toast.generic'),
                }))
            }
        } catch (err) {
            console.error('Login failed:', err)
            dispatch(updateToast({
                title: t('auth.toast.networkError'),
                message: t('auth.toast.networkErrorMessage'),
                severity: 'error',
            }))
        } finally {
            dispatch(updateProcessingState(false))
            setIsLoading(false)
        }
    }, [isLoading, router, consent, t, dispatch, fetchFarms, showToast])

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
                                ref={phoneRef} value={value} label={t('auth.mobile.label')} required size={42} maxLength={10}
                                onChangeText={(input) => onChange(sanitizePhone(input))} onBlur={onBlur}
                                placeholder={t('auth.mobile.placeholder')} keyboardType="number-pad" icon={MobileIcon}
                                autoComplete="tel" textContentType="telephoneNumber"
                                helperText={errors.phone?.message ?? ' '} returnKeyType="next" error={!!errors.phone}
                                clearTextOnFocus selectTextOnFocus enablesReturnKeyAutomatically
                                onSubmitEditing={() => passwordRef.current?.focus()} autoFocus
                                importantForAccessibility="yes"
                                accessibilityLabel={t('auth.mobile.a11yLabel')}
                                accessibilityHint={t('auth.mobile.a11yHint')}
                            />
                        )}
                    />

                    <ThemeDivider size={8} />

                    <Controller
                        control={control} name="password"
                        rules={{
                            required: { value: true, message: t('auth.password.required') },
                            minLength: { value: 6, message: t('auth.password.invalid') },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemeInput
                                ref={passwordRef} value={value} label={t('auth.password.label')} required size={42}
                                secureTextEntry onChangeText={onChange} onBlur={onBlur}
                                placeholder={t('auth.password.placeholder')} icon={PasswordIcon}
                                autoComplete="password" textContentType="password"
                                helperText={errors.password?.message ?? ' '} returnKeyType="done"
                                error={!!errors.password} clearTextOnFocus={false} selectTextOnFocus
                                enablesReturnKeyAutomatically onSubmitEditing={submitForm}
                                importantForAccessibility="yes"
                                accessibilityLabel={t('auth.password.a11yLabel')}
                                accessibilityHint={t('auth.password.a11yHint')}
                            />
                        )}
                    />

                    <ThemeDivider size={4} />

                    <View style={styles.tcRow} accessibilityRole="text">
                        <Pressable onPress={() => setConsent(!consent)}
                            style={styles.checkboxWrapper}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: consent }}
                            accessibilityLabel={t('auth.consent.a11yLabel')}
                            hitSlop={8}>
                            <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#147A28" strokeWidth={1.5}
                                accessibilityElementsHidden importantForAccessibility="no">
                                <Path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
                                {consent && <Path d="M8 12.5L10.5 15L16 9" strokeLinecap="round" strokeLinejoin="round" />}
                            </Svg>
                        </Pressable>
                        <View style={styles.tcTextBlock}>
                            <ThemeText content={t('auth.consent.prefixLogin')} severity="secondary" />
                            <Link href="/policies" accessibilityRole="link">
                                <ThemeText content={t('auth.consent.terms')} severity="info" />
                            </Link>
                        </View>
                    </View>

                    <ThemeDivider size={28} />

                    <View style={styles.ctaSection}>
                        <Pressable onPress={submitForm}
                            style={({ pressed }) => [
                                styles.ctaButton, pressed && styles.ctaButtonPressed, isLoading && styles.ctaButtonDisabled,
                            ]}
                            disabled={isLoading} android_ripple={{ color: '#ffffff30', borderless: false }}
                            accessibilityRole="button"
                            accessibilityLabel={t('auth.actions.login')}
                            accessibilityState={{ busy: isLoading, disabled: isLoading }}>
                            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> :
                                <ThemeText content={t('auth.actions.login')} fontFamily="MontserratBold" size={18} color="#ffffff" />}
                        </Pressable>

                        <ThemeDivider size={24} />
                        <Pressable onPress={() => router.replace('/(auth)/login')}>
                            <ThemeText content={t('auth.actions.loginWithOtp')} severity='info' size={11} fontFamily='MontserratMedium' style={{ textAlign: 'center' }} />
                        </Pressable>
                    </View>
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

export default LoginWithPassword

const styles = StyleSheet.create({
    formWrapper: { paddingHorizontal: dimensions.width * 0.125 },
    headingContainer: { width: 140 },
    tcRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tcTextBlock: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
    ctaSection: { justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24 },
    ctaButton: { backgroundColor: '#141414', borderRadius: 16, width: 250, height: 48, justifyContent: 'center', alignItems: 'center' },
    ctaButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    ctaButtonDisabled: { opacity: 0.6 },
    bottomSection: { position: 'absolute', width: dimensions.width, minHeight: dimensions.height * 0.25, bottom: 0, zIndex: -1, gap: 16, alignItems: 'center' },
    skipText: { textAlign: 'center' },
    bgImage: { width: dimensions.width, height: dimensions.height * 0.25 },
    checkboxWrapper: { height: 24, width: 24, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }
})
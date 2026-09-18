import LoadingScreen from '@/components/basic/containers/loadingScreen'
import CheckboxInput from '@/components/basic/inputs/checkboxInput'
import DateSelection from '@/components/basic/inputs/DateInput/DateSelection'
import InputLabel from '@/components/basic/inputs/inputLabel'
import SelectInput, { Option } from '@/components/basic/inputs/SelectInput/NewSelectInput'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import Skelton from '@/components/basic/Skelton'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { Field2Icon, PlantIcon, QrIcon } from '@/components/icons'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useAllCrops } from '@/hooks/useAllCrops'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { useToast } from '@/hooks/useToast'
import { Farm } from '@/models/user'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { updateToast } from '@/slices/toast-slice'
import { RootState } from '@/store/store'
import { capitalizeWords, dimensions } from '@/utils/app-helper'
import dayjs, { Dayjs } from 'dayjs'
import { router, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    BackHandler,
    Keyboard,
    Pressable,
    TextInput,
    View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { UserIcon } from '../../explorePage/icon'
import BookingSuccessScreen from './bookingSuccessScreen'
import QRScanner from './qrScanner'


const ChooseFarmForm = lazy(() => import('../../farms/chooseFarmForm'))
const AgricoinsApplicability = lazy(() => import('./agricoinsApplicability'))

const INPUT_SIZE = 44
const REFERRAL_LENGTH = 8
const REFERRAL_DEBOUNCE_MS = 350
const MAX_ACREAGE = 300

interface SprayBookingFormValues {
    crop_id: string
    crop_name: string
    acreage: string
    request_date: string
    remarks: string
    referral: string
    apply_coin: number,
    farm_id: string,
}

interface ReferenceType {
    data: {
        email: string
        name: string
        role: string
    } | null
    error: string
}

const DEFAULT_FORM_VALUES: SprayBookingFormValues = {
    crop_id: '',
    crop_name: '',
    acreage: '',
    request_date: '',
    remarks: '',
    referral: '',
    apply_coin: 0,
    farm_id: ''


}

const SprayBookingForm = () => {
    const globalStyle = useGlobalStyle()
    const dispatch = useDispatch()
    const theme = useTheme()
    const { t } = useTranslation()

    const { referenceNumber } = useLocalSearchParams<{ referenceNumber?: string }>()
    const pathname = usePathname()

    const { showToast } = useToast()

    const currentUser = useSelector((state: RootState) => state.auth)
    const user = currentUser?.currentUser
    const myFarms = useSelector((state: RootState) => state.auth?.currentUser?.userFarms)
    const farms: Farm[] = useMemo(
        () => (Array.isArray(myFarms) ? myFarms : myFarms ? [myFarms] : []),
        [myFarms]
    )

    const [processing, setProcessing] = useState<boolean>(false)
    const [verifyingReferral, setVerifyingReferral] = useState<boolean>(false)
    const [consent, setConsent] = useState<boolean>(false)

    const remarksRef = useRef<TextInput | null>(null)
    const acreRef = useRef<TextInput | null>(null)
    const referralRef = useRef<TextInput | null>(null)

    // Guards against setState-after-unmount from in-flight async work.
    const isMountedRef = useRef(true)
    // Guards against a stale (out-of-order) referral verification response overwriting a newer one.
    const referralRequestIdRef = useRef(0)
    const referralDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const referralAbortControllerRef = useRef<AbortController | null>(null)

    const { allCrops, fetchAllCrops, fetchingAllCrops } = useAllCrops()

    const [sprayDate, setSprayDate] = useState<Dayjs>(dayjs())
    const [submittedResponse, setSubmittedResponse] = useState<any | null>(null)
    const [prompt, setPrompt] = useState<boolean>(
        Boolean(currentUser?.isLoggedIn && user?.farmerDetails?.is_verified === '0')
    )
    const [showScanner, setShowScanner] = useState(false)

    const [reference, setReference] = useState<ReferenceType>({ data: null, error: '' })
    const [cropSelection, setCropSelection] = useState<Option[]>([])

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            if (referralDebounceRef.current) clearTimeout(referralDebounceRef.current)
            referralAbortControllerRef.current?.abort()
        }
    }, [])

    const generatedCropList = useMemo(
        () =>
            allCrops
                .map((crop) => ({
                    id: `${crop?.id}`,
                    label: crop?.crop_name,
                    value: capitalizeWords(crop?.crop_name),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [allCrops]
    )

    const verifyReference = useCallback(
        (emp_id: string) => {
            if (!emp_id) {
                setReference({ data: null, error: t('bookSpray.bookingForm.invalidReferralCode') })
                return
            }

            // Cancel any in-flight verification before starting a new one.
            referralAbortControllerRef.current?.abort()
            const controller = new AbortController()
            referralAbortControllerRef.current = controller

            const requestId = ++referralRequestIdRef.current

            setVerifyingReferral(true)
            API.post('fetch_user_details', { emp_id }, { signal: controller.signal })
                .then((res) => {
                    // Ignore results from superseded requests.
                    if (!isMountedRef.current || requestId !== referralRequestIdRef.current) return

                    if (res.data?.status === 'success') {
                        setReference({ data: res?.data?.data, error: '' })
                    } else {
                        setReference({ data: null, error: t('bookSpray.bookingForm.invalidReferralCode') })
                    }
                })
                .catch((err) => {
                    if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
                    if (!isMountedRef.current || requestId !== referralRequestIdRef.current) return
                    console.error(err, 'Error verifying referral code')
                    setReference({ data: null, error: t('bookSpray.bookingForm.verifyFailed') })
                })
                .finally(() => {
                    if (!isMountedRef.current || requestId !== referralRequestIdRef.current) return
                    setVerifyingReferral(false)
                })
        },
        []
    )

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
        watch,
    } = useForm<SprayBookingFormValues>({ defaultValues: DEFAULT_FORM_VALUES })

    const setReferral = useCallback(
        (data: string) => {
            setValue('referral', data, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
            setShowScanner(false)
        },
        [setValue]
    )

    const resetForm = useCallback(() => {
        referralAbortControllerRef.current?.abort()
        if (referralDebounceRef.current) clearTimeout(referralDebounceRef.current)

        reset(DEFAULT_FORM_VALUES)
        setCropSelection([])
        setReference({ data: null, error: '' })
        setConsent(false)
        setSprayDate(dayjs())
        setSubmittedResponse(null)
        Keyboard.dismiss()
    }, [reset])

    const onSubmit = useCallback(
        async (data: SprayBookingFormValues) => {
            if (processing) return

            if (!consent) {
                return showToast(t('bookSpray.bookingForm.consentRequiredTitle'), t('bookSpray.bookingForm.consentRequiredMessage'), 'warning')
            }

            const missingFields: string[] = []
            if (!data.farm_id) missingFields.push('Farm')
            if (!data.crop_id) missingFields.push('Crop')
            if (!data.acreage) missingFields.push('Acreage')

            if (missingFields.length) {
                return showToast('Invalid Data', `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required.`, 'error')
            }

            const referralValue = data.referral ?? ''
            if (reference.error || (referralValue.length > 0 && referralValue.length < REFERRAL_LENGTH)) {
                return showToast('Invalid Referral', reference.error || 'Invalid referral code.', 'error')
            }

            Keyboard.dismiss()
            setProcessing(true)
            dispatch(updateProcessingState(true))

            const payload = {
                crop_id: `${data.crop_id}`,
                crop_name: `${data.crop_name}`,
                acreage: `${data.acreage}`,
                request_date: dayjs(sprayDate).format('YYYY-MM-DD'),
                remarks: `${data.remarks ?? ''}`.trim(),
                referral: `${referralValue}`,
                apply_coin: data.apply_coin > +data.acreage ? `${data.acreage}` : `${data.apply_coin}`,
                farm_id: data.farm_id,
            }

            try {
                const res = await API.post('/v1/farmer-spray-request', payload)
                if (!isMountedRef.current) return
                setSubmittedResponse(res.data?.data ?? null)
                dispatch(
                    updateToast({ title: t('bookSpray.bookingForm.successTitle'), message: t('bookSpray.bookingForm.successMessage'), severity: 'success' })
                )
                reset(DEFAULT_FORM_VALUES)
                setCropSelection([])
                setReference({ data: null, error: '' })
                setConsent(false)
            } catch (err) {
                console.error(err)
                if (!isMountedRef.current) return
                dispatch(updateToast({ title: t('bookSpray.bookingForm.errorTitle'), message: t('bookSpray.bookingForm.errorMessage'), severity: 'error' }))
            } finally {
                if (!isMountedRef.current) return
                setProcessing(false)
                dispatch(updateProcessingState(false))
            }
        },
        [consent, dispatch, processing, reference.error, reset, sprayDate]
    )

    // One-time setup on mount.
    useEffect(() => {
        setCropSelection([])
        fetchAllCrops()
        // setSubmittedResponse(null)
        reset(DEFAULT_FORM_VALUES)
        setReference({ data: null, error: '' })
        setShowScanner(false)
        register('crop_id', { required: true })
        register('farm_id', { required: true })
        register('apply_coin')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setPrompt(Boolean(currentUser?.isLoggedIn && user?.farmerDetails?.is_verified === '0'))
    }, [currentUser?.isLoggedIn, user?.farmerDetails?.is_verified])

    useEffect(() => {
        if (showScanner) setReference({ data: null, error: '' })
    }, [showScanner])

    useEffect(() => {
        if (farms?.length) setValue('farm_id', farms?.length ? String(farms[0]?.id) : '')
    }, [farms])

    const referral = watch('referral') ?? ''

    useEffect(() => {
        if (referenceNumber) {
            setValue('referral', `${referenceNumber}`, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        }
    }, [referenceNumber, setValue])

    useEffect(() => {
        setSubmittedResponse(null)
    }, [pathname])

    const handleHardwareBack = useCallback(() => {
        if (showScanner) {
            setShowScanner(false)
            return true
        }
        if (submittedResponse) {
            setSubmittedResponse(null)
            return true
        }
        return false
    }, [showScanner, submittedResponse])

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack)
            return () => backHandler.remove()
        }, [handleHardwareBack])
    )

    const handleCropChange = useCallback(
        (selectedItems: Option[]) => {
            setCropSelection(selectedItems)
            if (selectedItems?.length > 0) {
                setValue('crop_name', `${selectedItems[0]?.value}`, { shouldValidate: true })
                setValue('crop_id', `${selectedItems[0]?.id}`, { shouldValidate: true })
            } else {
                setValue('crop_name', '', { shouldValidate: true })
                setValue('crop_id', '', { shouldValidate: true })
            }
        },
        [setValue]
    )

    const referralHelperText = errors.referral
        ? errors.referral.message
        : referral.length > 0
            ? verifyingReferral
                ? 'Verifying...'
                : !reference.error
                    ? reference.data?.name
                        ? `✅ ${reference.data.name}`.toUpperCase()
                        : ''
                    : `❗️ ${reference.error}`
            : ' '

    const isBusy = processing || isSubmitting

    return (
        <>
            <InputLabel label={t('bookSpray.bookingForm.chooseFarm')} required />
            <Suspense fallback={<Skelton dimensions={{ height: 72 }} />}>
                <ChooseFarmForm selectedId={farms?.length ? String(farms[0]?.id) : undefined} onChange={(frm) => setValue('farm_id', frm ? String(frm?.id) : '', { shouldValidate: true })} />
            </Suspense>
            {errors.farm_id && <ThemeText content={t('bookSpray.bookingForm.farmRequired')} variant='xs' severity='error' style={{ paddingLeft: 24 }} />}


            <ThemeDivider size={16} />

            <View
                style={{
                    gap: 8,
                    paddingHorizontal: 8,
                    marginHorizontal: 'auto',
                    width: dimensions.width * 0.9 > 500 ? 500 : dimensions.width * 0.9,
                }}
            >
                <DateSelection
                    required
                    onChange={(date) => setSprayDate(date)}
                    disablePast
                    size={INPUT_SIZE}
                    defaultDate={sprayDate}
                    label={t('bookSpray.bookingForm.sprayDate')}
                />

                <SelectInput
                    label={t('bookSpray.bookingForm.crop')}
                    required
                    size={INPUT_SIZE}
                    loading={fetchingAllCrops}
                    options={generatedCropList}
                    defaultValues={cropSelection}
                    icon={PlantIcon}
                    onSelectionchange={handleCropChange}
                    multiple={false}
                    helperText={errors.crop_id ? t('required') : ''}
                    error={!!errors.crop_id ? t('required') : ''}
                />

                <Controller
                    control={control}
                    name="acreage"
                    rules={{ required: { value: true, message: t('required') } }}
                    render={({ field: { onChange, value } }) => (
                        <ThemeInput
                            ref={acreRef}
                            value={value}
                            size={INPUT_SIZE}
                            maxLength={5}
                            variant="solid"
                            onChangeText={(value) => {
                                const numericValue = value.replace(/[^0-9]/g, '')
                                if (numericValue !== '' && +numericValue > MAX_ACREAGE) return
                                onChange(numericValue)
                            }}
                            placeholder={t('bookSpray.bookingForm.acreagePlaceholder')}
                            label={t('bookSpray.bookingForm.acreage')}
                            required
                            keyboardType="numeric"
                            helperText={errors.acreage ? errors.acreage.message : `Max ${MAX_ACREAGE} acres`}
                            returnKeyType="next"
                            error={Boolean(errors.acreage)}
                            clearTextOnFocus
                            enablesReturnKeyAutomatically
                            icon={Field2Icon}
                            onSubmitEditing={() => referralRef.current?.focus()}
                            accessibilityLabel="Acreage"
                        />
                    )}
                />

                <View style={[globalStyle.row, { gap: 6, alignItems: 'flex-start' }]}>
                    <Controller
                        control={control}
                        name="referral"
                        rules={{
                            validate: (value) =>
                                !value || value.length === 0 || value.length >= REFERRAL_LENGTH
                                    ? true
                                    : t('bookSpray.bookingForm.invalidReferralTitle'),
                        }}
                        render={({ field: { onChange, value } }) => (
                            <ThemeInput
                                ref={referralRef}
                                value={value}
                                maxLength={12}
                                size={INPUT_SIZE}
                                onChangeText={(value) => onChange(value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase())}
                                onBlur={() => verifyReference(referral)}
                                variant="solid"
                                label={t('bookSpray.bookingForm.referral')}
                                placeholder={t('bookSpray.bookingForm.referralPlaceholder')}
                                helperText={referralHelperText}
                                returnKeyType="next"
                                error={Boolean(errors.referral)}
                                clearTextOnFocus
                                enablesReturnKeyAutomatically
                                icon={UserIcon}
                                onSubmitEditing={() => remarksRef.current?.focus()}
                                mainContainerStyle={{ flex: 1 }}
                                readOnly={Boolean(referenceNumber)}
                                accessibilityLabel="Referral code"
                            />
                        )}
                    />

                    {!referenceNumber && (
                        <Pressable
                            style={[globalStyle.flexCenter, { paddingTop: 12 }]}
                            onPress={() => {
                                setValue('referral', '', { shouldValidate: true, shouldTouch: true })
                                Keyboard.dismiss()
                                setShowScanner(true)
                            }}
                            android_ripple={{ color: `${theme?.info}50`, borderless: true, foreground: false }}
                            accessibilityRole="button"
                            accessibilityLabel="Scan referral QR code"
                            hitSlop={8}
                        >
                            <QrIcon color={theme?.primary ?? '#63370E'} height={32} width={32} style={{ marginTop: 12 }} />
                        </Pressable>
                    )}
                </View>

                <Controller
                    control={control}
                    name="remarks"
                    rules={{ required: false }}
                    render={({ field: { onChange, value } }) => (
                        <ThemeInput
                            ref={remarksRef}
                            value={value}
                            maxLength={160}
                            onChangeText={(value) => onChange(value)}
                            label={t('bookSpray.bookingForm.remarks')}
                            placeholder={t('bookSpray.bookingForm.remarksPlaceholder')}
                            keyboardType="default"
                            variant="solid"
                            helperText={
                                errors.remarks ? errors.remarks.message : `${value?.length ?? 0}/160 characters`
                            }
                            returnKeyType="done"
                            error={Boolean(errors.remarks)}
                            clearTextOnFocus
                            enablesReturnKeyAutomatically
                            numberOfLines={4}
                            multiline
                            onSubmitEditing={handleSubmit(onSubmit)}
                            accessibilityLabel="Remarks"
                        />
                    )}
                />

                <ThemeDivider size={24} />

                <Suspense fallback={<Skelton dimensions={{ height: 120 }} />}>
                    <AgricoinsApplicability onApply={(applied) => {
                        setValue('apply_coin', applied, { shouldValidate: true })
                    }} />
                </Suspense>


                <ThemeDivider size={42} />

                <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 8, alignItems: 'flex-start' }}>
                    <CheckboxInput
                        defaultValue={consent}
                        onChange={(checked: boolean) => setConsent(checked)}
                        color={theme?.primary ?? '#63370E'}
                        accessibilityLabel="Accept terms and conditions"
                    />
                    <ThemeText
                        style={{ maxWidth: 300 }}
                        content={t('bookSpray.bookingForm.consent')}
                    />
                </View>
            </View>

            <View style={{ paddingVertical: 32, gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <ThemeButton
                    label={isBusy ? t('submitting') : t('submit')}
                    variant="md"
                    style={{ width: 200 }}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isBusy || !consent}
                    loading={isBusy}
                    accessibilityLabel="Submit spray booking request"
                />
                <Pressable
                    style={{ width: 200, height: 32, alignItems: 'center', justifyContent: 'center' }}
                    onPress={resetForm}
                    disabled={isBusy}
                    accessibilityRole="button"
                    accessibilityLabel="Discard changes"
                    hitSlop={8}
                >
                    <ThemeText content={t('discardChanges')} severity="secondary" variant="xs" />
                </Pressable>
            </View>

            {showScanner && (
                <Suspense fallback={<LoadingScreen />}>
                    <QRScanner callback={setReferral} />
                </Suspense>
            )}
            {submittedResponse &&
                <BookingSuccessScreen
                    callback={() => {
                        resetForm()
                        router.replace('/sprays/mySprays')
                    }}
                    visible={!!submittedResponse}
                    detail={submittedResponse}
                />
            }
        </>
    )
}

export default SprayBookingForm
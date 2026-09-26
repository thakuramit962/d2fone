import DateSelection from '@/components/basic/inputs/DateInput/DateSelection'
import InputLabel from '@/components/basic/inputs/inputLabel'
import SelectInput from '@/components/basic/inputs/SelectInput/NewSelectInput'
import NumberCounter from '@/components/basic/numberCounter'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeChip from '@/components/basic/ThemeChip'
import ThemeDivider from '@/components/basic/ThemeDivider'
import API from '@/constants/api'
import { useLocationData } from '@/hooks/use-locationData'
import { useTheme } from '@/hooks/use-theme'
import { Farm } from '@/models/user'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { useAppSelector } from '@/store/store'
import dayjs from 'dayjs'
import { ReactNode, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Control, useController, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useDispatch } from 'react-redux'
import Skelton from '../../Skelton'
import ChooseFarmForm from '../farms/chooseFarmForm'
import YieldPredictorResult from './predictionResult'
import { ParamOptions, Result } from './yieldPredictiontypes'

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type FormValues = {
    crop: string
    state: string
    district: string
    soil_type: string
    sowing_date: string
    field_size: string
}

type SelectFieldName = 'crop' | 'state' | 'district' | 'soil_type'

// Shape expected by SelectInput. Adjust if your component exports its own type.
type SelectOption = { id: number | string; label: string; value: string }

const ERROR_COLOR = '#D93025' // TODO: swap for your theme's error token

const toOptions = (list?: string[]): SelectOption[] =>
    (list ?? []).map((value, i) => ({ id: i, label: value, value }))

/* -------------------------------------------------------------------------- */
/*                              Small sub-components                          */
/* -------------------------------------------------------------------------- */

type FormRowProps = { label: string; error?: string; children: ReactNode }

const FormRow = ({ label, error, children }: FormRowProps) => (
    <View>
        <View style={styles.row}>
            <InputLabel label={label} required />
            <View style={styles.control}>{children}</View>
        </View>
        {!!error && <ThemeText content={error} style={styles.errorText} />}
    </View>
)

type SelectFieldProps = {
    control: Control<FormValues>
    name: SelectFieldName
    label: string
    options: SelectOption[]
    loading?: boolean
    onSelect?: (value: string) => void
}

/** A required select bound to react-hook-form (single source of truth: the form). */
const SelectField = ({ control, name, label, options, loading, onSelect }: SelectFieldProps) => {
    const { t } = useTranslation()

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        control,
        name,
        rules: {
            required: t('yieldPredictor.errors.required', { defaultValue: 'This field is required' }),
        },
    })

    // Stable reference so SelectInput doesn't re-sync on every render.
    const selected = useMemo(() => options.filter((o) => o.value === value), [options, value])

    const handleChange = useCallback(
        (val: SelectOption[]) => {
            const next = val?.[0]?.value ?? '' // selection can be cleared
            onChange(next)
            onSelect?.(next)
        },
        [onChange, onSelect]
    )

    return (
        <FormRow label={label} error={error?.message}>
            <SelectInput
                options={options}
                loading={loading}
                size={42}
                defaultValues={selected}
                onSelectionchange={handleChange}
            />
        </FormRow>
    )
}

/* -------------------------------------------------------------------------- */
/*                                 Main form                                  */
/* -------------------------------------------------------------------------- */

const YieldPredictionForm = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { width } = useWindowDimensions()

    const myFarms = useAppSelector((state) => state.auth?.currentUser?.userFarms)
    const farms = useMemo<Farm[]>(
        () => (Array.isArray(myFarms) ? myFarms : myFarms ? [myFarms] : []),
        [myFarms]
    )

    // Users without farms land on the usable "others" tab.
    const [forLocation, setForLocation] = useState<'farm' | 'others'>(farms.length ? 'farm' : 'others')
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [showFarmProblem, setShowFarmProblem] = useState(false)

    const [paramOptions, setParamOptions] = useState<ParamOptions | null>(null)
    const [optionsError, setOptionsError] = useState(false)

    const [prediction, setPrediction] = useState<Result | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const submittingRef = useRef(false)

    const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
        defaultValues: {
            crop: '',
            state: '',
            district: '',
            soil_type: '',
            sowing_date: dayjs().format('YYYY-MM-DD'),
            field_size: '1',
        },
    })

    const { stateList, loading, district, fetchData } = useLocationData()

    /* ------------------------------ Derived data ----------------------------- */

    // Falls back to the first farm; no effect needed.
    const activeFarm = selectedFarm ?? farms[0] ?? null

    const farmProblem =
        forLocation !== 'farm'
            ? null
            : !activeFarm
                ? t('yieldPredictor.errors.selectFarm', { defaultValue: 'Select a farm or use another location' })
                : !activeFarm.state || !activeFarm.district
                    ? t('yieldPredictor.errors.farmIncomplete', {
                        defaultValue: 'This farm has no state or district. Update it or use another location',
                    })
                    : null

    const cropOptions = useMemo(() => toOptions(paramOptions?.crops), [paramOptions])
    const soilOptions = useMemo(() => toOptions(paramOptions?.soil_types), [paramOptions])

    /* -------------------------------- Data load ------------------------------ */

    const loadParamOptions = useCallback(async () => {
        setOptionsError(false)
        dispatch(updateProcessingState(true))
        try {
            const res = await API.get('/v1/yield/options')
            setParamOptions({
                crops: res.data?.data?.crops ?? [],
                soil_types: res.data?.data?.soil_types ?? [],
            })
        } catch (err) {
            console.error('Failed to load yield options', err)
            setOptionsError(true)
        } finally {
            dispatch(updateProcessingState(false))
        }
    }, [dispatch])

    useEffect(() => {
        loadParamOptions()
    }, [loadParamOptions])

    /* -------------------------------- Handlers ------------------------------- */

    const showFarm = useCallback(() => setForLocation('farm'), [])
    const showOthers = useCallback(() => setForLocation('others'), [])

    const handleFarmChange = useCallback((item: Farm | null | undefined) => {
        setSelectedFarm(item ?? null)
        setShowFarmProblem(false)
    }, [])

    // Event-driven instead of an effect: load districts when the state changes.
    const handleStateSelect = useCallback(
        (next: string) => {
            setValue('district', '')
            if (next) fetchData(next)
        },
        [setValue, fetchData]
    )

    const closeResult = useCallback(() => setPrediction(null), [])

    const onSubmit = useCallback(
        async (data: FormValues) => {
            if (farmProblem || submittingRef.current) return

            if (!(Number(data.field_size) > 0)) {
                setSubmitError(
                    t('yieldPredictor.errors.invalidSize', { defaultValue: 'Enter a field size greater than 0' })
                )
                return
            }

            const farm = forLocation === 'farm' ? activeFarm : null
            const body = farm ? { ...data, state: farm.state, district: farm.district } : data

            submittingRef.current = true
            setSubmitError(null)
            dispatch(updateProcessingState(true))
            try {
                const res = await API.post('/v1/yield/predict', body)
                if (String(res.data?.statuscode) === '200') {
                    setPrediction({ ...res.data?.data, msg: res.data?.msg, status: res.data?.status })
                    reset()
                } else {
                    setSubmitError(
                        res.data?.msg ||
                        t('yieldPredictor.errors.generic', { defaultValue: 'Could not get a prediction. Try again' })
                    )
                }
            } catch (err) {
                console.error('Yield prediction failed', err)
                setSubmitError(
                    t('yieldPredictor.errors.generic', { defaultValue: 'Could not get a prediction. Try again' })
                )
            } finally {
                submittingRef.current = false
                dispatch(updateProcessingState(false))
            }
        },
        [activeFarm, dispatch, farmProblem, forLocation, t]
    )

    const onPressSubmit = useCallback(() => {
        setShowFarmProblem(true)
        void handleSubmit(onSubmit)()
    }, [handleSubmit, onSubmit])

    /* --------------------------------- Render -------------------------------- */

    return (
        prediction
            ? <YieldPredictorResult data={prediction} onClose={closeResult} />

            : <>
                <View style={[styles.card, { borderColor: `${theme.text.primary}25` }]}>
                    <ThemeText content={t('yieldPredictor.title')} fontFamily='MontserratBold' variant='xs' />
                    <ThemeText severity='secondary' content={t('yieldPredictor.description')} />

                    <ThemeDivider size={16} />
                    <View style={styles.chips}>
                        <ThemeChip
                            onPress={showFarm}
                            label={t('yieldPredictor.location.myFarm')}
                            variant='xs'
                            type={forLocation === 'farm' ? 'solid' : 'default'}
                            severity='info'
                        />
                        <ThemeChip
                            onPress={showOthers}
                            label={t('yieldPredictor.location.others')}
                            variant='xs'
                            type={forLocation === 'others' ? 'solid' : 'default'}
                            severity='info'
                        />
                    </View>

                    <ThemeDivider size={24} />

                    <View style={styles.locationBlock}>
                        {forLocation === 'farm' ? (
                            <>
                                <Suspense fallback={<Skelton dimensions={{ height: 72 }} />}>
                                    <ChooseFarmForm
                                        selectedId={activeFarm ? String(activeFarm.id) : undefined}
                                        onChange={handleFarmChange}
                                    />
                                </Suspense>
                                {showFarmProblem && !!farmProblem && (
                                    <ThemeText content={farmProblem} style={styles.errorText} />
                                )}
                            </>
                        ) : (
                            <>
                                <SelectField
                                    control={control}
                                    name='state'
                                    label={t('yieldPredictor.fields.state')}
                                    options={stateList}
                                    onSelect={handleStateSelect}
                                />
                                <ThemeDivider size={16} />
                                <SelectField
                                    control={control}
                                    name='district'
                                    label={t('yieldPredictor.fields.district')}
                                    options={district.list}
                                    loading={loading === 'district'}
                                />
                            </>
                        )}
                    </View>

                    {optionsError && (
                        <>
                            <ThemeDivider size={16} />
                            <ThemeText
                                content={t('yieldPredictor.errors.loadOptions', {
                                    defaultValue: 'Could not load crops and soil types',
                                })}
                                style={styles.errorText}
                            />
                            <ThemeButton
                                label={t('yieldPredictor.actions.retry', { defaultValue: 'Retry' })}
                                variant='md'
                                onPress={loadParamOptions}
                            />
                        </>
                    )}

                    <ThemeDivider size={16} />
                    <SelectField
                        control={control}
                        name='crop'
                        label={t('yieldPredictor.fields.crop')}
                        options={cropOptions}
                    />

                    <ThemeDivider size={16} />
                    <SelectField
                        control={control}
                        name='soil_type'
                        label={t('yieldPredictor.fields.soilType')}
                        options={soilOptions}
                    />

                    <ThemeDivider size={16} />
                    <FormRow label={t('yieldPredictor.fields.sowingDate')}>
                        <DateSelection
                            size={42}
                            onChange={(date) => setValue('sowing_date', dayjs(date).format('YYYY-MM-DD'))}
                        />
                    </FormRow>

                    <ThemeDivider size={16} />
                    <FormRow label={t('yieldPredictor.fields.acres')}>
                        <NumberCounter
                            label={t('yieldPredictor.fields.acres')}
                            onChange={(val) => setValue('field_size', String(val))}
                        />
                    </FormRow>
                </View>

                <View style={[styles.actions, { paddingHorizontal: width * 0.1 }]}>
                    <ThemeButton label={t('yieldPredictor.actions.getResults')} variant='md' onPress={onPressSubmit} />
                    {!!submitError && <ThemeText content={submitError} style={[styles.errorText, styles.submitError]} />}
                </View>
            </>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        borderCurve: 'continuous',
        borderWidth: 1,
    },
    chips: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationBlock: {
        minHeight: 100,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    control: {
        flex: 1,
        maxWidth: '60%',
    },
    errorText: {
        color: ERROR_COLOR,
        marginTop: 4,
        textAlign: 'right',
    },
    actions: {
        marginVertical: 48,
    },
    submitError: {
        textAlign: 'center',
        marginTop: 12,
    },
})

export default YieldPredictionForm
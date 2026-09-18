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
import { dimensions } from '@/utils/app-helper'
import dayjs from 'dayjs'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import Skelton from '../../Skelton'
import ChooseFarmForm from '../farms/chooseFarmForm'
import { ParamOptions, Result, YieldPredictorType } from './yieldPredictiontypes'

const YieldPredictorResult = lazy(() => import('./predictionResult'))



const YieldPredictionForm = () => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const myFarms = useAppSelector((state) => state.auth?.currentUser?.userFarms)
    const farms: Farm[] = Array.isArray(myFarms) ? myFarms : myFarms ? [myFarms] : []

    const [forLocation, setForLocation] = useState<'farm' | 'others'>('farm')

    const [selectedFarm, setSelectedFarm] = useState<null | Farm>(null)
    const [payload, setPayload] = useState<YieldPredictorType>({} as YieldPredictorType)
    const [prediction, setPrediction] = useState<Result | null>(null)


    const [paramOptions, setParamOptions] = useState<{ data: null | ParamOptions, loading: boolean }>({ data: null, loading: false })

    const { handleSubmit, control, formState: { errors }, setValue, reset, } = useForm({
        defaultValues: {
            crop: '',
            state: '',
            district: '',
            soil_type: '',
            sowing_date: dayjs().format('YYYY-MM-DD'),
            field_size: ''

        }
    })

    const {
        stateList,
        loading,
        district,
        fetchData,
    } = useLocationData();


    const fetchParamOptions = useCallback(() => {
        if (!paramOptions.data) {
            dispatch(updateProcessingState(true))
            setParamOptions(prev => ({ ...prev, loading: true }))
            API.get('/v1/yield/options')
                .then((res) => {
                    setParamOptions(prev => ({
                        ...prev,
                        data: {
                            crops: res.data.data?.crops,
                            soil_types: res.data.data?.soil_types,
                        }
                    }))
                })
                .catch((err) => console.error('err', err))
                .finally(() => {
                    setParamOptions(prev => ({ ...prev, loading: false }))
                    dispatch(updateProcessingState(false))
                })
        }
    }, [])


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        let payload = { ...data }
        if (forLocation == 'farm' && selectedFarm) {
            payload = {
                ...data,
                state: selectedFarm.state,
                district: selectedFarm.district,
            }
        }
        dispatch(updateProcessingState(true))
        API.post('v1/yield/predict', payload)
            .then((res) => {
                if (res.data?.statuscode == '200') {
                    setPrediction({ ...res.data?.data, msg: res.data?.msg, status: res.data?.status })
                }
            })
            .catch((err) => console.error('err', err))
            .finally(() => {
                dispatch(updateProcessingState(false))
            })
    }


    useEffect(() => {
        payload.state?.length > 0 &&
            fetchData(payload.state[0].value)
    }, [payload.state])


    useEffect(() => {
        fetchParamOptions()
        setValue('field_size', '1', { shouldValidate: true })
    }, [])

    useEffect(() => {
        if (forLocation == 'farm' && farms?.length) {
            setSelectedFarm(farms[0])
        }
    }, [forLocation])

    return (
        <>
            {prediction &&
                <YieldPredictorResult
                    data={prediction}
                    onClose={() => setPrediction(null)}
                />
            }


            {/* form */}
            <>
                <View style={{
                    borderRadius: 24,
                    padding: 16,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: `${theme.text.primary}25`,
                }}>

                    <ThemeText content={t('yieldPredictor.title')} fontFamily='MontserratBold' variant='xs' />
                    <ThemeText severity='secondary' content={t('yieldPredictor.description')} />


                    <ThemeDivider size={16} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <ThemeChip onPress={() => setForLocation('farm')} label={t('yieldPredictor.location.myFarm')} variant='xs' type={forLocation == 'farm' ? 'solid' : 'default'} severity='info' />
                        <ThemeChip onPress={() => {
                            fetchParamOptions()
                            setForLocation('others')
                        }} label={t('yieldPredictor.location.others')} variant='xs' type={forLocation == 'others' ? 'solid' : 'default'} severity='info' />
                    </View>

                    <ThemeDivider size={24} />

                    <View style={{
                        minHeight: 100
                    }}>
                        {forLocation == 'farm' &&
                            <Suspense fallback={<Skelton dimensions={{ height: 72 }} />}>
                                <ChooseFarmForm selectedId={farms?.length ? String(farms[0]?.id) : undefined} onChange={(item) => (selectedFarm && selectedFarm.id == item?.id) ? setSelectedFarm(null) : setSelectedFarm(item)} />
                            </Suspense>
                            // <FlatList
                            //     data={farms}
                            //     horizontal
                            //     showsHorizontalScrollIndicator={false}
                            //     contentContainerStyle={{
                            //         gap: 8,
                            //         alignItems: 'flex-start',
                            //     }}
                            //     renderItem={({ index, item }) => {

                            //         const isSelected = selectedFarm && selectedFarm.id == item.id

                            //         return (

                            //             <Pressable
                            //                 key={index}
                            //                 onPress={() => (selectedFarm && selectedFarm.id == item.id) ? setSelectedFarm(null) : setSelectedFarm(item)}

                            //             >
                            //                 <LinearGradient colors={[`${theme.background.slate}`, `${isSelected ? theme.success : theme.background.main}40`]}
                            //                     start={{ x: 0, y: 0 }}
                            //                     end={{ x: 1, y: 1 }}
                            //                     style={{
                            //                         minWidth: dimensions.width * 0.4 > 260 ? 260 : dimensions.width * 0.4,
                            //                         maxWidth: 320,
                            //                         borderRadius: 18,
                            //                         borderCurve: 'continuous',
                            //                         padding: 8, paddingHorizontal: 14,
                            //                         borderWidth: 1,
                            //                         borderColor: isSelected ? theme.primary : `${theme.text.primary}25`,
                            //                         backgroundColor: theme.background.main,
                            //                         height: 64,
                            //                         justifyContent: 'center'
                            //                     }}
                            //                 >
                            //                     <ThemeText content={item.field_area} fontFamily='MontserratBold' variant='xs' severity={isSelected ? 'primary' : 'main'} size={14} style={{ lineHeight: 16 }} numberOfLines={1} />
                            //                     <ThemeText content={`${item.acerage} acre in ${camelCaseWords([item.district, item.state].filter((Boolean)).join(', '))}`} numberOfLines={1} style={{}} />
                            //                 </LinearGradient>
                            //             </Pressable>
                            //         )
                            //     }
                            //     }
                            //     ListEmptyComponent={
                            //         <View>
                            //             <ModernDetailItem
                            //                 icon={WarningIcon}
                            //                 onPress={() => router.navigate('/myFarms')}
                            //                 label={{ content: 'No Farm Available' }}
                            //                 description={{ content: 'Please add a new farm or manage your farms for availability', style: { maxWidth: 280 } }}
                            //             />
                            //         </View>
                            //     }
                            // />
                        }

                        {forLocation == 'others' &&
                            <>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 8,
                                    justifyContent: 'space-between',
                                }}>
                                    <InputLabel label={t('yieldPredictor.fields.state')} required />
                                    <View style={{ flex: 1, maxWidth: '60%' }}>
                                        <SelectInput
                                            options={stateList}
                                            size={42}
                                            defaultValues={payload.state}
                                            onSelectionchange={(val) => {
                                                setPayload((prev) => ({ ...prev, state: val, district: [] }))
                                                setValue('state', val[0].value, { shouldValidate: true })
                                                setValue('district', '', { shouldValidate: true })
                                            }} />
                                    </View>
                                </View>
                                <ThemeDivider size={16} />
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 8,
                                    justifyContent: 'space-between',
                                }}>
                                    <InputLabel label={t('yieldPredictor.fields.district')} required />
                                    <View style={{ flex: 1, maxWidth: '60%' }}>
                                        <SelectInput
                                            options={district.list}
                                            loading={loading == 'district'}
                                            size={42}
                                            defaultValues={payload.district}
                                            onSelectionchange={(val) => {
                                                setPayload((prev) => ({ ...prev, district: val }))
                                                setValue('district', val[0].value, { shouldValidate: true })
                                            }} />
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                    <ThemeDivider size={16} />

                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        justifyContent: 'space-between',
                    }}>
                        <InputLabel label={t('yieldPredictor.fields.crop')} required />
                        <View style={{ flex: 1, maxWidth: '60%' }}>
                            <SelectInput
                                options={paramOptions?.data ? paramOptions?.data?.crops?.map((el, i) => ({ id: i, label: el, value: el })) : []}
                                size={42}
                                defaultValues={payload.crop}
                                onSelectionchange={(val) => {
                                    setPayload((prev) => ({ ...prev, crop: val }))
                                    setValue('crop', val[0].value, { shouldValidate: true })
                                }} />
                        </View>
                    </View>
                    <ThemeDivider size={16} />
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        justifyContent: 'space-between',
                    }}>
                        <InputLabel label={t('yieldPredictor.fields.soilType')} required />
                        <View style={{ flex: 1, maxWidth: '60%' }}>
                            <SelectInput
                                options={paramOptions?.data ? paramOptions?.data?.soil_types?.map((el, i) => ({ id: i, label: el, value: el })) : []}
                                size={42}
                                defaultValues={payload.soil_type}
                                onSelectionchange={(val) => {
                                    setPayload((prev) => ({ ...prev, soil_type: val }))
                                    setValue('soil_type', val[0].value, { shouldValidate: true })
                                }} />
                        </View>
                    </View>
                    <ThemeDivider size={16} />
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        justifyContent: 'space-between',
                    }}>
                        <InputLabel label={t('yieldPredictor.fields.sowingDate')} required />
                        <View style={{ flex: 1, maxWidth: '60%' }}>
                            <DateSelection
                                size={42}
                                onChange={(date) => {
                                    setValue('sowing_date', dayjs(date).format('YYYY-MM-DD'), { shouldValidate: true })
                                }}
                            />
                        </View>
                    </View>

                    <ThemeDivider size={16} />
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        justifyContent: 'space-between',
                    }}>
                        <InputLabel label={t('yieldPredictor.fields.acres')} required />
                        <View style={{ flex: 1, maxWidth: '60%' }}>
                            <NumberCounter label={t('yieldPredictor.fields.acres')} onChange={(val) => setValue('field_size', String(val), { shouldValidate: true })} />
                        </View>
                    </View>

                </View>

                <View style={{
                    marginVertical: 48,
                    paddingHorizontal: dimensions.width * 0.1,
                }}>
                    <ThemeButton label={t('yieldPredictor.actions.getResults')} variant='md' onPress={handleSubmit(onSubmit)} />
                </View>
            </>
        </>
    )
}

export default YieldPredictionForm

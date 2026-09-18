import ScreenView from '@/components/basic/containers/screenView'
import SelectInput, { Option } from '@/components/basic/inputs/SelectInput/NewSelectInput'
import NotesSection from '@/components/basic/notesSection'
import NumberCounter from '@/components/basic/numberCounter'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { PlantIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useThrottle } from '@/hooks/use-throttle'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { FERTILIZER_CALCULATOR_NOTES } from '@/utils/notes'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Image, Pressable, ScrollView, View } from 'react-native'
import { useDispatch } from 'react-redux'


const illus = require('@/assets/images/static/fertilizerCalculator.png')

interface FETCHED_CROP {
    crop_name: string
    id: number
    nitrogen: string
    phosphorus: string
    potassium: string
}

interface CalculatedData {
    data: {
        crop_name: string
        field_size: string
        nitrogen: string
        phosphorus: string
        potassium: string
    } | null
    error: string
}

interface FetchCropInterface {
    data: FETCHED_CROP[]
    loading: boolean
    error: string
}

const FertilizerCalculator = () => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const scrollRef = useScrollToTop()
    const { t } = useTranslation()

    const [fetchCrops, setFetchCrops] = useState<FetchCropInterface>({
        data: [],
        loading: false,
        error: ''
    })
    const [selectedCrop, setSelectedCrop] = useState<Option[]>([])
    const [acres, setAcres] = useState<number>(1)
    const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(null)

    const cropList: Option[] = useMemo(() => {
        return fetchCrops.data?.map((el) => ({
            id: String(el.id),
            label: el.crop_name,
            value: el,
        })) ?? []
    }, [fetchCrops.data])

    const fetchFertilizersCrops = useCallback(async () => {
        setFetchCrops(prev => ({ ...prev, loading: true, error: '' }))
        try {
            const res = await API.get('/v1/fertilizer-crops')

            if (res.data?.status === 'success') {
                setFetchCrops(prev => ({ ...prev, data: res.data?.data || [] }))
            } else {
                setFetchCrops(prev => ({
                    ...prev,
                    data: [],
                    error: res.data?.msg || "Couldn't fetch crops."
                }))
            }
        } catch (err: any) {
            console.error('Error fetching crops', err)
            setFetchCrops(prev => ({
                ...prev,
                data: [],
                error: err?.message || err?.msg || "Couldn't fetch crops."
            }))
        } finally {
            setFetchCrops(prev => ({ ...prev, loading: false }))
        }
    }, [])

    useEffect(() => {
        fetchFertilizersCrops()
    }, [fetchFertilizersCrops])

    useEffect(() => {
        if (selectedCrop.length === 0) return
        const stillExists = cropList.some(c => c.id === selectedCrop[0].id)
        if (!stillExists) setSelectedCrop([])
    }, [cropList, selectedCrop])

    const selectedCropData = selectedCrop[0]?.value as FETCHED_CROP | undefined

    const handleSelectionChange = useCallback((item: Option | Option[] | null) => {
        const option = Array.isArray(item) ? item[0] : item
        setSelectedCrop(option ? [option] : [])
        setCalculatedData(null)
    }, [])

    const handleAcresChange = useCallback((value: number) => {
        setAcres(value)
        setCalculatedData(null)
    }, [])

    const calculate = useCallback(() => {
        if (!selectedCropData) {
            setCalculatedData({ data: null, error: t('fertilizerCalculator.validation.selectCropFirst') })
            return
        }

        const data = {
            field_size: acres,
            crop_id: selectedCropData.id
        }
        setCalculatedData({ data: null, error: '' })
        dispatch(updateProcessingState(true))
        API.post('/v1/fertilizer-calculator', data)
            .then((res) => {
                if (res.data?.status === 'success') {
                    setCalculatedData({ data: res.data?.data, error: '' })
                } else {
                    setCalculatedData({ data: null, error: res.data?.msg || t('fertilizerCalculator.error.calculation') })
                }
            })
            .catch((err) => {
                console.error(err)
                setCalculatedData({ data: null, error: err?.message || t('fertilizerCalculator.error.calculation') })
            })
            .finally(() => {
                dispatch(updateProcessingState(false))
            })
    }, [selectedCropData, acres, dispatch])

    const handleSubmit = useThrottle(calculate, 5000)

    const handleDiscard = useCallback(() => {
        setSelectedCrop([])
        setAcres(1)
        setCalculatedData(null)
    }, [])

    const cardStyle = useMemo(() => ({
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: `${theme.text.primary}25`,
    }), [theme.text.primary])

    const nutrientBoxStyle = useMemo(() => ({
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: `${theme.text.disabled}30`,
    }), [theme.text.disabled])

    // ---- Animations ----

    // Selected-crop summary fade/slide-in when a crop is chosen
    const cropInfoAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        Animated.timing(cropInfoAnim, {
            toValue: selectedCropData ? 1 : 0,
            duration: 220,
            useNativeDriver: true,
        }).start()
    }, [selectedCropData, cropInfoAnim])

    // Error message fade-in
    const errorAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        Animated.timing(errorAnim, {
            toValue: calculatedData?.error ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }, [calculatedData?.error, errorAnim])

    // Results card: fade + slide up + light scale-pop when a fresh calculation lands
    const resultAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        if (calculatedData?.data) {
            resultAnim.setValue(0)
            Animated.spring(resultAnim, {
                toValue: 1,
                friction: 7,
                tension: 60,
                useNativeDriver: true,
            }).start()
        }
    }, [calculatedData?.data, resultAnim])

    // Button press feedback
    const buttonScale = useRef(new Animated.Value(1)).current
    const handlePressIn = useCallback(() => {
        Animated.spring(buttonScale, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 40,
            bounciness: 4,
        }).start()
    }, [buttonScale])
    const handlePressOut = useCallback(() => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 40,
            bounciness: 8,
        }).start()
    }, [buttonScale])

    const errorStyle = useMemo(() => ({
        opacity: errorAnim,
        transform: [{
            translateY: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-4, 0],
            })
        }],
    }), [errorAnim])

    const resultStyle = useMemo(() => ({
        opacity: resultAnim,
        transform: [
            {
                translateY: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                })
            },
            {
                scale: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.97, 1],
                })
            },
        ],
    }), [resultAnim])

    const buttonAnimStyle = useMemo(() => ({
        transform: [{ scale: buttonScale }],
    }), [buttonScale])

    return (
        <LinearGradient colors={[`${theme.info}40`, theme.background.main]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                flex: 1
            }}>
            <ScreenView bg={'transparent'}>
                <Header withoutTopPadding />
                <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 8,
                        maxWidth: 400,
                        paddingHorizontal: 24,
                        marginHorizontal: 'auto',
                        alignItems: 'center'
                    }}>
                        <View style={{ flex: 1 }}>
                            <ThemeText content={t('fertilizerCalculator.title')} variant='sm' fontFamily='MontserratSemiBold' />
                            <ThemeText content={t('fertilizerCalculator.subtitle')} variant='xxs' fontFamily='InterRegular' severity='secondary' />
                        </View>
                        <Image
                            source={illus}
                            style={{
                                height: 110, width: 110,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>

                    <SelectInput
                        loading={fetchCrops.loading}
                        disabled={fetchCrops.loading}
                        onSelectionchange={handleSelectionChange}
                        options={cropList}
                        defaultValues={selectedCrop}
                        icon={PlantIcon}
                        size={48}
                        placeholder={t('fertilizerCalculator.selectCrop.placeholder')}
                    />
                    {fetchCrops.error ? (
                        <ThemeText content={fetchCrops.error} severity='error' />
                    ) : null}

                    {!fetchCrops.loading && !fetchCrops.error && cropList.length === 0 && (
                        <ThemeText content={t('fertilizerCalculator.states.noCrops')} />
                    )}

                    <View style={cardStyle}>
                        <ThemeText content={t('fertilizerCalculator.fieldSize.title')} fontFamily='InterBold' variant='xs' />
                        <ThemeText content={t('fertilizerCalculator.fieldSize.description')} severity='secondary' />
                        <ThemeDivider size={16} />

                        <NumberCounter speed={1} min={0.1} max={999} defaultValue={acres} onChange={handleAcresChange} />
                    </View>

                    {calculatedData?.error ? (
                        <Animated.View style={errorStyle}>
                            <ThemeText severity='error' content={calculatedData.error} />
                        </Animated.View>
                    ) : null}

                    {calculatedData?.data
                        &&
                        <>

                            <Animated.View style={[cardStyle, resultStyle]}>
                                <ThemeText content={t('fertilizerCalculator.result.title')} fontFamily='InterBold' variant='xs' />
                                <ThemeText content={
                                    t(
                                        'fertilizerCalculator.result.recommendedFor',
                                        { field_size: calculatedData.data.field_size, crop_name: calculatedData.data.crop_name }
                                    )
                                } severity='secondary' />
                                <ThemeDivider size={16} />
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}>
                                    <View style={nutrientBoxStyle}>
                                        <ThemeText content={t('fertilizerCalculator.result.nitrogen')} severity='secondary' />
                                        <ThemeText content={`${calculatedData.data.nitrogen}`} fontFamily='InterBold' variant='xs' />
                                        <ThemeText content={`${selectedCropData?.nitrogen} ${t('fertilizerCalculator.result.perAcre')}`} severity='secondary' />
                                    </View>
                                    <View style={nutrientBoxStyle}>
                                        <ThemeText content={t('fertilizerCalculator.result.phosphorus')} severity='secondary' />
                                        <ThemeText content={`${calculatedData.data.phosphorus}`} fontFamily='InterBold' variant='xs' />
                                        <ThemeText content={`${selectedCropData?.phosphorus} ${t('fertilizerCalculator.result.perAcre')}`} severity='secondary' />
                                    </View>
                                    <View style={nutrientBoxStyle}>
                                        <ThemeText content={t('fertilizerCalculator.result.potassium')} severity='secondary' />
                                        <ThemeText content={`${calculatedData.data.potassium}`} fontFamily='InterBold' variant='xs' />
                                        <ThemeText content={`${selectedCropData?.potassium} ${t('fertilizerCalculator.result.perAcre')}`} severity='secondary' />
                                    </View>
                                </View>
                            </Animated.View>
                            <NotesSection NOTES={FERTILIZER_CALCULATOR_NOTES()} />
                        </>
                    }

                    <ThemeDivider size={24} />
                    <Animated.View style={[{ width: 260, marginHorizontal: 'auto' }, buttonAnimStyle]}>
                        <Pressable
                            onPress={handleSubmit}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={!selectedCropData || fetchCrops.loading}
                        >
                            <ThemeButton
                                onPress={handleSubmit}
                                label={!calculatedData?.data ? t('fertilizerCalculator.buttons.calculate') : t('fertilizerCalculator.buttons.reCalculate')}
                                variant='md'
                                disabled={!selectedCropData || fetchCrops.loading}
                                textStyle={{ fontFamily: 'MontserratSemiBold' }}
                            />
                        </Pressable>
                    </Animated.View>

                    <ActionText label={t('discardChanges')} action={handleDiscard} severity='main' withIcon={false} />
                </ScrollView>
            </ScreenView>
        </LinearGradient>
    )
}

export default FertilizerCalculator
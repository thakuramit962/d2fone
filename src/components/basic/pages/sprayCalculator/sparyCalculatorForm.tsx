import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Component & Layout Imports
import BottomSheet from '@/components/basic/bottomSheet'
import InputLabel from '@/components/basic/inputs/inputLabel'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import NumberCounter from '@/components/basic/numberCounter'
import SprayCalculationResult from '@/components/basic/pages/sprayCalculator/sprayCalculationResult'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ChemicalIcon, EditIcon, InfoIcon } from '@/components/icons'

// Core Infrastructure & Custom Hooks
import { SprayProduct } from '@/components/basic/pages/sprayCalculator/sampleSpray'
import { SprayCalculation, sprayStypes, SprayType } from '@/components/basic/pages/sprayCalculator/types'
import API from '@/constants/api'
import { useDebounce } from '@/hooks/use-debounce'
import { useTheme } from '@/hooks/use-theme'
import { useThrottle } from '@/hooks/use-throttle'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { useAppDispatch } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import ModernDetailItem from '../../modernDetailItem'

interface ProductState {
    list: SprayProduct[]
    selected: SprayProduct | null
    loading: boolean
}

interface MeasurementState {
    tank: number
    field: number
}

// Spray Method Domain Types
type SprayMethod = 'Drone' | 'Manual' | 'Tractor' | 'Boom'

const sprayMethods: SprayMethod[] = ['Drone', 'Tractor', 'Boom', 'Manual',]

const WATER_LITRES_PER_ACRE: Record<SprayMethod, number> = {
    Manual: 200,   // Knapsack / hand sprayer — high volume, full coverage
    Tractor: 120,  // Tractor-mounted boom — medium volume
    Boom: 100,     // Self-propelled / large boom sprayer — medium-low volume
    Drone: 10,      // ULV drone spraying — low volume, concentrated
}

const MIN_TANK_CAPACITY_BY_METHOD: Record<SprayMethod, number> = {
    Manual: 1,
    Tractor: 5,
    Boom: 5,
    Drone: 1,
}

const DEFAULT_CHEMICAL_DOSE_ML_PER_ACRE = 60
const MIN_FIELD_SIZE = 0.1

const SprayCalculatorForm: React.FC = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { bottom, top } = useSafeAreaInsets()
    const scrollRef = useScrollToTop()

    // Form State Architecture
    const [sprayType, setSprayType] = useState<SprayType>('Insecticide')
    const [sprayMethod, setSprayMethod] = useState<SprayMethod>('Drone')
    const [product, setProduct] = useState<ProductState>({ list: [], selected: null, loading: true })
    const [similerProduct, setSimilerProduct] = useState<SprayProduct[]>([])
    const [showSheet, setShowSheet] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [size, setSize] = useState<MeasurementState>({ tank: 10, field: 1 })
    const [result, setResult] = useState<SprayCalculation | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)

    const debouncedSearchQuery = useDebounce(searchQuery, 350)

    const abortControllerRef = useRef<AbortController | null>(null)

    // Dynamic styles derived from active theme & safe area
    const dynamicStyles = useMemo(() => ({
        containerBorder: { borderColor: `${theme.text.primary}25` },
        dropdownBg: { backgroundColor: `${theme.text.disabled}30` },
        sheetContainer: { marginBottom: bottom + 8 }
    }), [theme, bottom])

    const minTankForMethod = MIN_TANK_CAPACITY_BY_METHOD[sprayMethod]

    const handleSprayTypeChange = useCallback((type: SprayType) => {
        setSprayType(type)
        setProduct(prev => ({ ...prev, selected: null }))
    }, [])

    const handleSprayMethodChange = useCallback((method: SprayMethod) => {
        setSprayMethod(method)
        setSize(prev => ({ field: prev?.field, tank: WATER_LITRES_PER_ACRE[method] }))
    }, [sprayMethod])

    const fetchPayloadOptions = useCallback(() => {
        abortControllerRef.current?.abort()
        const controller = new AbortController()
        abortControllerRef.current = controller

        setFetchError(null)
        dispatch(updateProcessingState(true))

        API.get(`/v1/spray/options`, {
            signal: controller.signal,
            params: {
                spray_type: sprayType,
                search: debouncedSearchQuery.trim()
            }
        })
            .then((res: any) => {
                setProduct(prev => ({
                    ...prev,
                    list: res.data?.data?.[sprayType] ?? [],
                    loading: false
                }))
            })
            .catch((err: any) => {
                if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
                console.error('Failed to fetch spray products', err)
                setFetchError('Could not load products. Please try again.')
            })
            .finally(() => {
                if (abortControllerRef.current === controller) {
                    dispatch(updateProcessingState(false))
                }
            })
    }, [dispatch, sprayType, debouncedSearchQuery])

    // Trigger API calls whenever the spray type or debounced search query updates
    useEffect(() => {
        fetchPayloadOptions()
        return () => {
            abortControllerRef.current?.abort()
        }
    }, [sprayType, debouncedSearchQuery, fetchPayloadOptions])


    const handleReset = useCallback(() => {
        setSearchQuery('')
        setProduct(prev => ({ ...prev, selected: null }))
        setSize({ field: 1, tank: 200 })
        setSprayType('Insecticide')
        setSprayMethod('Drone')
        setShowSheet(false)
        setResult(null)
        setFetchError(null)
    }, [])

    const isCalculateDisabled = useMemo(() => (
        !product.selected || size.tank < minTankForMethod || size.field < MIN_FIELD_SIZE
    ), [product.selected, size.tank, size.field, minTankForMethod])

    const handleCalculate = useThrottle(() => {
        if (!product.selected) return

        const data = {
            chemical_id: product.selected.id,
            field_size: size.field,
            tank_capacity: size.tank
        }

        const dosePerAcre = product?.selected?.base_dose ?? DEFAULT_CHEMICAL_DOSE_ML_PER_ACRE
        const waterRate = WATER_LITRES_PER_ACRE[sprayMethod]
        const totalWater = size.field * waterRate
        const totalChemical = size.field * dosePerAcre
        const calculatedTanks = Math.ceil(totalWater / size.tank)

        API.post('/v1/spray/calculate', data)
            .then((res) => {
                console.log('res', res.data.data?.similar_products)
                if (res.data.data?.similar_products?.length) {
                    setSimilerProduct(res.data.data?.similar_products)
                }
            })
            .catch((err) => console.error('Error', err))
            .finally(() => {
                setResult({
                    spray_type: sprayType,
                    technical_name: product?.selected?.technical_name || "Unknown Chemical Base",
                    field_size: `${size.field}`,
                    tank_capacity: `${size.tank} Litre`,
                    total_water_required: `${totalWater}`,
                    total_chemical_required: `${totalChemical?.toFixed(4)}`,
                    number_of_tanks: String(calculatedTanks),
                    chemical_per_tank: `${(totalChemical / calculatedTanks).toFixed(4)} ml`,
                    msg: 'Spray Calculation Completed Successfully', status: 'success'
                })
            })






    }, 3000, { leading: true })

    const handleCloseSheet = useCallback(() => {
        setSearchQuery('')
        setShowSheet(false)
    }, [])

    const handleSelectProduct = useCallback((item: SprayProduct) => {
        setProduct(prev => ({ ...prev, selected: item }))
        setShowSheet(false)
    }, [])

    const handleTankChange = useCallback((val: number) => {
        setSize(prev => ({ ...prev, tank: Math.max(val, 0) }))
    }, [])

    const handleFieldChange = useCallback((val: number) => {
        setSize(prev => ({ ...prev, field: Math.max(val, 0) }))
    }, [])

    const renderProductItem = useCallback(({ item, index }: { item: SprayProduct; index: number }) => {
        const isSelected = product.selected?.id === item.id
        const isNotLast = index < (product.list?.length || 1) - 1

        const dynamicItemStyle = {
            borderBottomWidth: isNotLast ? 1 : 0,
            borderColor: isSelected ? theme.success : `${theme.text.primary}25`,
            backgroundColor: isSelected ? `${theme.success}15` : theme.background.main
        }

        return (
            <Pressable
                onPress={() => handleSelectProduct(item)}
                style={[styles.productItem, dynamicItemStyle]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Select ${item.technical_name}`}
            >
                <ThemeText
                    content={item.chemical}
                    variant='xs'
                    fontFamily='MontserratMedium'
                    severity={isSelected ? 'success' : 'main'}
                />
                <ThemeText content={item.company_name} severity='secondary' />
                <ThemeText content={`${item.technical_name} - ${item.spray_type}`} />
            </Pressable>
        )
    }, [product.selected?.id, product.list?.length, theme, handleSelectProduct])

    const keyExtractor = useCallback((item: SprayProduct, index: number) => (
        item?.id != null ? String(item.id) : `product-${index}`
    ), [])

    const renderListEmpty = useCallback(() => {
        if (fetchError) {
            return (
                <View style={styles.emptyState}>
                    <ThemeText content={fetchError} severity='error' variant='xs' />
                    <ThemeButton
                        label='Retry'
                        variant='sm'
                        onPress={fetchPayloadOptions}
                        style={styles.retryBtn}
                    />
                </View>
            )
        }
        return (
            <View style={styles.emptyState}>
                <ThemeText content='No products found' severity='secondary' variant='xs' />
            </View>
        )
    }, [fetchError, fetchPayloadOptions])

    return (
        <>
            <ScrollView
                ref={scrollRef}
                style={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.card, dynamicStyles.containerBorder, styles.gapSmall]}>
                    <Text style={styles.inputLabelPadding}>
                        <ThemeText content='Spray Method' variant='xs' fontFamily='MontserratSemiBold' />
                        <ThemeText content=' *' variant='xs' fontFamily='MontserratSemiBold' severity='error' />
                    </Text>

                    <View style={styles.rowCenter}>
                        {sprayMethods.map((method) => {
                            const isActive = sprayMethod === method

                            return (
                                <Pressable
                                    key={method}
                                    onPress={() => handleSprayMethodChange(method)}
                                    style={styles.flexOne}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: isActive }}
                                >
                                    <LinearGradient
                                        colors={isActive
                                            ? ['#1F6FEB', '#5FA8FF']
                                            : [theme.background.main, theme.background.slate]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[styles.chip, dynamicStyles.containerBorder]}
                                    >
                                        <ThemeText
                                            content={method}
                                            variant='xs'
                                            fontFamily='MontserratSemiBold'
                                            color={isActive ? theme.background.main : theme.text.secondary}
                                        />
                                    </LinearGradient>
                                </Pressable>
                            )
                        })}
                    </View>

                    <ThemeText
                        content={`Water rate: ${WATER_LITRES_PER_ACRE[sprayMethod]} Litre/acre`}
                        variant='xs'
                        severity='secondary'
                    />
                </View>

                <ThemeDivider size={16} />

                {/* Product Dropdown Selector */}
                <View style={[styles.card, dynamicStyles.containerBorder, styles.productCardMinHeight]}>

                    <Text style={styles.inputLabelPadding}>
                        <ThemeText content='Chemical' variant='xs' fontFamily='MontserratSemiBold' />
                        <ThemeText content=' *' variant='xs' fontFamily='MontserratSemiBold' severity='error' />
                    </Text>

                    <View style={styles.rowCenter}>
                        {sprayStypes?.map((type) => {
                            const isActive = sprayType === type

                            return (
                                <Pressable
                                    key={type}
                                    onPress={() => handleSprayTypeChange(type as SprayType)}
                                    style={styles.flexOne}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: isActive }}
                                >
                                    <LinearGradient
                                        colors={isActive
                                            ? ['#148F2B', '#67D261']
                                            : [theme.background.main, theme.background.slate]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[styles.chip, dynamicStyles.containerBorder]}
                                    >
                                        <ThemeText
                                            content={type}
                                            variant='xs'
                                            fontFamily='MontserratSemiBold'
                                            color={isActive ? theme.background.main : theme.text.secondary}
                                        />
                                    </LinearGradient>
                                </Pressable>
                            )
                        })}
                    </View>
                    <ThemeDivider size={16} />

                    <ModernDetailItem
                        onPress={() => setShowSheet(true)}
                        label={{ content: "Select chemical" }}
                        bg={theme.background.slate}
                        icon={ChemicalIcon}
                        description={{
                            content: product.selected?.chemical || 'Select Product',
                            variant: 'sm',
                            fontFamily: "MontserratMedium",
                            severity: product.selected ? 'main' : 'secondary',
                            selectable: true
                        }}
                        actionIcon={<EditIcon size={20} color={theme.info} />}
                    />

                    {
                        product.selected && (
                            <View style={{ gap: 1, marginTop: 16 }}>
                                <ModernDetailItem
                                    bg={theme.background.slate}
                                    isFirst
                                    minHeight={24} padding={2}
                                    description={{ content: product.selected.chemical_name, variant: 'xxs', fontFamily: 'MontserratSemiBold' }}
                                />
                                <ModernDetailItem
                                    single={false}
                                    icon={InfoIcon}
                                    bg={theme.background.slate}
                                    minHeight={24} padding={2}
                                    label={{ content: 'Active Ingredients', variant: 'xxs', fontFamily: 'MontserratRegular', style: { minWidth: 140 } }}
                                    description={{ content: product.selected.technical_name, variant: 'xxs', fontFamily: 'MontserratSemiBold' }}
                                />
                                <ModernDetailItem
                                    isLast
                                    icon={InfoIcon}
                                    minHeight={24} padding={2}
                                    bg={theme.background.slate}
                                    label={{ content: 'Dose on Label', variant: 'xxs', fontFamily: 'MontserratRegular' }}
                                    description={{ content: `${product.selected.base_dose} ${product.selected.unit} per acre`, variant: 'xxs', fontFamily: 'MontserratSemiBold', numberOfLines: 2 }}
                                />
                            </View>
                        )
                    }

                </View>

                <ThemeDivider size={16} />

                {/* Measurements Input */}
                {!result &&
                    <View style={[styles.card, dynamicStyles.containerBorder, { gap: 16 }]}>
                        <View style={{ gap: 4, }}>
                            <InputLabel label={`Tank Capacity (min ${minTankForMethod}L)`} required />
                            <View style={styles.counterWrapper}>
                                <NumberCounter
                                    key={sprayMethod}
                                    label='Litres'
                                    hideSpeedCounter
                                    speed={1}
                                    min={minTankForMethod}
                                    defaultValue={size.tank}
                                    onChange={handleTankChange}
                                />
                            </View>
                        </View>
                        <View style={{ gap: 4 }}>
                            <InputLabel label='Field Size' required />
                            <View style={styles.counterWrapper}>
                                <NumberCounter
                                    label='Acres'
                                    defaultValue={size.field}
                                    onChange={handleFieldChange}
                                />
                            </View>
                        </View>
                    </View>
                }

                <ThemeDivider size={48} />
                <ThemeButton
                    onPress={handleCalculate}
                    label='Calculate'
                    variant='md'
                    disabled={isCalculateDisabled}
                    style={styles.calculateBtn}
                />
            </ScrollView>

            {/* Product Selection Modal */}
            <BottomSheet
                onClose={handleCloseSheet}
                visible={showSheet}
                height={dimensions.height - top}
            >
                <View style={[styles.sheetContainer, dynamicStyles.sheetContainer]}>
                    <ThemeText content='Select Product' fontFamily='MontserratSemiBold' variant='xs' />
                    <ThemeInput
                        size={42}
                        placeholder='Search product..'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <FlatList
                        style={[styles.flatList, dynamicStyles.containerBorder]}
                        contentContainerStyle={styles.flatListContent}
                        data={product.list}
                        renderItem={renderProductItem}
                        keyExtractor={keyExtractor}
                        ListEmptyComponent={renderListEmpty}
                        initialNumToRender={12}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews
                    />
                    <ThemeButton
                        style={styles.doneBtn}
                        label='Done'
                        variant='sm'
                        onPress={handleCloseSheet}
                    />
                </View>
            </BottomSheet>

            {result && <SprayCalculationResult data={{ ...result, similar_products: similerProduct }} onClose={handleReset} />}
        </>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 8,
    },
    card: {
        borderWidth: 1,
        borderCurve: 'continuous',
        borderRadius: 24,
        padding: 12,
    },
    productCardMinHeight: {
        minHeight: 140,
    },
    gapSmall: {
        gap: 6,
    },
    gapMedium: {
        gap: 12,
    },
    inputLabelPadding: {
        paddingLeft: 6,
    },
    rowCenter: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexOne: {
        flex: 1,
    },
    chip: {
        borderWidth: 1,
        borderRadius: 10,
        borderCurve: 'continuous',
        padding: 4,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        borderRadius: 14,
        paddingLeft: 24,
        paddingRight: 8,
        paddingVertical: 8,
    },
    paddingHorizontalM: {
        paddingHorizontal: 12,
    },
    counterWrapper: {
        // flex: 1,
        // maxWidth: '60%',
    },
    calculateBtn: {
        width: 260,
        marginHorizontal: 'auto',
    },
    sheetContainer: {
        padding: 16,
        flex: 1,
        gap: 16,
    },
    flatList: {
        flex: 1,
        borderWidth: 1,
        borderCurve: 'continuous',
        borderRadius: 24,
        padding: 12,
    },
    flatListContent: {
        paddingBottom: 150,
    },
    productItem: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    retryBtn: {
        width: 120,
    },
    doneBtn: {
        width: 200,
        marginHorizontal: 'auto',
    },
})

export default SprayCalculatorForm
// export default memo(SprayCalculatorForm)
import ScreenView from "@/components/basic/containers/screenView"
import type { SelectOption as ExpendableSelectOption } from "@/components/basic/inputs/SelectInput/expendableSelectInput"
import ExpendableSelectInput from "@/components/basic/inputs/SelectInput/expendableSelectInput"
import ThemeInput from "@/components/basic/inputs/ThemeInput"
import CommodityItem from "@/components/basic/pages/mandiBhaav/commodityItem"
import Skelton from "@/components/basic/Skelton"
import ActionText from "@/components/basic/text/ActionText"
import ThemeText from "@/components/basic/text/ThemeText"
import ThemeDivider from "@/components/basic/ThemeDivider"
import Header from "@/components/layout/navigation/Header"
import { useTheme } from "@/hooks/use-theme"
import useMandiBhaav from "@/hooks/useMandiBhaav"
import { updateProcessingState } from "@/slices/processing-state-slice"
import { dimensions } from "@/utils/app-helper"
import { DISTRICTS } from "@/utils/districtList"
import { STATES } from "@/utils/stateList"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"

/* ---------------- Types ---------------- */

type StateType = {
    state_id: number
    state_name: string
}

type DistrictType = {
    id: number
    state_id: number | null
    district_name: string
}

type SelectOption = {
    id: number
    label: string
    value: string
}

/* ---------------- Constants (module-level, computed once) ---------------- */

// Sliced and mapped once at module load — not inside the component
const STATE_OPTIONS: SelectOption[] = STATES.slice(1).map((s: StateType) => ({
    id: s.state_id,
    label: s.state_name,
    value: s.state_name,
}))

const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`)

const SKELETON_DIMS = { height: 72 }

const NO_DATA_IMAGE = require("@/assets/images/static/no-data.png")
const DATA_GOV_LOGO = require("@/assets/images/static/data-gov-in-logo.png")

/* ---------------- Memoised sub-components ---------------- */

const LoadingSkeletons = React.memo(() => (
    <View style={styles.skeletonContainer}>
        {SKELETON_KEYS.map((key) => (
            <Skelton key={key} dimensions={SKELETON_DIMS} />
        ))}
    </View>
))

interface EmptyStateProps {
    message: string
    onRefresh?: () => void
}

const EmptyState = React.memo<EmptyStateProps>(({ message, onRefresh }) => (
    <View style={styles.emptyContainer}>
        <Image source={NO_DATA_IMAGE} style={styles.emptyImage} />
        <ThemeText
            content="Nothing to show"
            fontFamily="MontserratSemiBold"
            variant="sm"
            severity="disabled"
        />
        <ThemeText content={message} severity="disabled" />
        {onRefresh && (
            <>
                <ThemeDivider size={32} />
                <ActionText label="Refresh" action={onRefresh} />
            </>
        )}
    </View>
))

interface DataFooterProps {
    themeMode: string | null | undefined
}

const DataFooter = React.memo<DataFooterProps>(() => (
    <View style={styles.footerContainer}>
        <ThemeText content="Data provided by" severity="disabled" variant="xs" />
        <Image source={DATA_GOV_LOGO} style={styles.footerLogo} />
    </View>
))

/* ---------------- Main Component ---------------- */

const MandiBhaav: React.FC = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const themeMode = useColorScheme()
    const { top, bottom } = useSafeAreaInsets()
    const { bhaav, isEmpty, groupAndSort, fetchMandiBhaav } = useMandiBhaav()

    const [selectedState, setSelectedState] = useState<StateType | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictType | null>(null)
    const [searchText, setSearchText] = useState<string>("")

    // Ref guards AsyncStorage writes from racing on fast state switches
    const latestStateNameRef = useRef<string | null>(null)

    /* ---------- Derived data ---------- */

    const stateDistricts = useMemo<SelectOption[]>(() => {
        if (!selectedState?.state_id) return []
        return DISTRICTS
            .filter((d) => d.state_id === selectedState.state_id)
            .map((d) => ({
                id: d.id,
                label: d.district_name,
                value: d.district_name,
            }))
    }, [selectedState?.state_id])

    const defaultStateOption = useMemo<SelectOption | undefined>(() => {
        if (!selectedState) return undefined
        return {
            id: selectedState.state_id,
            label: selectedState.state_name,
            value: selectedState.state_name,
        }
    }, [selectedState])

    const result = useMemo(() => {
        if (!bhaav?.list?.length) return []
        const keyword = searchText.toLowerCase().trim()
        const district = selectedDistrict?.district_name?.toLowerCase().trim() ?? ""
        const filtered = bhaav.list.filter((el: any) => {
            const marketMatch =
                !keyword ||
                el.market?.toLowerCase().includes(keyword) ||
                el.commodity?.toLowerCase().includes(keyword)
            const districtMatch = !district || el.district?.toLowerCase().includes(district)
            return marketMatch && districtMatch
        })
        return groupAndSort(filtered)
    }, [bhaav.list, searchText, selectedDistrict?.district_name, groupAndSort])

    const minScrollHeight = useMemo(
        () => dimensions.height - (top + bottom + 132),
        [top, bottom]
    )

    /* ---------- Handlers ---------- */

    const loadData = useCallback(() => {
        if (!selectedState?.state_name) return
        fetchMandiBhaav({
            state: selectedState.state_name,
            district: selectedDistrict?.district_name ?? "",
        })
    }, [selectedState?.state_name, selectedDistrict?.district_name, fetchMandiBhaav])

    const handleStateChange = useCallback(
        async (option: ExpendableSelectOption) => {
            const stateName = option.value
            latestStateNameRef.current = stateName

            setSelectedState({ state_id: (option as any).id, state_name: stateName })
            setSelectedDistrict(null)

            try {
                await AsyncStorage.setItem("mandiState", stateName)
            } catch (err) {
                console.error("[MandiBhaav] Failed to persist state", err)
            }
        },
        []
    )

    const handleDistrictChange = useCallback(
        (option: ExpendableSelectOption) => {
            if (!selectedState) return
            setSelectedDistrict({
                id: (option as any).id,
                district_name: option.value,
                state_id: selectedState.state_id,
            })
        },
        [selectedState]
    )

    const handleRefresh = useCallback(() => loadData(), [loadData])

    const handleStatePressFactory = useCallback(
        (st: StateType) => async () => {
            setSelectedState(st)
            try {
                await AsyncStorage.setItem("mandiState", st.state_name)
            } catch (err) {
                console.error("[MandiBhaav] Failed to persist state", err)
            }
        },
        []
    )

    /* ---------- Effects ---------- */

    // Restore persisted state on mount
    useEffect(() => {
        let cancelled = false

        const restore = async () => {
            dispatch(updateProcessingState(true))
            try {
                const ss = await AsyncStorage.getItem("mandiState")
                if (!cancelled && ss) {
                    const match = STATE_OPTIONS.find((el) => el.value === ss)
                    if (match) {
                        setSelectedState({ state_id: match.id, state_name: match.value })
                    }
                }
            } catch (err) {
                console.error("[MandiBhaav] Failed to restore state", err)
            } finally {
                if (!cancelled) dispatch(updateProcessingState(false))
            }
        }

        restore()
        return () => { cancelled = true }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch when state changes
    useEffect(() => {
        if (selectedState?.state_name) loadData()
    }, [selectedState?.state_name]) // eslint-disable-line react-hooks/exhaustive-deps

    /* ---------- Styles that depend on theme / runtime values ---------- */

    const scrollContentStyle = useMemo(
        () => ({
            backgroundColor: theme?.background.slate,
            padding: 16,
            minHeight: minScrollHeight,
        }),
        [theme?.background.slate, minScrollHeight]
    )

    const stateTileStyle = useMemo(
        () => ({
            backgroundColor: themeMode === "dark" ? "#5c5d3d" : "#c8caa3",
        }),
        [themeMode]
    )

    const stateNameColor = themeMode === "dark" ? "#b4b694" : "#7b7f34"

    /* ---------- Render helpers ---------- */

    const renderStateGrid = useCallback(
        () =>
            STATES.slice(1).map((st, i) => (
                <Pressable
                    key={st.state_id ?? i}
                    onPress={handleStatePressFactory(st)}
                    style={[styles.stateTile, stateTileStyle]}
                >
                    <View
                        style={[
                            styles.stateTileInner,
                            { backgroundColor: theme?.background.main },
                        ]}
                    >
                        <ThemeText
                            style={styles.stateTileLabel}
                            color={stateNameColor}
                            content={st.state_name}
                            fontFamily="MontserratSemiBold"
                        />
                    </View>
                    <ThemeText
                        style={[styles.stateTileSubLabel, { color: theme?.background.slate }]}
                        size={9}
                        content="View Mandi Bhaav"
                    />
                </Pressable>
            )),
        [stateTileStyle, theme?.background.main, theme?.background.slate, stateNameColor, handleStatePressFactory]
    )

    const renderList = useCallback(
        () =>
            result.map((group: any, i: number) => (
                <CommodityItem key={`group-${i}`} item={group} index={i} />
            )),
        [result]
    )

    /* ---------- JSX ---------- */

    return (
        <ScreenView edges={["bottom", "left", "right"]}>
            <Header
                label="Mandi Bhaav"
                description={selectedState ? "View current mandi bhaav in chosen areas" : ""}
                bg={theme.background.main}
                rightSlot={
                    selectedState?.state_name ? (
                        <View style={styles.headerStateSelector}>
                            <ExpendableSelectInput
                                size={32}
                                options={STATE_OPTIONS}
                                defaultValue={defaultStateOption}
                                onChange={handleStateChange}
                            />
                        </View>
                    ) : undefined
                }
                bottomSlot={
                    !bhaav.loading && selectedState ? (
                        <View style={styles.filterRow}>
                            <ExpendableSelectInput
                                size={32}
                                options={stateDistricts}
                                placeholder="Choose District"
                                mainContainerStyle={styles.filterFlex1}
                                onChange={handleDistrictChange}
                            />
                            <ThemeInput
                                size={32}
                                cornerRadius={12}
                                mainContainerStyle={styles.filterFlex1_5}
                                placeholder="Search Mandi / Crop"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    ) : null
                }
            />

            {selectedState?.state_id ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={bhaav.loading} onRefresh={handleRefresh} />
                    }
                    style={styles.flex1}
                    contentContainerStyle={scrollContentStyle}
                >
                    {bhaav.loading && <LoadingSkeletons />}

                    {!bhaav.loading && isEmpty && (
                        <EmptyState
                            message="Pull down to refresh or try again later"
                            onRefresh={handleRefresh}
                        />
                    )}

                    {!bhaav.loading && !isEmpty && result.length === 0 && (
                        <EmptyState message="No results for current filters" />
                    )}

                    {!bhaav.loading && !isEmpty && renderList()}

                    <DataFooter themeMode={themeMode} />
                </ScrollView>
            ) : (
                <View style={[styles.statePickerContainer, { backgroundColor: theme?.background.main }]}>
                    <ThemeDivider size={8} />
                    <ThemeText
                        content="Select a state or region to see current mandi bhaav for various crops."
                        variant="xs"
                        severity="secondary"
                        style={styles.statePickerHint}
                    />
                    <ThemeDivider size={16} />
                    <ScrollView>
                        <View style={styles.stateGrid}>
                            {renderStateGrid()}
                        </View>
                    </ScrollView>
                </View>
            )}
        </ScreenView>
    )
}

/* ---------------- Static styles ---------------- */

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    skeletonContainer: {
        gap: 8,
    },
    emptyContainer: {
        minHeight: 500,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyImage: {
        height: 160,
        width: 160,
        resizeMode: "contain",
    },
    footerContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 300,
    },
    footerLogo: {
        height: 60,
        width: 120,
        resizeMode: "contain",
    },
    headerStateSelector: {
        width: 160,
        borderRadius: 16,
    },
    filterRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 12,
    },
    filterFlex1: {
        flex: 1,
    },
    filterFlex1_5: {
        flex: 1.5,
    },
    statePickerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    statePickerHint: {
        maxWidth: 300,
        paddingLeft: 24,
    },
    stateGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    stateTile: {
        height: 100,
        minWidth: dimensions.width * 0.4,
        flex: 1,
        padding: 4,
        borderRadius: 24,
        borderCurve: "continuous",
        alignItems: "center",
        shadowColor: "#83838380",
    } as any, // borderCurve is iOS-only, cast needed
    stateTileInner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    stateTileLabel: {
        textAlign: "center",
        fontSize: 14,
        verticalAlign: "middle",
        maxWidth: 120,
    } as any,
    stateTileSubLabel: {
        paddingTop: 2,
        textAlign: "center",
    },
})

export default MandiBhaav
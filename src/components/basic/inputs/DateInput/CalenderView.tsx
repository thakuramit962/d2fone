import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from "@/components/icons"
import { useTheme } from "@/hooks/use-theme"
import { dimensions } from "@/utils/app-helper"
import dayjs, { Dayjs } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import React from "react"
import { Pressable, ScrollView, View } from "react-native"
import IconButton from "../../buttons/IconButton"
import ThemeText from "../../text/ThemeText"
import ThemeButton from "../../ThemeButton"
import ThemeDivider from "../../ThemeDivider"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface CalenderViewInterface {
    returnAction: (date: Dayjs) => void
    defaultDate?: Dayjs
    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Dayjs
    maxDate?: Dayjs
    showAction?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const yearsOption = (future = false, past = true): (number | string)[] => {
    const currentYear = dayjs().year()
    const last100 = Array.from({ length: 101 }, (_, i) => currentYear - 1 - i)
    const next100 = Array.from({ length: 2099 - currentYear }, (_, i) => 2099 - i)
    return [
        ...(future ? next100 : []),
        currentYear,
        ...(past ? last100 : []),
    ]
}

// ─── Component ────────────────────────────────────────────────────────────────

const CalenderView = (props: CalenderViewInterface) => {
    const {
        returnAction,
        defaultDate = dayjs(),
        disableFuture = false,
        disablePast = false,
        minDate,
        maxDate,
        showAction = true,
    } = props

    const theme = useTheme()
    const parentWidth = dimensions.width * 0.9

    // Stable "today" reference — avoids re-computing dayjs() on every render
    const today = React.useRef(dayjs()).current

    const [selectingYear, setSelectingYear] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState<string>(
        defaultDate.format('YYYY-MM-DD')
    )
    const [month, setMonth] = React.useState<string>(selectedDate)

    // ── Derived values (memoized) ────────────────────────────────────────────

    // BUG FIX: was missing firstDate reassignment, so the while-loop never
    // advanced and produced an infinite loop / empty array.
    const dates = React.useMemo<string[]>(() => {
        const startDate = dayjs(month).startOf('month')
        const endDate = dayjs(month).endOf('month')
        const allDates: string[] = []
        let current = startDate
        while (current.isSameOrBefore(endDate)) {
            allDates.push(current.format('YYYY-MM-DD'))
            current = current.add(1, 'day') // ← was `current.add(…)` result discarded
        }
        return allDates
    }, [month])

    const calenderDates = React.useMemo<(string | null)[]>(() => {
        const startDay = dayjs(month).startOf('month').day()
        const emptyDates: null[] = Array(startDay).fill(null)
        return [...emptyDates, ...dates]
    }, [dates, month])

    // Cache the years list — it only changes when disableFuture/disablePast change
    const years = React.useMemo(
        () => yearsOption(!disableFuture, !disablePast),
        [disableFuture, disablePast]
    )

    // ── Helpers ──────────────────────────────────────────────────────────────

    const changeMonth = React.useCallback(
        (type: 'prev' | 'next') =>
            setMonth(prev =>
                dayjs(prev)
                    .add(type === 'next' ? 1 : -1, 'month')
                    .format('YYYY-MM-DD')
            ),
        []
    )

    // BUG FIX: previous logic used isSameOrBefore(dayjs()) which compared
    // against today's full datetime rather than the start of the current month,
    // so the "prev" arrow was disabled for the entire current month.
    const isPrevDisabled =
        disablePast && dayjs(month).startOf('month').isSameOrBefore(today.startOf('month'))
    const isNextDisabled =
        disableFuture && dayjs(month).endOf('month').isSameOrAfter(today.endOf('month'))

    const isDateDisabled = React.useCallback(
        (date: string | null): boolean => {
            if (!date) return true
            const d = dayjs(date)
            return (
                (!!minDate && d.isBefore(minDate, 'day')) ||
                (!!maxDate && d.isAfter(maxDate, 'day')) ||
                (disableFuture && d.isAfter(today, 'day')) ||
                (disablePast && d.isBefore(today, 'day'))
            )
        },
        [minDate, maxDate, disableFuture, disablePast, today]
    )

    const handleDatePress = React.useCallback(
        (date: string | null) => {
            if (!date || isDateDisabled(date)) return
            const d = dayjs(date)
            setSelectedDate(d.format('YYYY-MM-DD'))
            if (!showAction) {
                returnAction(d)
            }
        },
        [isDateDisabled, showAction, returnAction]
    )

    const handleReset = React.useCallback(() => {
        const formatted = defaultDate.format('YYYY-MM-DD')
        setSelectedDate(formatted)
        returnAction(defaultDate)
    }, [defaultDate, returnAction])

    const cellSize = parentWidth / 7.005

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <ThemeDivider size={16} />
            <ThemeText content="Select Date" fontFamily="MontserratBlack" variant="xs" />
            <ThemeDivider size={24} />

            {/* Header row */}
            <View
                style={{
                    width: parentWidth,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Year picker toggle */}
                <Pressable
                    onPress={() => setSelectingYear(prev => !prev)}
                    style={{
                        minWidth: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: 8,
                        paddingRight: 4,
                        gap: 4,
                        backgroundColor: `${theme?.background.main}10`,
                        borderRadius: 30,
                    }}
                >
                    <ThemeText
                        variant="sm"
                        severity="info"
                        fontFamily="MontserratMedium"
                        content={dayjs(month).format('YYYY')}
                    />
                    <ArrowDownIcon height={16} width={16} color={theme?.info} />
                </Pressable>

                {/* Month navigator (hidden while picking year) */}
                {!selectingYear && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                            icon={
                                <ArrowLeftIcon
                                    height={20}
                                    width={20}
                                    color={isPrevDisabled ? theme?.text?.disabled : theme?.info}
                                />
                            }
                            disabled={isPrevDisabled}
                            onPress={() => changeMonth('prev')}
                        />
                        <View style={{ minWidth: 70, alignItems: 'center' }}>
                            <ThemeText
                                fontFamily="MontserratMedium"
                                variant="sm"
                                severity="info"
                                content={dayjs(month).format('MMM')}
                            />
                        </View>
                        <IconButton
                            icon={
                                <ArrowRightIcon
                                    height={20}
                                    width={20}
                                    color={isNextDisabled ? theme?.text?.disabled : theme?.info}
                                />
                            }
                            disabled={isNextDisabled}
                            onPress={() => changeMonth('next')}
                        />
                    </View>
                )}
            </View>

            {/* Calendar grid */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-end',
                    marginBottom: 8,
                    width: parentWidth,
                    minHeight: cellSize * 8,
                }}
            >
                {selectingYear
                    ? years.map((year, i) => {
                        const isSelected = `${year}` === dayjs(month).format('YYYY')
                        const isCurrentYear = `${year}` === today.format('YYYY')
                        return (
                            <Pressable
                                key={`year-${i}`}
                                onPress={() => {
                                    setMonth(prev =>
                                        dayjs(prev).year(+year).format('YYYY-MM-DD')
                                    )
                                    setSelectingYear(false)
                                }}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: cellSize,
                                    minWidth: cellSize,
                                    backgroundColor: isSelected ? theme?.primary : 'transparent',
                                    borderWidth: isCurrentYear && !isSelected ? 1 : 0,
                                    borderColor: theme?.info,
                                    borderRadius: 20,
                                }}
                            >
                                <ThemeText
                                    content={`${year}`}
                                    variant="sm"
                                    style={{ fontFamily: 'MontserratMedium', textAlign: 'center', fontSize: 12 }}
                                    color={isSelected ? theme?.primaryContrast : theme?.text.secondary}
                                />
                            </Pressable>
                        )
                    })
                    : <>
                        {/* Day-of-week header */}
                        {DAY_NAMES.map(dayName => (
                            <View
                                key={dayName}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 32,
                                    minWidth: cellSize,
                                    backgroundColor: `${theme?.info}20`,
                                    marginVertical: 12,
                                    ...(dayName === 'Su'
                                        ? { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }
                                        : {}),
                                    ...(dayName === 'Sa'
                                        ? { borderTopRightRadius: 20, borderBottomRightRadius: 20 }
                                        : {}),
                                }}
                            >
                                <ThemeText
                                    content={dayName}
                                    variant="sm"
                                    fontFamily="MontserratBold"
                                    style={{ textAlign: 'center', fontSize: 13 }}
                                    color={theme?.text.secondary}
                                />
                            </View>
                        ))}

                        {/* Date cells */}
                        {calenderDates.map((date, i) => {
                            const isSelected =
                                !!date &&
                                dayjs(date).isSame(dayjs(selectedDate), 'day')
                            const disabled = isDateDisabled(date)

                            return (
                                <Pressable
                                    key={`date-${i}`}
                                    onPress={() => handleDatePress(date)}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: parentWidth / 7,
                                        minWidth: cellSize,
                                        backgroundColor: isSelected ? theme?.primary : 'transparent',
                                        borderRadius: 20,
                                    }}
                                >
                                    <ThemeText
                                        content={date ? dayjs(date).format('DD') : ''}
                                        variant="sm"
                                        fontFamily="MontserratSemiBold"
                                        style={{ textAlign: 'center', fontSize: 12 }}
                                        color={
                                            isSelected
                                                ? theme?.primaryContrast
                                                : disabled
                                                    ? theme?.text.disabled
                                                    : theme?.text.secondary
                                        }
                                    />
                                </Pressable>
                            )
                        })}
                    </>
                }
            </ScrollView>

            {/* Action footer */}
            {showAction && (
                <>
                    <ThemeDivider size={16} />

                    <View
                        style={{
                            backgroundColor: `${theme?.text.primary}20`,
                            width: '90%',
                            borderRadius: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 12,
                                alignItems: 'center',
                                padding: 8,
                            }}
                        >
                            <CalendarIcon color={theme?.text.secondary} height={32} width={32} />
                            <View style={{ flex: 1 }}>
                                <ThemeText
                                    severity="primary"
                                    variant="xs"
                                    content="Selected Date"
                                    color={theme?.text.disabled}
                                />
                                <ThemeText
                                    color={theme?.text.primary}
                                    variant="md"
                                    fontFamily="MontserratSemiBold"
                                    content={dayjs(selectedDate).format('DD MMM YYYY')}
                                />
                            </View>
                            <ThemeButton
                                label="Done"
                                onPress={() => returnAction(dayjs(selectedDate))}
                                variant="sm"
                                style={{ width: 80 }}
                                fontFamily="MontserratMedium"
                                severity="primary"
                            />
                        </View>
                    </View>

                    <Pressable
                        onPress={handleReset}
                        android_ripple={{ color: `${theme?.primary}30`, borderless: false }}
                        style={{
                            borderRadius: 20,
                            paddingHorizontal: 24,
                            paddingVertical: 4,
                            alignItems: 'center',
                            marginVertical: 12,
                        }}
                    >
                        <ThemeText
                            content="CLOSE"
                            variant="xs"
                            fontFamily="MontserratMedium"
                            style={{ letterSpacing: 1 }}
                        />
                    </Pressable>
                </>
            )}
        </View>
    )
}

export default CalenderView
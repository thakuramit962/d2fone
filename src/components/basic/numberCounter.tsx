import { useTheme } from '@/hooks/use-theme'
import { useLongPressIn } from '@/hooks/useLongPressIn'
import { LinearGradient } from 'expo-linear-gradient'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native'
import { MinusIcon, PlusIcon } from '../icons'
import ThemeText from './text/ThemeText'

// ─── Config ───────────────────────────────────────────────────────────────────
const MIN = 0
const MAX = 999
const STEPS = [0.1, 1, 10] as const
type Step = typeof STEPS[number]

// ─── Haptics ──────────────────────────────────────────────────────────────────
let haptics: { impactAsync: (style: string) => void } | null = null
try { haptics = require('expo-haptics') } catch { }
const impact = () => { try { haptics?.impactAsync('light') } catch { } }

// ─── AnimatedButton ───────────────────────────────────────────────────────────
interface ButtonProps {
    onPress: () => void
    variant: 'minus' | 'plus'
}

const AnimatedButton = memo(({ onPress, variant }: ButtonProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current
    const isMinus = variant === 'minus'
    const color = isMinus ? '#E05252' : '#5A9FD4'

    const pressIn = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 0.88, useNativeDriver: true, tension: 200, friction: 10,
        }).start()
    }, [scaleAnim])

    const pressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1, useNativeDriver: true, tension: 120, friction: 8,
        }).start()
    }, [scaleAnim])

    const { start, stop } = useLongPressIn(onPress)

    return (
        <Pressable
            onPressIn={() => { pressIn(); start() }}
            onPressOut={() => { pressOut(); stop() }}
            hitSlop={12}
            style={styles.buttonPressable}
        >
            <Animated.View style={[styles.buttonInner, { transform: [{ scale: scaleAnim }] }]}>
                {isMinus
                    ? <MinusIcon color={color} size={24} />
                    : <PlusIcon color={color} size={24} />
                }
            </Animated.View>
        </Pressable>
    )
})

// ─── ValueDisplay ─────────────────────────────────────────────────────────────
interface ValueDisplayProps {
    value: number
    direction: 'up' | 'down' | null
    label?: string
}

const ValueDisplay = memo(({ value, direction, label }: ValueDisplayProps) => {
    const theme = useTheme()
    const slideAnim = useRef(new Animated.Value(0)).current
    const fadeAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        if (!direction) return
        const outY = direction === 'up' ? -18 : 18
        const inY = direction === 'up' ? 18 : -18

        slideAnim.setValue(0)
        fadeAnim.setValue(1)

        Animated.parallel([
            Animated.timing(slideAnim, { toValue: outY, duration: 90, easing: Easing.in(Easing.ease), useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 90, useNativeDriver: true }),
        ]).start(() => {
            slideAnim.setValue(inY)
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 160, friction: 12, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start()
        })
    }, [value])

    return (
        <View style={[
            styles.valueWrapper,
            { borderColor: `${theme.background.main}80` },
        ]}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                <ThemeText
                    content={value.toFixed(1)}
                    fontFamily="MontserratBold"
                    size={18}
                    style={styles.valueText}
                />
            </Animated.View>
            {label && (
                <ThemeText content={label} fontFamily="InterRegular" size={10} severity="secondary" />
            )}
        </View>
    )
})

// ─── StepSelector ─────────────────────────────────────────────────────────────
interface StepSelectorProps {
    activeStep: Step
    onSelect: (s: Step) => void
}

const STEP_LABELS: Record<Step, string> = { 0.1: '0.1 ×', 1: '1.0 ×', 10: '10 ×' }

const StepSelector = memo(({ activeStep, onSelect }: StepSelectorProps) => {
    const theme = useTheme()
    return (
        <View style={styles.stepRow}>
            <ThemeText content="Speed: " />
            {STEPS.map(s => (
                <Pressable
                    key={s}
                    onPress={() => onSelect(s)}
                    style={[
                        styles.stepBtn,
                        {
                            backgroundColor: activeStep === s
                                ? `${theme.text.primary}`
                                : `${theme.text.primary}15`,
                        },
                    ]}
                >
                    <ThemeText content={STEP_LABELS[s]} fontFamily="MontserratSemiBold" color={activeStep === s ? theme.background.main : theme.text.primary} />
                </Pressable>
            ))}
        </View>
    )
})

// ─── NumberCounter ────────────────────────────────────────────────────────────
interface NumberCounterProps {
    label?: string
    defaultValue?: number
    onChange?: (value: number) => void
    hideSpeedCounter?: boolean
    speed?: typeof STEPS[number]
    min?: number
    max?: number
}

export default function NumberCounter({ label, defaultValue = 1, onChange, hideSpeedCounter, speed = 0.1, min = MIN, max = MAX }: NumberCounterProps) {
    const theme = useTheme()
    const [step, setStep] = useState<Step>(speed)
    const [value, setValue] = useState(defaultValue)
    const [direction, setDirection] = useState<'up' | 'down' | null>(null)

    const stepRef = useRef(step)
    useEffect(() => { stepRef.current = step }, [step])

    // valueRef mirrors state so callbacks always read the true current value,
    // avoiding the stale-closure queue that causes rapid taps to overshoot.
    const valueRef = useRef(defaultValue)

    const decrement = useCallback(() => {
        const next = Math.round((valueRef.current - stepRef.current) * 10) / 10
        if (next < min) return
        impact()
        valueRef.current = next
        setValue(next)
        setDirection('down')
        onChange?.(next)
    }, [onChange])

    const increment = useCallback(() => {
        const next = Math.round((valueRef.current + stepRef.current) * 10) / 10
        if (next > max) return
        impact()
        valueRef.current = next
        setValue(next)
        setDirection('up')
        onChange?.(next)
    }, [onChange])

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[`${theme.error}15`, `${theme.info}15`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <AnimatedButton variant="minus" onPress={decrement} />
                <ValueDisplay value={value} direction={direction} label={label} />
                <AnimatedButton variant="plus" onPress={increment} />
            </LinearGradient>

            {!hideSpeedCounter && <StepSelector activeStep={step} onSelect={setStep} />}
        </View>
    )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { gap: 6 },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
        paddingHorizontal: 8,
        height: 42,
    },
    buttonPressable: {
        flex: 1,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        overflow: 'hidden',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    valueText: { lineHeight: 20 },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 8,
    },
    stepBtn: {
        borderRadius: 8,
        width: 48,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
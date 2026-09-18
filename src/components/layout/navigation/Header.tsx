import ThemeText from '@/components/basic/text/ThemeText';
import { useGlobalStyle } from '@/hooks/useGlobalStyle';
import { dimensions } from '@/utils/app-helper';
import React, { memo } from 'react';
import {
    StatusBar,
    StatusBarStyle,
    StyleSheet,
    useColorScheme,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity =
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'main'
    | 'secondary'
    | 'disabled'
    | 'primary';

type TextOrNode = string | React.ReactNode;

export interface HeaderProps {
    bg?: string;
    labelSeverity?: string;
    buttonSeverity?: Severity;
    color?: string;
    statusBarStyle?: StatusBarStyle;
    withPadding?: boolean;
    style?: ViewStyle;
    backIcon?: boolean;
    backAction?: () => void;
    label?: TextOrNode;
    labelNumberOfLines?: number;
    description?: TextOrNode;
    descriptionNumberOfLines?: number;
    descriptionColor?: string;
    rightSlot?: React.ReactNode;
    bottomSlot?: React.ReactNode;
    withoutTopPadding?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


function isString(value: TextOrNode): value is string {
    return typeof value === 'string';
}

// ─── Component ────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
    bg,
    backIcon = true,
    backAction,
    label,
    labelSeverity,
    labelNumberOfLines = 2,
    description,
    descriptionNumberOfLines = 2,
    descriptionColor,
    buttonSeverity,
    rightSlot,
    bottomSlot,
    color,
    withPadding = true,
    statusBarStyle,
    style,
    withoutTopPadding = false
}) => {
    const colorScheme = useColorScheme()
    const globalStyle = useGlobalStyle();
    const { top } = useSafeAreaInsets();

    // ── Derived layout values ────────────────────────────────────────────────
    const hasRightSlot = Boolean(rightSlot);
    const maxLabelWidth = hasRightSlot
        ? dimensions.width * 0.45
        : dimensions.width * 0.72;

    // ── Render helpers ───────────────────────────────────────────────────────
    const renderLabel = () => {
        if (!label) return null;
        if (!isString(label)) return <>{label}</>

        return (
            <ThemeText
                content={label}
                variant='sm'
                // size={14}
                fontFamily="MontserratSemiBold"
                numberOfLines={labelNumberOfLines}
                color={color ?? labelSeverity}
                style={{ maxWidth: maxLabelWidth, }}
            />
        );
    }


    const renderDescription = () => {
        if (!description) return null;
        if (!isString(description)) return <>{description}</>;

        return (
            <ThemeText
                content={description}
                size={10}
                fontFamily="InterRegular"
                numberOfLines={descriptionNumberOfLines}
                color={descriptionColor ?? color ?? labelSeverity}
                style={[styles.descriptionText, { maxWidth: maxLabelWidth, lineHeight: 14, marginTop: -4 }]}
            />
        );
    };

    // ────────────────────────────────────────────────────────────────────────
    return (
        <View
            style={[
                globalStyle.justifyCenter,
                styles.wrapper,
                {
                    backgroundColor: bg ?? 'transparent',
                    paddingTop: (withoutTopPadding ? 0 : top) + (withPadding ? 16 : 0),
                    paddingVertical: withPadding ? 12 : 0,
                    paddingHorizontal: withPadding ? 16 : 0,
                },
                style,
            ]}
        >
            <StatusBar barStyle={statusBarStyle || (colorScheme == 'dark' ? 'light-content' : 'dark-content') || 'default'} animated backgroundColor={bg ?? 'transparent'} />

            {/* ── Main row ── */}
            {(backIcon || hasRightSlot || label || description) &&
                <View style={styles.mainRow}>
                    {backIcon && (
                        <BackButton
                            onPress={backAction}
                        />
                    )}

                    {/* Title block */}
                    <View style={styles.titleBlock}>
                        {renderLabel()}
                        {renderDescription()}
                    </View>

                    {/* Trailing slot */}
                    {hasRightSlot && (
                        <View style={styles.rightSlotContainer}>
                            {rightSlot}
                        </View>
                    )}
                </View>
            }

            {/* ── Bottom slot (full width, e.g. search bar / tabs) ── */}
            {bottomSlot && (
                <View style={styles.bottomSlotContainer}>
                    {bottomSlot}
                </View>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: 36,
    },
    titleBlock: {
        flex: 1,
        justifyContent: 'center',
        gap: 2,
    },
    descriptionText: {
        opacity: 0.85,
        marginTop: 2,
    },
    rightSlotContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bottomSlotContainer: {
        marginTop: 8,
    },
});

// ─── Export ───────────────────────────────────────────────────────────────────

export default memo(Header);
/**
 * PermissionCard — a single row showing a permission toggle.
 */

import { useTheme } from '@/hooks/use-theme';
import { memo } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import ThemeText from '../text/ThemeText';

type PermissionCardProps = {
    title: string;
    subtitle: string;
    detail: string;
    value: boolean;
    withoutBorder?: boolean;
    onToggle: (value: boolean) => void;
};

function PermissionCard({
    title,
    subtitle,
    detail,
    value,
    withoutBorder = false,
    onToggle,
}: PermissionCardProps) {
    const theme = useTheme();

    return (
        <View
            style={[
                styles.container,
                withoutBorder ? styles.lastItem : styles.borderedItem,
            ]}
        >
            <View style={styles.textGroup}>
                <ThemeText
                    content={title}
                    size={16}
                    fontFamily="MontserratBold"
                    color="#141414"
                />
                <ThemeText
                    content={value ? detail : subtitle}
                    size={12}
                    color={value ? '#2d7a2d' : '#606060'}
                />
            </View>

            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{
                    false: Platform.OS === 'android' ? '#d3d3d3' : theme?.error ?? '#e0e0e0',
                    true: theme?.success ?? '#4cd964',
                }}
                thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                ios_backgroundColor={theme?.error ?? '#e0e0e0'}
                accessibilityRole="switch"
                accessibilityLabel={title}
                accessibilityState={{ checked: value }}
            />
        </View>
    );
}

export default memo(PermissionCard);

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    borderedItem: {
        borderBottomWidth: 2,
        borderColor: '#e8e8e8',
        marginBottom: 8,
    },
    lastItem: {
        borderBottomWidth: 0,
        marginBottom: 0,
    },
    textGroup: {
        flex: 1,
        paddingRight: 12,
    },
});
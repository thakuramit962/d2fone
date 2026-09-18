import ThemeText from '@/components/basic/text/ThemeText';
import ThemeDivider from '@/components/basic/ThemeDivider';
import { ArrowRightDoubleIcon, BinIcon, EditIcon, InfoIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { SprayRequest } from '@/models/sprayRequest';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

const SPRAY_STATUS = {
    ACCEPTED: 1,
    REJECTED: 0,
    PROCESSED: 2,
} as const;

export const Actions = ({ onEdit, onDelete, detail }:
    { onEdit?: () => void, onDelete?: () => void, detail: SprayRequest }
) => {

    const theme = useTheme();
    const { t } = useTranslation();

    const navigateToTimeline = () => router.navigate({
        pathname: '/sprays/sprayTimeline',
        params: { orderId: detail.service_id }
    });

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View>
                    <ThemeText
                        content={t('farmerActionSheet.manageRequest')}
                        fontFamily='MontserratSemiBold'
                        variant='sm'
                    />
                    <ThemeText
                        content={t('farmerActionSheet.description')}
                        severity='secondary'
                        variant='xs'
                    />
                    <ThemeDivider size={16} />

                    <ThemeText
                        content={`#${detail.request_id}`}
                        fontFamily='MontserratSemiBoldItalic'
                        variant='xxs'
                    />
                    <ThemeText
                        content={t('farmerActionSheet.lastUpdated', { date: dayjs(detail.updated_at).format('D MMM @HH:mm:ss') })}
                        severity='disabled'
                    />
                </View>
            </View>

            <ThemeDivider size={4} />

            {detail.status === SPRAY_STATUS.ACCEPTED &&
                <View style={styles.actionsGroup}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.buttonBase,
                            pressed && styles.buttonPressed,
                            {
                                backgroundColor: `${theme.info}10`,
                                borderColor: `${theme.info}25`,
                            }
                        ]}
                        onPress={onEdit}
                    >
                        <EditIcon color={theme.info} />
                        <ThemeText
                            content={t('farmerActionSheet.editOption')}
                            fontFamily='MontserratMedium'
                            variant='sm'
                            severity='info'
                        />
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.buttonBase,
                            pressed && styles.buttonPressed,
                            {
                                backgroundColor: `${theme.error}10`,
                                borderColor: `${theme.error}25`,
                            }
                        ]}
                        onPress={onDelete}
                    >
                        <BinIcon color={theme.error} />
                        <ThemeText
                            content={t('farmerActionSheet.deleteOption')}
                            fontFamily='MontserratMedium'
                            variant='sm'
                            severity='error'
                        />
                    </Pressable>
                </View>
            }

            {detail.status === SPRAY_STATUS.REJECTED &&
                <View style={styles.rejectionContainer}>
                    <ThemeText content={t('farmerActionSheet.rejectedTitle')} fontFamily='MontserratMedium' severity='error' variant='xs' />
                    <View style={[styles.rejectionBox, { backgroundColor: `${theme.error}15` }]}>
                        {detail.farmer_rejected_remarks && <ThemeText variant='xs' content={detail.farmer_rejected_remarks} severity='secondary' />}
                        {detail.rejected_remarks && <ThemeText variant='xs' content={detail.rejected_remarks} severity='secondary' />}
                    </View>
                    <ThemeText content={detail.farmer_rejected_remarks ? t('farmerActionSheet.cancelledBySelf') : t('farmerActionSheet.rejectedByOperator')} fontFamily='InterItalic' />
                </View>
            }

            {detail.status === SPRAY_STATUS.PROCESSED &&
                <View style={styles.processedContainer}>
                    {detail.service_id
                        ? <Pressable onPress={navigateToTimeline}>
                            <ThemeText content={t('farmerActionSheet.orderCreated')} severity='secondary' />
                            <View style={styles.orderIdRow}>
                                <ThemeText content={detail.service_id} fontFamily='MontserratBold' variant='sm' severity='info' />
                                <ArrowRightDoubleIcon color={theme.info} />
                            </View>
                        </Pressable>
                        : <View style={[styles.pendingBox, { backgroundColor: `${theme.warning}15` }]}>
                            <InfoIcon size={48} color={theme.warning} />
                            <ThemeText variant='xs' severity='secondary' style={styles.centerText} content={t('farmerActionSheet.pendingMessage')} />
                            {/* <ThemeText variant='sm' fontFamily='MontserratBold' content={detail.accepted_by ?? ''} /> */}
                        </View>
                    }
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-between',
    },
    headerContainer: {
        gap: 6,
    },
    actionsGroup: {
        gap: 12,
        marginBottom: 16,
    },
    buttonBase: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    rejectionContainer: {
        flex: 1,
        padding: 16,
    },
    rejectionBox: {
        padding: 16,
        borderRadius: 12,
    },
    processedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderIdRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    pendingBox: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 16,
        borderCurve: 'continuous',
        paddingVertical: 24,
    },
    centerText: {
        textAlign: 'center',
    },
});
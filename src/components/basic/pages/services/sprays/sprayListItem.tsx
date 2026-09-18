import ThemeText from '@/components/basic/text/ThemeText'
import { ArrowRightDoubleIcon, BookmarkIcon, CalendarIcon, FieldIcon, PlantIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { Order } from '@/models/order'
import { camelCaseWords } from '@/utils/app-helper'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Pressable, StyleSheet, View } from 'react-native'

const SprayListItem = ({ detail, width = '100%' }: { detail: Order, width?: DimensionValue | undefined }) => {
    const globalStyle = useGlobalStyle()
    const theme = useTheme()
    const { t } = useTranslation()

    const style = StyleSheet.create({
        main: {
            marginHorizontal: 16,
            borderRadius: 22,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: `${theme.text.primary}25`,
            paddingHorizontal: 12,
            paddingBottom: 2, paddingTop: 8,
        }
    })

    // Map order_status to translation keys
    const statusKey =
        detail?.order_status == '6' ? 'delivered'
            : detail?.order_status == '3' ? 'assigned'
                : detail?.order_status == '1' ? 'created'
                    : detail?.order_status == '0' ? 'cancelled'
                        : 'processing'

    const status = t(`sprayListItem.status.${statusKey}`)

    const severity = detail?.order_status == '6' ? theme?.success
        : detail?.order_status == '3' ? theme?.warning
            : detail?.order_status == '1' ? theme?.text.secondary
                : detail?.order_status == '0' ? theme?.error
                    : theme?.info

    const updatedDate = detail?.order_date
    const formattedUpdatedOn = updatedDate
        ? dayjs(updatedDate, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY @hh:mm A')
        : ''

    return (
        <Pressable
            onPress={() => {
                router.push({
                    pathname: '/sprays/sprayTimeline',
                    params: { orderId: `${detail?.order_id}` }
                })
            }}
            style={[style.main]}>
            <View style={[globalStyle.alignCenter, globalStyle.justifyBetween, { flexDirection: 'row' }]}>
                <ThemeText content={`# ${detail.order_id}`} fontFamily='MontserratSemiBold' variant='sm' />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <BookmarkIcon size={16} color={severity} />
                    <ThemeText content={status} variant='xs' color={severity} fontFamily='MontserratSemiBold' />
                </View>
            </View>

            <LinearGradient colors={[`${theme.background.slate}`, `${theme.background.main}`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 8, borderRadius: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                    <PlantIcon size={16} color={theme.text.secondary} />
                    <ThemeText content={t('sprayListItem.fields.crop')} fontFamily='MontserratMedium' size={12} severity='secondary' style={{ width: '25%' }} />
                    <ThemeText content={camelCaseWords(detail.crop_name)} fontFamily='MontserratSemiBold' size={12} style={{ flex: 1 }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                    <FieldIcon size={16} color={theme.text.secondary} />
                    <ThemeText content={t('sprayListItem.fields.area')} fontFamily='MontserratMedium' size={12} severity='secondary' style={{ width: '25%' }} />
                    <ThemeText
                        content={t('sprayListItem.fields.areaValue', { acreage: detail.requested_acreage })}
                        fontFamily='MontserratSemiBold' size={12} style={{ flex: 1 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                    <CalendarIcon size={16} color={theme.text.secondary} />
                    <ThemeText content={t('sprayListItem.fields.sprayDate')} fontFamily='MontserratMedium' size={12} severity='secondary' style={{ width: '25%' }} />
                    <ThemeText content={dayjs(detail.order_date, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY')} fontFamily='MontserratSemiBold' size={12} style={{ flex: 1 }} />
                </View>
            </LinearGradient>

            <View style={{ paddingLeft: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <ThemeText
                    content={t('sprayListItem.updatedOn', { date: formattedUpdatedOn })}
                    severity='disabled'
                />
                <ArrowRightDoubleIcon color={theme?.text.disabled} size={24} />
            </View>
        </Pressable>
    )
}

export default SprayListItem
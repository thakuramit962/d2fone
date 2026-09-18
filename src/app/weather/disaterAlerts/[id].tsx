import ScreenView from '@/components/basic/containers/screenView'
import DetailLine from '@/components/basic/text/detailLine'
import ThemeText from '@/components/basic/text/ThemeText'
import TextDivider from '@/components/basic/textDivider'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { RootState } from '@/store/store'
import { cleanParagraph, getExpiryStatus, getSeverityColor, parseDescription } from '@/utils/commonUtils'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'

const DisaterAlertDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const theme = useTheme()
    const { t } = useTranslation()
    const scrollRef = useScrollToTop()
    const alert = useSelector(
        (state: RootState) => state.weatherReport?.data?.alerts?.alert
    )?.find((el) => el.identifier === id)

    const severityColor = useMemo(
        () => getSeverityColor(alert?.severity, theme),
        [alert?.severity, theme]
    )
    const expiry = useMemo(() => getExpiryStatus(alert?.expires), [alert?.expires])
    const descSections = useMemo(() => parseDescription(alert?.desc), [alert?.desc])
    const instruction = useMemo(() => cleanParagraph(alert?.instruction), [alert?.instruction])
    const note = useMemo(() => cleanParagraph(alert?.note), [alert?.note])

    if (!alert) {
        return (
            <ScreenView>
                <Header withoutTopPadding backIcon label={t('weather.alerts.detail.titleFallback')} description=" " />
                <View style={{ padding: 24, alignItems: 'center' }}>
                    <ThemeText content={t('weather.alerts.detail.notAvailable')} severity="secondary" />
                </View>
            </ScreenView>
        )
    }

    return (
        <ScreenView>
            <Header withoutTopPadding backIcon label={alert.event} description={alert.urgency} />

            <ScrollView ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                <View
                    style={{
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: `${String(severityColor)}40`,
                        padding: 8,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: `${String(severityColor)}1A`,
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            alignSelf: 'flex-start',
                            marginBottom: 8,
                        }}
                    >
                        <ThemeText
                            content={alert.severity?.toUpperCase()}
                            size={11}
                            fontFamily="MontserratBold"
                            style={{ color: severityColor }}
                        />
                    </View>
                    <LinearGradient
                        colors={[`${theme.text.disabled}10`, `${theme.text.disabled}25`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 16, padding: 8 }}
                    >
                        <ThemeText content={t('weather.alerts.detail.affectedArea')} severity="secondary" />
                        <ThemeDivider size={4} />
                        <ThemeText
                            content={alert.areas}
                            size={14}
                            style={{ textAlign: 'center' }}
                            fontFamily="MontserratSemiBold"
                        />
                        <ThemeText
                            content={`${dayjs(alert.effective).format('ddd, DD MMM YYYY, hh:mm A')} → ${dayjs(alert.expires).format('ddd, DD MMM YYYY, hh:mm A')}`}
                            size={11}
                            severity="main"
                            fontFamily="MontserratMedium"
                            style={{ textAlign: 'center' }}
                        />
                        {expiry.label ? (
                            <ThemeText
                                content={expiry.label}
                                size={11}
                                fontFamily="MontserratBold"
                                style={{
                                    textAlign: 'center',
                                    color: expiry.expired ? theme.text.disabled : severityColor,
                                }}
                            />
                        ) : null}
                    </LinearGradient>

                    <ThemeDivider size={8} />

                    <ThemeText
                        content={alert.headline}
                        size={12}
                        style={{ lineHeight: 18, paddingHorizontal: 12 }}
                    />

                    <ThemeDivider size={16} />
                    <View style={{ paddingHorizontal: 16 }}>
                        <DetailLine
                            label={{ content: t('weather.alerts.detail.urgency'), variant: 'xs' }}
                            description={{ content: alert.urgency, variant: 'xs' }}
                        />
                        <DetailLine
                            label={{ content: t('weather.alerts.detail.category'), variant: 'xs' }}
                            description={{ content: alert.category, variant: 'xs' }}
                        />
                        <DetailLine
                            label={{ content: t('weather.alerts.detail.certainty'), variant: 'xs' }}
                            description={{ content: alert.certainty, variant: 'xs' }}
                        />
                        <DetailLine
                            label={{ content: t('weather.alerts.detail.status'), variant: 'xs' }}
                            description={{ content: alert.msgtype, variant: 'xs' }}
                        />

                        <ThemeDivider size={12} />

                        <TextDivider label={t('weather.alerts.detail.description')} />

                        {descSections.map((section, i) => (
                            <View key={`${section.label}-${i}`}>
                                {section.label ? (
                                    <ThemeText
                                        content={section.label}
                                        fontFamily="MontserratBold"
                                        variant="xs"
                                        severity="disabled"
                                    />
                                ) : null}
                                <ThemeText content={section.text} variant="xs" />
                                <ThemeDivider size={8} />
                            </View>
                        ))}
                        <ThemeDivider size={16} />
                        {instruction ? (
                            <LinearGradient
                                colors={[`${theme.info}`, `${theme.info}90`]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    borderRadius: 20,
                                    padding: 16, paddingTop: 8,
                                    marginHorizontal: -16,
                                }}>
                                <ThemeText
                                    content={t('weather.alerts.detail.whatToDo')}
                                    fontFamily="MontserratBold"
                                    variant="sm"
                                    color={theme.background.main}
                                />
                                <ThemeText content={instruction} variant="xs"
                                    color={theme.background.main}
                                    style={{
                                        lineHeight: 18
                                    }}
                                />
                            </LinearGradient>
                        ) : null}

                        {note ? <ThemeText content={note} /> : null}

                        <ThemeDivider size={16} />
                        <ThemeText content={t('weather.alerts.detail.idLabel', { id: alert.identifier })} severity="disabled" />
                    </View>
                </View>
            </ScrollView>
        </ScreenView>
    )
}

export default DisaterAlertDetail
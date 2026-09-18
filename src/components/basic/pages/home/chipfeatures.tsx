import { InfoIcon, LocationIcon, SpeakerIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { Href, router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import ThemeText from '../../text/ThemeText'


interface Feature {
    label: string
    Icon?: React.FC<SvgProps>;
    link?: Href
}

const Chipfeatures = () => {

    const theme = useTheme()
    const { t } = useTranslation()

    const features: Feature[] = [
        {
            label: t('chipFeatures.findAndConnect', 'Find & Connect'),
            link: '/myLocation',
            Icon: LocationIcon
        },
        {
            label: t('chipFeatures.newsAndAlerts', 'News & Alerts'),
            link: '/latestNews',
            Icon: SpeakerIcon
        },
        {
            label: t('chipFeatures.subscriptions', 'Subscriptions'),
            link: '/mySubscription',
            Icon: InfoIcon
        },
    ]

    return (
        <ScrollView horizontal
            style={{
                // marginHorizontal: -16,
                // paddingLeft: 16,
            }}
            contentContainerStyle={{
                gap: 4,
            }}>
            {features?.map((el, i) => {
                const Icon = el.Icon
                return (
                    <Pressable key={i}
                        onPress={() => el.link && router.navigate(el.link)}
                        style={{
                            borderWidth: StyleSheet.hairlineWidth,
                            backgroundColor: theme.background.main,
                            borderColor: `${theme.text.primary}50`,
                            borderRadius: 12,
                            borderCurve: 'continuous',
                            paddingRight: 16, paddingLeft: 4,
                            paddingVertical: 4,
                            height: 32,
                            flexDirection: 'row',
                            alignItems: 'center',

                        }}>
                        {Icon &&
                            <View style={{
                                height: 22,
                                width: 28,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                                <Icon height={18} width={18} color={theme.text.disabled} />
                            </View>
                        }
                        <ThemeText content={String(el.label)} fontFamily='MontserratMedium' variant='xs' />
                    </Pressable>
                )
            }
            )}
        </ScrollView>
    )
}

export default Chipfeatures
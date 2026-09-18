import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
    ColorValue,
    Image,
    StyleSheet,
    View
} from 'react-native'
import ActionText from './text/ActionText'

const logo = require('@/assets/images/transparent-black-logo.png')


const CompanyFooter = ({ withoutBottomPadding = false, bg }: { withoutBottomPadding?: boolean, bg?: ColorValue }) => {

    const theme = useTheme()

    const bottomSpace = withoutBottomPadding ? 16 : 120
    const { t } = useTranslation()

    return (
        <>

            <View
                style={{
                    backgroundColor: bg || theme.background.main,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingTop: 120,
                }}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image
                        source={logo}
                        style={{
                            height: 56, width: 260, resizeMode: 'contain'
                        }}
                        accessibilityLabel="D2F logo"
                    />
                </View>
                <ThemeText
                    content={`___ ${t('tagLine')} ___`}
                    fontFamily="MontserratSemiBold"
                    severity="disabled"
                    style={styles.centered}
                />

                <ThemeDivider size={32} />
                <Image
                    source={require('@/assets/images/static/farming.png')}
                    accessibilityLabel="Farming Illustartion"
                    style={{
                        width: dimensions.width,
                        height: (dimensions.width) * 0.25,
                        resizeMode: 'contain',

                    }}
                />
                <ThemeText content={t('allRightsReserved')} variant="xxs" severity='disabled' />
                <ThemeDivider size={8} />
                <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <ActionText label={t('menus.aboutUs')} withIcon={false} severity='main' variant='xxs' action={() => router.navigate('/aboutUs')} />
                    <ThemeText content={'|'} severity='disabled' />
                    <ActionText label={t('menus.contactUs')} withIcon={false} severity='main' variant='xxs' action={() => router.navigate('/support')} />
                    <ThemeText content={'|'} severity='disabled' />
                    <ActionText label={t('menus.privacyPolicy')} withIcon={false} severity='main' variant='xxs' action={() => router.navigate('/policies')} />
                </View>
                <ThemeDivider size={bottomSpace} />
            </View>

        </>
    )
}

export default CompanyFooter


const styles = StyleSheet.create({

    // Footer
    footer: {
        height: 300,
        justifyContent: 'flex-end',
        paddingBottom: 32,
        gap: 8,
    },
    footerLogo: {
        height: 42,
        width: 160,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    // Copyright bar
    copyright: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Shared
    centered: {
        textAlign: 'center',
    },
})
import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, View } from 'react-native'

const illus = require('@/assets/images/static/otherPages/subscription-hero.png')
const illus2 = require('@/assets/images/static/otherPages/subscription_illustration.png')

const MySubscription = () => {

    const theme = useTheme()
    const { t } = useTranslation()

    return (

        <ScreenView edges={['bottom', 'left', 'right']}>
            <ScrollView style={{
                backgroundColor: theme?.background.main,
            }}>
                <Header
                    bottomSlot={
                        <View style={{
                            marginTop: -42
                        }}>
                            <ThemeText content={t('subscription.title')} fontFamily='MontserratExtraBold' variant='sm' style={{ textTransform: 'uppercase', marginHorizontal: 'auto' }} />
                            <ThemeText content={t('subscription.tagline')} fontFamily='MontserratMedium' variant='xxs' style={{ textTransform: 'uppercase', letterSpacing: 2, marginHorizontal: 'auto' }} />
                        </View>
                    }
                />

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                }}>
                    <Image
                        source={illus}
                        style={{
                            height: 240,
                            width: '100%',
                            resizeMode: 'contain',
                            marginHorizontal: 'auto',
                            borderRadius: 24,
                        }}
                    />

                    <ThemeText content={t('subscription.heroTitle')} fontFamily='MontserratExtraBold' variant='sm' />
                    <ThemeText content={t('subscription.heroDescription')} severity='secondary' fontFamily='InterRegular' variant='xs' style={{ maxWidth: 300, textAlign: "center" }} />


                    <ThemeDivider size={64} />

                    <LinearGradient colors={['transparent', '#DFAF21']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 16,
                            minHeight: 280,
                            alignSelf: 'stretch',
                            borderRadius: 32,
                            borderCurve: 'continuous'
                        }}>

                        <Image
                            source={illus2}
                            style={{
                                height: 160,
                                width: 160,
                                resizeMode: 'contain',
                                marginHorizontal: 'auto',
                                borderRadius: 24,
                            }}
                        />
                        <ThemeText content={t('subscription.noSubscription')} fontFamily='MontserratExtraBold' variant='sm' style={{ marginHorizontal: 'auto' }} />

                    </LinearGradient>
                </View>
            </ScrollView>
        </ScreenView>
    )
}

export default MySubscription
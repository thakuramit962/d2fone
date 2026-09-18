import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import Header from '@/components/layout/navigation/Header'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import illus from '@/assets/lottie/notification-bell.json'

const MyNotifications = () => {

    const { t } = useTranslation()
    return (
        <ScreenView>
            <Header backIcon label={t('notifications.title')} withoutTopPadding />

            <View style={{
                flex: 1,
                alignItems: 'center',
            }}>
                <LottieView
                    source={illus}
                    speed={1}
                    autoPlay loop={false}
                    style={{
                        height: 140,
                        width: 140,
                    }}
                />
                <ThemeText content={t('notifications.empty.title')} fontFamily='MontserratSemiBold' variant='lg' />
                <ThemeText content={t('notifications.empty.description')} fontFamily='MontserratRegular' variant='xs' severity='secondary' style={{
                    textAlign: 'center',
                    marginTop: 8,
                    marginHorizontal: 16,
                }} />
            </View>
        </ScreenView>
    )
}

export default MyNotifications
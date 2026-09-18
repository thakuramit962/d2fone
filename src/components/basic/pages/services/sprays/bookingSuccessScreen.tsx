import BottomSheet from '@/components/basic/bottomSheet'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { dimensions } from '@/utils/app-helper'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'


const illus = require('@/assets/lottie/success-check.json')

const BookingSuccessScreen = (
    {
        callback,
        detail,
        visible,
    }: {
        callback: () => void
        detail: any
        visible: boolean
    }) => {

    const { t } = useTranslation()
    return (
        <BottomSheet
            visible={visible}
            height={dimensions.height * 0.8}
            onClose={callback}>
            <>
                <View
                    style={[
                        {
                            flex: 1,
                            paddingHorizontal: 24,
                            paddingTop: 32,
                            // justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                    accessibilityRole="summary"
                    accessibilityLabel={`Spray request submitted, reference ${detail?.request_id}`}
                >
                    <LottieView
                        source={illus}
                        speed={0.7}
                        autoPlay loop
                        style={{
                            height: 200,
                            width: 200,
                        }}
                    />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemeText content={t('bookSpray.successScreen.title')} variant="md" fontFamily='MontserratBold' />
                        <ThemeDivider size={24} />
                        <ThemeText
                            content={t('bookSpray.successScreen.message')}
                            severity="secondary"
                            variant='xs'
                            style={{ textAlign: 'center' }}
                        />
                        <ThemeText
                            content={`${detail?.request_id}`}
                            variant='xs' fontFamily='InterSemiBold'
                            style={{ textAlign: 'center' }}
                        />
                        <ThemeButton
                            label={t('bookSpray.successScreen.viewDetails')}
                            variant="sm"
                            style={{ width: 160, marginTop: 16 }}
                            onPress={callback}
                            accessibilityLabel="view"
                        />
                    </View>

                </View>
            </>
        </BottomSheet>
    )
}

export default BookingSuccessScreen
import CompanyFooter from '@/components/basic/companyFooter'
import ScreenView from '@/components/basic/containers/screenView'
import SprayBookingForm from '@/components/basic/pages/services/sprays/sprayBookingForm'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { useTranslation } from 'react-i18next'
import { ImageBackground, ScrollView } from 'react-native'

const illus = require('@/assets/images/static/droneIllus.png')

const BookSpray = () => {
    const scrollRef = useScrollToTop()
    const { t } = useTranslation()
    return (
        <ScreenView>
            <ScrollView ref={scrollRef}>

                <ImageBackground
                    source={illus}
                    imageStyle={{
                        resizeMode: 'cover',
                        borderRadius: 32,
                    }}
                    style={{
                        marginHorizontal: 4,
                        minHeight: 180,
                        paddingVertical: 4,
                        borderRadius: 32,
                        borderCurve: 'continuous',

                    }}>
                    <Header
                        withoutTopPadding
                        label={t('bookSpray.title')} labelSeverity='#fff'
                        description={t('bookSpray.description')}
                    />
                </ImageBackground>



                <ThemeDivider size={24} />

                <SprayBookingForm />
                <ThemeDivider size={120} />
                <CompanyFooter withoutBottomPadding />
            </ScrollView>
        </ScreenView>
    )
}

export default BookSpray
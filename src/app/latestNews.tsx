import ScreenView from '@/components/basic/containers/screenView'
import News from '@/components/basic/pages/news'
import Header from '@/components/layout/navigation/Header'
import { useTranslation } from 'react-i18next'

const LatestNews = () => {
    const { t } = useTranslation()
    return (
        <ScreenView>
            <Header withoutTopPadding
                label={t('latestNews.title')}
                description={t('latestNews.tagline')}
            />
            <News />
        </ScreenView>
    )
}

export default LatestNews
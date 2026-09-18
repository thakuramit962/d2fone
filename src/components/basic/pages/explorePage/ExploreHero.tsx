import ThemeDivider from '@/components/basic/ThemeDivider'
import ThemeText from '@/components/basic/text/ThemeText'
import { dimensions } from '@/utils/app-helper'
import { useTranslation } from 'react-i18next'
import { ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const illus = require('@/assets/images/static/farm.png')

const ExploreHero = () => {

    const { top } = useSafeAreaInsets()
    const { t } = useTranslation()

    return (
        <ImageBackground
            source={illus}
            resizeMode="cover"
            style={{
                height: 200,
                width: dimensions.width,
                padding: 24,
                justifyContent: 'flex-start',
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
            }}
        >
            <ThemeDivider size={top} />
            <ThemeText content={t('explore.title')} size={20} fontFamily='MontserratBold' severity='primary' />
            <ThemeText content={t('explore.tagline')} size={20} fontFamily='MontserratBold' severity='secondary' />
            <ThemeDivider size={28} />
            <ThemeText content={t('explore.description')} severity='secondary' />
        </ImageBackground>
    )
}

export default ExploreHero
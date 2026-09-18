import { useTheme } from '@/hooks/use-theme'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import ThemeText from './text/ThemeText'

const ComingSoonTag = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    return (
        <View style={{
            position: 'absolute',
            right: 8, top: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            paddingVertical: 2, paddingHorizontal: 8,
        }}>
            <ThemeText content={t('comingSoon')} size={9} color={theme.background.main} fontFamily='InterMedium' />
        </View>
    )
}

export default memo(ComingSoonTag)
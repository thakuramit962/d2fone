import { useTheme } from '@/hooks/use-theme'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { BackIcon, SupportIcon } from '../icons'
import ThemeText from './text/ThemeText'

const SupportCard = () => {

    const theme = useTheme()
    const bg = theme.text.primary
    const text = theme.background.main
    const { t } = useTranslation()

    return (
        <LinearGradient colors={[`${bg}90`, `${bg}`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.4, y: 1 }}
            style={{
                padding: 12,
                borderRadius: 18,
                borderCurve: 'continuous',
                flexDirection: 'row',
                gap: 8,
                minHeight: 70,
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: text,
            }}>
            <SupportIcon color={theme.background.slate} size={32} />
            <View style={{
                flex: 1,
                paddingLeft: 8
            }}>
                <ThemeText content={t('supportCard.title')} size={14} fontFamily='MontserratBold' color={text} />
                <ThemeText content={t('supportCard.tagline')} size={11} color={`${text}c3`} />
            </View>

            <Pressable
                onPress={() => router.navigate('/support')}
                style={{
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    backgroundColor: text,
                    minHeight: 32,
                    width: 110,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                }}>
                <ThemeText content={t('supportCard.button')} size={12} fontFamily='MontserratSemiBold' color={bg} />
                <BackIcon size={14} color={bg} style={{
                    transform: [
                        { scaleX: -1 }
                    ]
                }} />
            </Pressable>
        </LinearGradient>
    )
}

export default memo(SupportCard)
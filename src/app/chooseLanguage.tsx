import ScreenView from '@/components/basic/containers/screenView'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { CheckmarkCircleIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import useLanguage from '@/hooks/useLanguage'
import { RootState } from '@/store/store'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

const ChooseLanguage = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const appLanguage = useSelector(
        (state: RootState) => state?.appSlice?.language,
    );
    const { changeLanguage, languageOptions } = useLanguage();


    return (
        <ScreenView>
            <Header backIcon withoutTopPadding />
            <ScrollView
                contentContainerStyle={{
                    padding: 8,
                    gap: 2
                }}>
                <ThemeText content={t('languagePage.title')} fontFamily='MontserratSemiBold' variant='sm' />
                <ThemeText
                    content={t('languagePage.description')}
                    variant='xs'
                    color={theme?.text.secondary}
                />

                <ThemeDivider size={12} />

                {languageOptions.map((option) => (
                    <ModernDetailItem
                        key={option.id}
                        onPress={() => changeLanguage(option)}
                        isFirst={option.id === 1}
                        isLast={option.id === languageOptions.length}
                        single={languageOptions.length === 1}
                        listNumber={{
                            content: option.value,
                            severity: appLanguage === option.value ? 'success' : 'secondary',
                            fontFamily: 'MontserratBlack',
                            variant: 'sm',
                            style: {
                                backgroundColor: theme.background.main,
                                height: 38, width: 38, borderRadius: 14, borderCurve: 'continuous',
                                verticalAlign: 'middle', textAlign: 'center',
                            }
                        }}
                        description={{ content: option.label, variant: 'sm', severity: appLanguage === option.value ? 'success' : 'main' }}
                        actionIcon={appLanguage === option.value && <CheckmarkCircleIcon color={theme?.success} />}
                        iconSize={48}
                        bg={theme.background.slate}
                    />
                ))}

            </ScrollView>
        </ScreenView>
    )
}

export default ChooseLanguage

const lng = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
]
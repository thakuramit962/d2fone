import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { AiReportGradientIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { YIELD_PREDICTION_NOTE } from '@/utils/notes'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import NotesSection from '../../notesSection'
import { Result } from './yieldPredictiontypes'



const YieldPredictorResult = ({ data, onClose }: { data: Result | null, onClose: () => void; }) => {

    const theme = useTheme()
    const { t } = useTranslation()
    const notes = YIELD_PREDICTION_NOTE()
    return (
        <View style={{
            padding: 16,
            flex: 1,
            gap: 16,
        }}>
            <View style={{
                paddingHorizontal: 16,
            }}>
                <ThemeText content={`${t('yieldPredictor.yieldPredictorResult.title')} ___`} fontFamily='MontserratBold' variant='md' />
                <ThemeText content={`${t('yieldPredictor.yieldPredictorResult.description')}`} fontFamily='MontserratMediumItalic' severity='secondary' />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}
                style={{
                    borderWidth: 1,
                    padding: 16,
                    borderRadius: 24,
                    borderCurve: 'continuous',
                    borderColor: `${theme.text.primary}25`,
                }}>
                <ThemeDivider size={32} />
                <AiReportGradientIcon size={100} style={{ marginHorizontal: 'auto' }} />
                <ThemeDivider size={48} />
                <View style={{
                    padding: 24,
                    backgroundColor: `${data?.status == 'error' ? theme.error : theme.info}15`,
                    borderCurve: 'continuous',
                    borderRadius: 24,
                    alignItems: 'center',
                }}>
                    {data?.status == 'error' &&
                        <>
                            <ThemeText content={'Oops!'}
                                size={34} severity='error'
                                fontFamily='InterBold' />
                            <ThemeDivider size={32} />
                            <ThemeText content={`${data?.msg}`} variant='xs'
                                fontFamily='MontserratMedium' severity='error' style={{ textAlign: 'center' }} />
                        </>
                    }
                    {data?.status == 'success' &&
                        <>
                            <ThemeText
                                size={34}
                                fontFamily='InterBold'
                                content={`~${String(((data?.total_expected_yield?.min + data?.total_expected_yield?.max) / 2).toFixed(0))}`} />
                            <ThemeText content={`${String(data?.total_expected_yield?.unit)}`} variant='xs' />
                            <ThemeDivider size={24} />
                            {data?.status == 'success' &&
                                <>
                                    <ThemeText content={`${data?.yield_expectation?.label}`} fontFamily='MontserratMediumItalic' variant='xs' />
                                </>
                            }
                        </>
                    }
                </View>
                {data?.status == 'success' &&
                    <NotesSection NOTES={notes} />
                }

            </ScrollView>
            <View style={{
                marginVertical: 16,
                width: 160,
                marginHorizontal: 'auto'
            }}>
                <ThemeButton label={t('yieldPredictor.yieldPredictorResult.done')} variant='sm' onPress={onClose} />
            </View>
        </View>
    )
}


export default YieldPredictorResult



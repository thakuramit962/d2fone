import BottomSheet from '@/components/basic/bottomSheet'
import { SprayCalculation } from '@/components/basic/pages/sprayCalculator/types'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { AiReportGradientIcon, AlertIcon, ChemicalIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import { SPRAY_CALCULATOR_NOTE } from '@/utils/notes'
import { memo } from 'react'
import { ScrollView, View } from 'react-native'
import ModernDetailItem from '../../modernDetailItem'
import NotesSection from '../../notesSection'
import DetailLine from '../../text/detailLine'


const SprayCalculationResult = ({ data, onClose }: { data: SprayCalculation | null, onClose: () => void; }) => {
    const theme = useTheme()
    return (
        <BottomSheet
            visible={Boolean(data)}
            onClose={onClose}
            height={dimensions.height * 0.85}
        >

            <View style={{
                padding: 16,
                flex: 1,
                gap: 16,
            }}>
                <View style={{
                    paddingHorizontal: 16,
                }}>
                    <ThemeText content={'Amount Required ___'} fontFamily='MontserratBold' variant='md' />
                    <ThemeText content={'Recommended amount of chemical required for spray'} fontFamily='MontserratMediumItalic' severity='secondary' />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}
                    style={{
                        borderWidth: 1,
                        padding: 16,
                        borderRadius: 24,
                        borderCurve: 'continuous',
                        borderColor: `${theme.text.primary}25`,
                    }}>
                    {data?.status == 'error'
                        ? <AlertIcon size={100} style={{ marginHorizontal: 'auto' }} color={theme.error} />
                        : <AiReportGradientIcon size={100} style={{ marginHorizontal: 'auto' }} color1={'#c8af89'} color2={'#ab652b'} color3={'#e6b780'} />
                    }
                    <ThemeDivider size={24} />
                    <View style={{
                        padding: 24,
                        backgroundColor: `${data?.status == 'error' ? theme.error : theme.warning}15`,
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
                                <DetailLine
                                    label={{ content: 'Spray Type', variant: 'xs' }}
                                    description={{ content: data?.spray_type, fontFamily: 'MontserratMedium', variant: 'xs' }}
                                />
                                <DetailLine
                                    label={{ content: 'Total Area for spray', variant: 'xs' }}
                                    description={{ content: `${data?.field_size} Acres`, fontFamily: 'MontserratMedium', variant: 'xs' }}
                                />
                                <DetailLine
                                    label={{ content: 'Water Required', variant: 'xs' }}
                                    description={{ content: `${Number(data?.total_water_required)?.toFixed(2)} ltr`, fontFamily: 'MontserratMedium', variant: 'xs' }}
                                />
                                <DetailLine
                                    label={{ content: 'Chemical Required', variant: 'xs' }}
                                    description={{ content: `${Number(data?.total_chemical_required)?.toFixed(2)} ml`, fontFamily: 'MontserratMedium', variant: 'xs' }}
                                />
                                <ThemeDivider size={32} />
                                <ThemeText
                                    size={34}
                                    fontFamily='InterBold' severity='warning'
                                    content={`${String(data?.chemical_per_tank)} / Tank`} />
                                <ThemeDivider size={24} />

                                <NotesSection
                                    NOTES={SPRAY_CALCULATOR_NOTE()}
                                />
                            </>
                        }


                        {(data?.status == 'success' && data.similar_products?.length)
                            &&
                            <>
                                <ThemeText content={'Similer Chemicals ___'} fontFamily='MontserratBlackItalic' severity='info' variant='xs' style={{ alignSelf: "flex-start" }} />
                                <View style={{ gap: 2, alignSelf: 'stretch' }}>
                                    {data.similar_products?.map((el, i) => (
                                        <ModernDetailItem
                                            key={i}
                                            bg={theme.background.main}
                                            isFirst={i == 0}
                                            isLast={(i + 1) == data?.similar_products?.length}
                                            single={data?.similar_products?.length == 1}
                                            icon={ChemicalIcon}
                                        >
                                            <ThemeText content={el.chemical} fontFamily='MontserratSemiBold' variant='xs' />
                                            <ThemeText content={el.company_name} severity='secondary' />
                                            <ThemeText content={`Just ${String(el.base_dose)}ml per acre`} severity='info' />
                                        </ModernDetailItem>
                                    ))}
                                </View>
                                <ThemeDivider size={32} />

                            </>
                        }

                    </View>

                </ScrollView>
                <View style={{
                    marginVertical: 16,
                    width: 160,
                    marginHorizontal: 'auto'
                }}>
                    <ThemeButton label='Done' variant='sm' onPress={onClose} />
                </View>
            </View>
        </BottomSheet>

    )
}


export default memo(SprayCalculationResult)
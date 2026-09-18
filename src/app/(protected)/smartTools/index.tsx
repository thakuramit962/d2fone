import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import useAppText from '@/hooks/useAppText'
import { Href, router } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'


const SmartTools = () => {
    const theme = useTheme()
    const { explore } = useAppText()
    const {
        fertilizerCalculator,
        mandiRate,
        sprayCalculator,
        weatherForecast,
        yieldPredictor,
    } = explore
    return (
        <ScreenView>
            <Header label={'Smart Tools'} withoutTopPadding />

            <ScrollView>

                <View style={{ gap: 8, paddingHorizontal: 8, }}>
                    {[yieldPredictor, sprayCalculator, fertilizerCalculator, mandiRate, weatherForecast].map((item, i) => (
                        <Pressable
                            key={i}
                            onPress={() => router.navigate(item?.link as Href)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                borderRadius: 24,
                                padding: 8,
                                backgroundColor: theme.background.slate,
                                borderCurve: 'continuous'
                            }}
                        >
                            <View style={{
                                borderRadius: 16,
                                padding: 12,
                                backgroundColor: theme.background.main,
                                borderCurve: 'continuous'
                            }}>
                                <Image
                                    source={item.img}
                                    style={{
                                        height: 56,
                                        width: 56,
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, alignSelf: 'flex-start', paddingTop: 8, }}>
                                <ThemeText
                                    content={item.title}
                                    fontFamily="MontserratSemiBold"
                                    variant='xs'
                                />
                                <ThemeText
                                    content={item?.description ?? " "}
                                    variant='xxs'
                                    severity='secondary'
                                />
                            </View>


                        </Pressable>

                    ))}
                </View>

            </ScrollView>
        </ScreenView>
    )
}

export default SmartTools



const styles = StyleSheet.create({
    imageCardRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },

})
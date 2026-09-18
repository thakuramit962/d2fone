import ThemeText from "@/components/basic/text/ThemeText"
import { useTheme } from "@/hooks/use-theme"
import { useGlobalStyle } from "@/hooks/useGlobalStyle"
import { dimensions } from "@/utils/app-helper"
import LottieView from "lottie-react-native"
import { Image, Linking, TouchableOpacity, View } from "react-native"


const DeliveredDetails = ({ details }: { details: any }) => {

    const theme = useTheme()
    const globalStyle = useGlobalStyle()

    return (
        details.key === 'delivered' && (
            <View style={{
                paddingVertical: 16,
            }}>
                <LottieView
                    source={require('@/assets/lottie/check1.json')}
                    autoPlay
                    loop={false}
                    style={{
                        height: dimensions.width * 0.15,
                        width: dimensions.width * 0.15,
                        alignSelf: 'center'
                    }}
                />
                {+details?.refundAmount > 0 &&
                    <View style={[{ gap: 4 }]}>
                        <ThemeText content={'Refund Signature'} fontFamily='MontserratMedium' severity='secondary' />
                        <View style={[globalStyle.rowCenter]}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => Linking.openURL(details?.refundSignature)}>
                                    <Image
                                        source={{ uri: details?.refundSignature }}
                                        style={{
                                            height: 100,
                                            flex: 1,
                                            borderRadius: 12,
                                            backgroundColor: theme?.background.main
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </View>

        )
    )
}


export default DeliveredDetails
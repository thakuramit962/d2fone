import { useTheme } from "@/hooks/use-theme"
import { dimensions } from "@/utils/app-helper"
import { View } from "react-native"
import ThemeText from "../text/ThemeText"
import ThemeButton from "../ThemeButton"
import ThemeDivider from "../ThemeDivider"



const EmptyData = ({
    title = 'No Data Found',
    message = 'No data found for request. Please try again.',
    callback
}: {
    title?: string,
    message?: string,
    callback?: {
        action?: () => void,
        label: string
    }
}) => {

    const theme = useTheme()

    return (
        <View style={{
            margin: 'auto',
            paddingVertical: 16,
        }}>
            <ThemeText
                content={title}
                variant="md"
                style={{
                    fontFamily: 'MontserratSemiBold',
                    textAlign: 'center',
                }}
            />
            <ThemeText
                content={message}
                variant="xs"
                style={{
                    textAlign: 'center',

                }}
            />
            <ThemeDivider size={32} />
            {callback &&
                <ThemeButton
                    onPress={() => callback?.action?.()}
                    label={callback?.label ?? ''}
                    variant='sm'
                    bgColor={theme?.text.primary}
                    textStyle={{
                        color: theme?.background.main
                    }}
                    style={{
                        width: dimensions.width * 0.75 > 180 ? 180 : dimensions.width * 0.75,
                        alignSelf: 'center',
                    }} />
            }

        </View>
    )
}


export default EmptyData
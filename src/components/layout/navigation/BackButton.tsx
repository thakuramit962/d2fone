import { useTheme } from '@/hooks/use-theme'
import { runHaptics } from '@/utils/app-helper'
import { router } from 'expo-router'
import { Pressable, PressableProps } from 'react-native'
import Svg, { Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg'



interface BackButtonProps extends PressableProps {
    size?: number
    onPress?: () => void,
}


const BackButton = ({ size = 32, onPress }: BackButtonProps) => {

    const theme = useTheme()

    return (
        <Pressable
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 32,
                width: 32,
            }}
            onPress={() => {
                runHaptics()
                onPress ? onPress() : router.canGoBack() ? router.back() : router.navigate('/tabs/home')
            }}        >
            <Svg
                width={32}
                height={32}
                viewBox="0 0 32 32"
            >
                {/* Background with rounded corners */}
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="50%"
                        cy="50%"
                        rx="70%"
                        ry="70%"
                        fx="50%"
                        fy="50%"
                    >
                        <Stop
                            offset="25%"
                            stopColor={`${theme.background.slate}`}
                            stopOpacity="1"
                        />
                        <Stop
                            offset="100%"
                            stopColor={`${theme.text.primary}`}
                            stopOpacity="0.1"
                        />
                    </RadialGradient>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    width="32"
                    height="32"
                    rx="12" // rounded corners
                    ry="12"
                    fill="url(#grad)"
                />

                {/* Centered Arrow */}
                <G transform="translate(8,8)">
                    <Path
                        d="M1.25 6.75H14.75"
                        stroke={theme.text.primary}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <Path
                        d="M6.75 12.75C6.75 12.75 0.75 8.33 0.75 6.75C0.75 5.17 6.75 0.75 6.75 0.75"
                        stroke={theme.text.primary}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </G>
            </Svg>
        </Pressable>
    )
}

export default BackButton
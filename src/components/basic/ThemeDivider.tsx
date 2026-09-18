import { View } from 'react-native'


interface ThemeDividerProps {
    size?: number
}

const ThemeDivider = ({ size = 8 }: ThemeDividerProps) => {
    return (
        <View style={{
            height: size,
            width: size
        }} />
    )
}

export default ThemeDivider
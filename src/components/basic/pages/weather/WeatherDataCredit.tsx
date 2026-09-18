import { memo } from 'react'
import { View } from 'react-native'
import ThemeText from '../../text/ThemeText'

const WeatherDataCredit = () => {
    return (
        <View style={{
            height: 200,
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <ThemeText content={'Data provided by'} severity='disabled' />
            <ThemeText content={'Weather API'} fontFamily='MontserratBlack' severity='disabled' variant='xs' />
        </View>
    )
}

export default memo(WeatherDataCredit)
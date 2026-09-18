import { GearIcon } from '@/components/icons'
import { View } from 'react-native'
import ThemeText from '../text/ThemeText'

const LoadingScreen = ({ minHeight }: { minHeight?: number }) => {
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: minHeight || 0,
        }}>
            <GearIcon height={160} width={160} style={{ opacity: 0.4 }} />
            <ThemeText severity='secondary' content={'Processing view...'} variant='sm' fontFamily='InterMediumItalic' />
            <ThemeText severity='disabled' content={'Generating content for the requested view.'} fontFamily='MontserratRegular' />
        </View>
    )
}

export default LoadingScreen
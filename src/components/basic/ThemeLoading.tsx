import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { RootState } from '@/store/store'
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import ThemeText from './text/ThemeText'

const ThemeLoading = () => {
    const theme = useTheme()
    const globalStyle = useGlobalStyle()
    const loading = useSelector((state: RootState) => state.processingState.working);

    return (
        loading
            ? <Modal
                animationType="fade"
                visible={loading}
                transparent={true}
                statusBarTranslucent={true}
                presentationStyle="overFullScreen"
            >
                <View style={styles.backdrop}>
                    <View style={[globalStyle.flexCenter, styles.loaderBox]}>
                        <ActivityIndicator size="large" color={theme?.warning} />
                        <ThemeText content={'Processing...'} color='#ffffff' />
                    </View>
                </View>
            </Modal>
            : null
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // use this instead of backdropColor prop
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBox: {
        // don't use pointerEvents here
        padding: 20,
        borderRadius: 12,
    }
})

export default ThemeLoading
import ScreenView from '@/components/basic/containers/screenView'
import Header from '@/components/layout/navigation/Header'
import { SERVER_URL } from '@/constants/appConstant'
import { router } from 'expo-router'
import WebView from 'react-native-webview'

const Policies = () => {
    return (
        <ScreenView>
            <Header
                withoutTopPadding
                label="D2F One – Privacy Policy"
                backIcon
                backAction={() =>
                    router.canGoBack()
                        ? router.back()
                        : router.navigate('/tabs/home')
                }
            />

            <WebView textZoom={200} style={{ flex: 1, marginHorizontal: 8 }} source={{ uri: `${SERVER_URL}/privacy-policy.html` }} />

        </ScreenView>
    )
}

export default Policies

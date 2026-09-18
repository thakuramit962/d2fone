import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import Header from '@/components/layout/navigation/Header'
import { SERVER_URL } from '@/constants/appConstant'
import { dimensions } from '@/utils/app-helper'
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native'

const Rewards = () => {
    return (
        <ScreenView>
            <Header withoutTopPadding
                bottomSlot={
                    <View style={styles.headerSlot}>
                        <ThemeText content={'REWARDS'} fontFamily="MontserratBold" variant="sm" />
                        <ThemeText
                            content={'OFFERS'}
                            severity="main"
                            style={styles.letterSpacing}
                            fontFamily="MontserratMedium"
                        />
                    </View>
                } />
            <ScrollView
                maximumZoomScale={4}
                minimumZoomScale={1}
                bouncesZoom={true}
                pinchGestureEnabled={true} // Android
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    source={require('@/assets/images/static/rewards/rewards-banner.png')}
                    imageStyle={{ resizeMode: 'contain' }}
                    style={{
                        width: dimensions.width,
                        height: 200
                    }}
                />

                <Image
                    source={{ uri: `${SERVER_URL}/assets/AW%20Farmer%20Incentive%20Policy%201_page-0001.jpg` }}
                    style={{
                        width: dimensions.width,
                        aspectRatio: 9 / 12,
                        borderRadius: 24,
                    }}
                    resizeMode="contain"
                />
            </ScrollView>
        </ScreenView>
    )
}

export default Rewards

const styles = StyleSheet.create({
    headerSlot: {
        alignItems: 'center',
        marginTop: -42,
        marginHorizontal: 42,
    },
    letterSpacing: {
        letterSpacing: 5,
    },
})
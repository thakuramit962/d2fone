import ScreenView from '@/components/basic/containers/screenView'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import Header from '@/components/layout/navigation/Header'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const ComingSoon = () => {
    const handleBack = () => {
        router.canGoBack() ? router.back() : router.navigate('/tabs/home')
    }

    return (
        <ScreenView>
            <Header withoutTopPadding />
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/static/workingOnIt.png')}
                    style={styles.image}
                />

                <View style={styles.textContainer}>
                    <ThemeText
                        content="Coming Soon"
                        fontFamily="MontserratBlack"
                        variant="md"
                    />
                    <ThemeText
                        content="We're working on this module and it will be available soon."
                        style={styles.subtitle}
                    />
                </View>

                <ActionText
                    label="Go Back"
                    onPress={handleBack}
                />
            </View>
        </ScreenView>
    )
}

export default React.memo(ComingSoon)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 72,
        paddingHorizontal: 24,
    },
    image: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.75,
        maxWidth: 280,
    },
})
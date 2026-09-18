import { ArrowRightIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Image, ImageBackground, View } from 'react-native'
import ThemeText from '../../text/ThemeText'
import ThemeButton from '../../ThemeButton'
import ThemeDivider from '../../ThemeDivider'

const MandiBhaavCta = () => {

    const theme = useTheme()

    return (

        <ImageBackground
            style={{
                height: 200,
                borderRadius: 24,
                overflow: 'hidden'

            }}
            source={{ uri: 'https://images.cdn-files-a.com/uploads/9374304/800_gi-6677ea2637d1a.jpg' }}
        >
            <LinearGradient
                colors={['#fffab9', '#ffdd0010']}
                // colors={['#ffdd00', '#ffdd0010']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    height: 200,
                    borderRadius: 24,
                    padding: 16,
                    alignItems: 'flex-start',
                    position: 'relative',
                    overflow: 'hidden',
                    justifyContent: 'center'

                }}>
                <ThemeText
                    style={{
                        backgroundColor: `${theme?.success}`,
                        paddingRight: 12, paddingLeft: 12, paddingVertical: 2, borderRadius: 12,

                    }}
                    content={'Live'} fontFamily='MontserratSemiBold' variant='xs'
                    color={theme?.brand_cream}
                />
                <View style={{ flex: 1, maxWidth: 200 }}>
                    <ThemeText content={'Mandi Bhaav'} fontFamily='MontserratBlack'
                        color={'#094937'}
                        style={{
                            fontSize: 24,
                        }} />
                    <ThemeText content={'Live rates from nearest Mandis'} variant='sm' fontFamily='InterSemiBold' color='#000' />
                    <ThemeDivider size={32} />
                    <ThemeButton
                        label='Check Now'
                        bgColor={'#094937'}
                        textStyle={{ color: '#fff' }}
                        variant='sm'
                        buttonStyle={{ width: 140 }}
                        icon={ArrowRightIcon}
                        iconColor='#fff'
                        onPress={() => router.push('/mandiRate')}
                    />
                </View>

                <Image
                    source={{ uri: 'https://indiashippingnews.com/wp-content/uploads/2023/12/Agricultural-Exports_Featured-Image.jpg' }}
                    style={{
                        height: 300,
                        width: 300,
                        borderRadius: 100,
                        resizeMode: 'repeat',
                        borderWidth: 6,
                        borderColor: '#504714',
                        position: 'absolute',
                        top: -48, right: -120,
                        transform: [
                            { rotate: '25deg' }
                        ]

                    }} />

            </LinearGradient>
        </ImageBackground>

    )
}

export default MandiBhaavCta
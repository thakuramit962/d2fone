// import { AlertIcon, CheckmarkCircleIcon, LoadingJarIcon } from '@/components/icons/Icons'
import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import { AlertIcon, CheckmarkCircleIcon, LoadingJarIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { APP_VERSION } from '@/constants/appConstant'
import useAppVersion from '@/hooks/use-appVersion'
import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import React from 'react'
import { Linking, Platform, View } from 'react-native'

const CheckUpdate = () => {

    const theme = useTheme()
    const { checkUpdate, checking, version } = useAppVersion()

    const playStoreUrl = Platform.OS == 'android'
        ? `https://play.google.com/store/apps/details?id=${`com.bestbringer1.agriwings`}`
        : Platform.OS == 'ios'
            ? `https://apps.apple.com/in/app/agriwings/id6746158179`
            : ''

    const updateAvailable = +version?.replaceAll('.', '') > +APP_VERSION?.replaceAll('.', '')

    React.useEffect(() => {
        checkUpdate()
    }, [])

    return (
        <ScreenView edges={['bottom', 'left', 'right']}>
            <Header label='App Details' />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    {
                        checking
                            ? <LoadingJarIcon color={`${theme?.info}20`} height={150} width={150} />
                            : updateAvailable
                                ? <AlertIcon color={theme?.warning} height={150} width={150} />
                                : <CheckmarkCircleIcon color={theme?.success} height={150} width={150} />
                    }
                    <ThemeText content={'AGRIWINGS'} fontFamily='MontserratBlack' style={{
                        fontSize: dimensions.width * 0.1 > 48 ? 48 : dimensions.width * 0.1,
                        color: theme?.primary
                    }} />
                    <ThemeText content={`App Version - ${APP_VERSION}`} variant='sm' fontFamily='MontserratSemiBold' severity='disabled' />
                </View>


                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 24
                }}>
                    {
                        !updateAvailable
                            ? <ThemeText variant='sm' content={`You're all set! Your app is up to date.`} />
                            : <ThemeText content={`New version available!\nUpdate now for the best experience.`} style={{ textAlign: 'center' }} />
                    }

                    {
                        !updateAvailable
                        && <ThemeText content={`Available Version - ${version}`} variant='sm' fontFamily='MontserratSemiBold' />
                    }
                    <ThemeButton
                        label={updateAvailable ? 'Update' : 'Check Update'}
                        loading={checking}
                        loadingText='checking...'
                        style={{
                            width: dimensions.width * 0.7 > 300 ? 300 : dimensions.width * 0.7
                        }}
                        onPress={() => {
                            if (updateAvailable) {
                                Linking.openURL(playStoreUrl)
                            } else {
                                checkUpdate()
                            }
                        }}
                    />
                </View>
            </View>
        </ScreenView>

    )
}

export default CheckUpdate
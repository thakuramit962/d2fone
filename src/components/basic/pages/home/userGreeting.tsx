import { useTheme } from '@/hooks/use-theme'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useSelector } from 'react-redux'
import ActionText from '../../text/ActionText'
import ThemeText from '../../text/ThemeText'

const UserGreeting = () => {
    const theme = useTheme()
    const user = useSelector((state: RootState) => state.auth)
    const isLoggedIn = user?.isLoggedIn || false

    const { t } = useTranslation()

    const getGreeting = useCallback(() => {
        const hour = dayjs().hour()

        if (hour < 12) return t('userGreeting.greeting.morning')
        if (hour < 17) return t('userGreeting.greeting.afternoon')
        if (hour < 21) return t('userGreeting.greeting.evening')
        return t('userGreeting.greeting.night')
    }, [t])

    const [greeting, setGreeting] = useState(getGreeting())

    useEffect(() => {
        // sync immediately in case `getGreeting` changed (e.g. language switch)
        setGreeting(getGreeting())

        const interval = setInterval(() => {
            setGreeting(getGreeting())
        }, 60 * 1000)

        return () => clearInterval(interval)
    }, [getGreeting])

    return (
        <Pressable
            onPress={() => isLoggedIn && router.navigate('/tabs/profile')}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}>
            <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <Path
                    stroke="currentColor" strokeWidth={'1.5'} strokeLinecap="round" strokeLinejoin="round"
                    d="M20.8852 13.4277C20.8852 10.5447 18.548 8.20748 15.665 8.20748C12.7819 8.20748 10.4447 10.5447 10.4447 13.4277C10.4447 16.3108 12.7819 18.648 15.665 18.648C18.548 18.648 20.8852 16.3108 20.8852 13.4277Z" />
                <Path
                    fill={isLoggedIn ? theme?.success : theme?.error}
                    d="M30.58 4.47875C30.58 2.41942 28.9106 0.75 26.8512 0.75C24.7919 0.75 23.1225 2.41942 23.1225 4.47875C23.1225 6.53808 24.7919 8.2075 26.8512 8.2075C28.9106 8.2075 30.58 6.53808 30.58 4.47875Z" />
                <Path
                    stroke="currentColor" strokeWidth={'1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.3}
                    d="M18.648 1.04836C17.6842 0.852705 16.6865 0.75 15.665 0.75C7.42767 0.75 0.75 7.42767 0.75 15.665C0.75 23.9023 7.42767 30.58 15.665 30.58C23.9023 30.58 30.58 23.9023 30.58 15.665C30.58 14.6435 30.4772 13.6458 30.2817 12.682" />
                <Path
                    stroke="currentColor" strokeWidth={'1.5'} strokeLinecap="round" strokeLinejoin="round"
                    d="M24.6139 27.597C24.6139 22.6546 20.6073 18.648 15.6649 18.648C10.7225 18.648 6.71594 22.6546 6.71594 27.597" />
            </Svg>

            <View style={{ gap: 2 }}>
                <ThemeText content={greeting} size={10} style={{ lineHeight: 12 }} fontFamily="MontserratMediumItalic" />
                {isLoggedIn ? (
                    <ThemeText
                        content={user?.currentUser?.name ?? t('userGreeting.fallbackName')}
                        size={16}
                        style={{ lineHeight: 16 }}
                        fontFamily="MontserratExtraBold"
                    />
                ) : (
                    <ActionText label={t('userGreeting.loginSignup')} withIcon={false} action={() => router.navigate('/login')} />
                )}
            </View>
        </Pressable>
    )
}

export default memo(UserGreeting)
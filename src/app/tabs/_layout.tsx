import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ChaupalIcon, ExploreIcon, HomeIcon, ProfileIcon } from '../../components/icons'
import { TabsLayout } from '../../components/layout/navigation/TabsLayout'
import { useTheme } from '../../hooks/use-theme'
import { RootState } from '../../store/store'



const TabsMenu = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const { isLoggedIn } = useSelector((state: RootState) => state?.auth)


    return (
        <TabsLayout
            initialRouteName="home"
            theme={theme}
            screens={[
                {
                    name: 'home',
                    label: t('menus.home'),
                    icon: ({ focused }) => (
                        <HomeIcon
                            strokeWidth={focused ? 1.5 : 1.25}
                            color={focused ? theme?.primary : theme?.text.primary}
                        />
                    ),
                    badge: null,
                    options: {
                    }

                },
                {
                    name: 'chaupal',
                    label: t('menus.chaupal'),
                    icon: ({ focused }) => (
                        <ChaupalIcon
                            strokeWidth={focused ? 1.5 : 1.25}
                            color={focused ? theme?.primary : theme?.text.primary}
                        />
                    ),
                    badge: null,
                    options: {
                        tabBarStyle: {
                            display: 'none',

                        },

                    }
                },
                {
                    name: 'explore',
                    label: t('menus.explore'),
                    icon: ({ focused }) => (
                        <ExploreIcon
                            strokeWidth={focused ? 1.5 : 1.25}
                            color={focused ? theme?.primary : theme?.text.primary}
                        />
                    ),
                },
                {
                    name: 'profile',
                    label: t('menus.profile'),
                    icon: ({ focused }) => (
                        <ProfileIcon
                            strokeWidth={focused ? 1.5 : 1.25}
                            color={focused ? theme.primary : theme.text.primary}
                        />
                    ),
                    listener: () => {
                        if (!isLoggedIn) {
                            router.push('/(auth)/login');
                        }
                    },
                }
            ]}
        />
    )
}

export default TabsMenu
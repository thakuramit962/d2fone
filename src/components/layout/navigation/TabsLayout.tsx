import { Tabs } from 'expo-router'
import type { JSX } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeText from '../../basic/text/ThemeText'


const ANIMATION_DURATION = 250
const VISIBLE = 1
const HIDDEN = 0



type ScreenConfig = {
    name: string;
    label: string;
    icon: (props: any) => JSX.Element;
    badge?: string | number | null;
    lazy?: boolean;
    // listener?: () => void;
    listener?: (e: any) => void;
    getId?: () => string | undefined; // for dynamic route IDs
    initialParams?: Record<string, any>; // for default params
    redirect?: boolean; // to redirect to another route
    options?: any
};

type AnimatedTabsLayoutProps = {
    initialRouteName: string
    screens: ScreenConfig[]
    theme: any
    onTabFocus?: (screenName: string) => void
}

export const TabsLayout: React.FC<AnimatedTabsLayoutProps> = ({
    initialRouteName,
    screens,
    theme,
    onTabFocus
}) => {
    const tabBarAnim = useRef(new Animated.Value(VISIBLE)).current
    const { bottom } = useSafeAreaInsets()
    const tabBarHeight = 64 + bottom + 4
    const isVisible = true // replace this with actual logic to determine visibility
    const animateTabBar = useCallback(
        (toValue: number) => {
            Animated.timing(tabBarAnim, {
                toValue,
                duration: ANIMATION_DURATION,
                easing: Easing.ease,
                useNativeDriver: true
            }).start()
        },
        [tabBarAnim]
    )

    useEffect(() => {
        animateTabBar(isVisible ? VISIBLE : HIDDEN)
    }, [isVisible, animateTabBar])

    return (
        <Tabs
            initialRouteName={initialRouteName}
            backBehavior='history'
            screenOptions={{
                animation: 'shift',
                headerShown: false,
                tabBarHideOnKeyboard: true,

                popToTopOnBlur: false,
                tabBarAllowFontScaling: true,
                tabBarStyle: {
                    height: tabBarHeight,
                    backgroundColor: theme?.background.main,
                    justifyContent: 'space-around',
                    width: '100%',
                    alignSelf: 'center',
                    paddingBottom: bottom + 4,
                    paddingTop: 6,
                    opacity: tabBarAnim,
                    elevation: 0,
                    borderWidth: 0,
                    borderTopWidth: 0.5,
                    borderTopColor: `#747373`,
                    marginBottom: 0,
                    bottom: 0,
                    position: 'absolute',
                },
                tabBarBadgeStyle: {
                    backgroundColor: `${theme?.background.main}`,
                    top: -6,
                    left: 22,
                    color: theme?.background.main,
                    fontSize: 8,
                    minWidth: 24,
                    fontFamily: 'MontserratMedium',
                    textAlign: 'center'
                },

            }}

            screenListeners={{
                focus: (e) => {
                    if (onTabFocus) {
                        onTabFocus(e.target as string)
                    }
                }
            }}
        >
            {
                screens.map((screen) => (
                    <Tabs.Screen
                        key={screen.name}
                        name={screen.name}
                        options={{
                            animation: 'shift',
                            lazy: screen.lazy ?? true,
                            tabBarIcon: screen.icon,

                            tabBarBadge: screen.badge ?? undefined,
                            sceneStyle: {
                                backgroundColor: theme.background.main,
                            },
                            tabBarLabel: ({ focused }) => (
                                <ThemeText
                                    content={`${screen.label}`}
                                    // variant='xxs'
                                    size={12}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                    fontFamily={focused ? 'MontserratSemiBold' : 'MontserratMedium'}
                                    style={{
                                        textAlign: 'center',
                                        marginTop: 2,
                                        fontWeight: focused ? '600' : '500',
                                        color: focused ? theme?.primary : theme?.text.primary,
                                        width: '100%',
                                    }}
                                />
                            ),
                            ...screen.options
                        }}
                        listeners={screen.listener ? { tabPress: screen.listener } : undefined}
                        getId={screen.getId}
                        initialParams={screen.initialParams}
                        redirect={screen.redirect}
                    />
                ))
            }
        </Tabs >
    )
}

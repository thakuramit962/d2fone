import ScreenView from '@/components/basic/containers/screenView'
import Skelton from '@/components/basic/Skelton'
import DetailLine from '@/components/basic/text/detailLine'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ArrowRightIcon, EditIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { useUser } from '@/hooks/useUser'
import { RootState } from '@/store/store'
import { camelCaseWords, copyData, dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import { lazy, memo, Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import CompanyFooter from '../../companyFooter'
import ProfileAvatar from './profileAvatar'

const MyCoins = lazy(() => import('@/components/basic/user/myCoins'))


type MenuItemProps = {
    label: string
    onPress?: () => void
    showDivider?: boolean
    dividerColor: string
    textColor?: string
    iconColor?: string
}

const MenuItem = memo(({ label, onPress, showDivider, dividerColor, iconColor, textColor }: MenuItemProps) => (
    <>
        <Pressable
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                alignSelf: 'stretch' as const,
            }}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <ThemeText content={label} fontFamily="MontserratMedium" size={14} color={textColor} />
            <ArrowRightIcon color={iconColor} />
        </Pressable>
        {showDivider && (
            <View
                style={{
                    height: 1,
                    backgroundColor: dividerColor,
                    marginHorizontal: -8,
                }}
            />
        )}
    </>
))


const ProfilePage = () => {

    const theme = useTheme()
    const globalStyle = useGlobalStyle()
    const scrollRef = useScrollToTop()

    const user = useSelector((state: RootState) => state?.auth)
    const { logout, fetchUser, isFetchingUser } = useUser()
    const { t } = useTranslation()

    const { userDetails, isVerified, borderColor, secondaryTextColor, dividerColor } = useMemo(() => {
        const details = user?.currentUser
        const verified = details?.farmerDetails?.is_verified === '1'
        const border = `${theme?.text?.primary}25`
        const secondary = `${theme?.text?.primary}ba`

        return {
            userDetails: details,
            isVerified: verified,
            borderColor: border,
            secondaryTextColor: secondary,
            dividerColor: border,
        }
    }, [user?.currentUser, theme?.text?.primary])

    const scrollContentStyle = useMemo(() => ({ gap: 16 }), [])

    const profileBoxStyle = useMemo(() => [
        style.borderedBox,
        globalStyle.flexCenter,
        {
            minHeight: dimensions.height * 0.3,
            borderColor,
            paddingBottom: 52
        },
    ], [globalStyle.flexCenter, borderColor])

    const menuBoxStyle = useMemo(() => [
        style.borderedBox,
        {
            borderColor,
            paddingHorizontal: 32,
            gap: 6,
        },
    ], [borderColor])

    const detailsBoxStyle = useMemo(() => ({
        gap: 6,
        marginHorizontal: 'auto' as const,
        width: 320,
        padding: 8,
    }), [])

    const dividerStyle = useMemo(() => ({
        height: 1,
        backgroundColor: dividerColor,
        marginHorizontal: -8,
    }), [dividerColor])

    const handleYourLocation = useCallback(() => { router.navigate('/myLocation') }, [])
    const handleYourFarms = useCallback(() => { router.navigate('/myFarms') }, [])
    const handleSprays = useCallback(() => { router.navigate('/sprays/mySprays') }, [])
    const handleSubscriptions = useCallback(() => { router.navigate('/mySubscription') }, [])
    const handleManageAccount = useCallback(() => { router.navigate('/manageAccount') }, [])
    const handleAboutUs = useCallback(() => { router.navigate('/aboutUs') }, [])
    const handleContactUs = useCallback(() => { router.navigate('/support') }, [])
    const handlePrivacyPolicy = useCallback(() => { router.navigate('/policies') }, [])
    const handlePermissions = useCallback(() => { router.navigate('/appPermissions') }, [])
    const handleLanguage = useCallback(() => { router.navigate('/chooseLanguage') }, [])
    const handleCommunityPosts = useCallback(() => { router.navigate('/tabs/chaupal/myPosts') }, [])
    const handleFylloServices = useCallback(() => { router.navigate('/fylloServices') }, [])
    const handleLogout = useCallback(() => { logout() }, [])

    const phoneText = useMemo(() =>
        userDetails?.phone ? `+91 ${userDetails?.phone}` : 'N/A'
        , [userDetails?.phone])

    const regionText = useMemo(() =>
        camelCaseWords(userDetails?.farmerDetails?.farmer_state ?? 'N/A')
        , [userDetails?.farmerDetails?.farmer_state])

    const accountStatusText = useMemo(() =>
        isVerified ? t('verified') : t('unverified')
        , [isVerified, t])


    const AccountDetails = useMemo(() => {
        return (
            <View style={detailsBoxStyle}>
                <DetailLine
                    label={{ content: t('phone'), size: 12 }}
                    description={{
                        content: phoneText,
                        fontFamily: 'InterMedium',
                        size: 12
                    }}
                />
                <View style={dividerStyle} />
                <DetailLine
                    label={{ content: t('region'), size: 12 }}
                    description={{
                        content: regionText,
                        fontFamily: 'InterMedium',
                        size: 12
                    }}
                />
                <View style={dividerStyle} />
                <DetailLine
                    label={{ content: t('accountStatus'), size: 12 }}
                    description={{
                        content: accountStatusText,
                        fontFamily: 'InterMedium',
                        size: 12
                    }}
                />
            </View>
        )
    }, [t, phoneText, regionText, accountStatusText])


    return (
        <>

            <ScreenView>
                <ScrollView
                    ref={scrollRef}
                    style={style.container} contentContainerStyle={scrollContentStyle}
                    refreshControl={<RefreshControl
                        refreshing={isFetchingUser}
                        onRefresh={fetchUser}
                    />}>
                    <View style={profileBoxStyle}>
                        {userDetails && <ProfileAvatar detail={userDetails} />}
                        <ThemeDivider size={6} />

                        <ThemeText
                            content={userDetails?.name ?? t('guestUser', 'Guest User')}
                            size={22}
                            fontFamily="MontserratBold"
                        />
                        <ThemeText
                            content={userDetails?.emp_id ?? ''}
                            size={14}
                            fontFamily="InterMedium"
                            color={secondaryTextColor}
                            onLongPress={() => copyData(String(userDetails?.emp_id)?.trim())}
                        />
                        <ThemeDivider size={38} />

                        {AccountDetails}

                        <View style={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8,
                        }}>
                            <Pressable
                                onPress={() => router.navigate('/editprofile')}
                                style={{
                                    backgroundColor: theme.background.slate,
                                    borderRadius: 12,
                                    borderCurve: 'continuous',
                                    paddingHorizontal: 14,
                                    paddingVertical: 6,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                }}>
                                <EditIcon color={theme.text.primary} strokeWidth={1} size={16} />
                                <ThemeText content={t('edit')} variant='xs' fontFamily='MontserratMedium' />
                            </Pressable>
                        </View>

                    </View>

                    <Suspense fallback={<Skelton dimensions={{ height: 130 }} />}>
                        <MyCoins />
                    </Suspense>

                    <View style={menuBoxStyle}>
                        <MenuItem
                            label={t('menus.findAndConnect')}
                            onPress={handleYourLocation}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.myFarms')}
                            onPress={handleYourFarms}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.iotService')}
                            onPress={handleFylloServices}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.myPost')}
                            onPress={handleCommunityPosts}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.mySprays')}
                            onPress={handleSprays}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.subscriptions')}
                            onPress={handleSubscriptions}
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                    </View>


                    <View style={menuBoxStyle}>
                        <MenuItem
                            label={t('menus.manageAccount')}
                            onPress={handleManageAccount}
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                    </View>

                    <View style={menuBoxStyle}>
                        <MenuItem
                            label={t('language')}
                            onPress={handleLanguage}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.appPermission')}
                            onPress={handlePermissions}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.aboutUs')}
                            onPress={handleAboutUs}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.contactUs')}
                            onPress={handleContactUs}
                            showDivider
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                        <MenuItem
                            label={t('menus.privacyPolicy')}
                            onPress={handlePrivacyPolicy}
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                    </View>


                    <View style={[menuBoxStyle, {
                        borderColor: 'red'
                    }]}>
                        <MenuItem
                            label={t('menus.logout')}
                            textColor='red'
                            onPress={handleLogout}
                            dividerColor={dividerColor}
                            iconColor={theme?.text?.disabled}
                        />
                    </View>

                    <ThemeDivider size={32} />
                    <CompanyFooter />
                </ScrollView>
            </ScreenView>

        </>
    )
}

export default ProfilePage

const style = StyleSheet.create({
    container: {
        padding: 16,
    },
    borderedBox: {
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
    },
})

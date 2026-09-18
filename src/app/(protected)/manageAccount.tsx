import BottomSheet from '@/components/basic/bottomSheet'
import LoadingScreen from '@/components/basic/containers/loadingScreen'
import ScreenView from '@/components/basic/containers/screenView'
import ModernDetailItem from '@/components/basic/modernDetailItem'

import { GearIcon, PasswordIcon, WarningIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { router } from 'expo-router'
import { lazy, Suspense, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'


const DeleteAccount = lazy(() => import('@/components/basic/pages/profile/deleteAccount'))
const UpdatePassword = lazy(() => import('@/components/basic/pages/profile/updatePassword'))

const ManageAccount = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const [showDialog, setShowDialog] = useState<'remove' | 'password' | null>(null)
    const closeDialog = useCallback(() => { setShowDialog(null) }, [])

    return (
        <>
            <ScreenView>
                <Header backIcon label={t('manageAccount.title')} withoutTopPadding />

                <ScrollView
                    contentContainerStyle={{
                        padding: 8,
                        gap: 2
                    }}
                >
                    <ModernDetailItem bg={theme.background.slate} isFirst icon={GearIcon} description={{ content: t('manageAccount.updateProfile'), size: 12 }} onPress={() => router.navigate('/editprofile')} />
                    <ModernDetailItem bg={theme.background.slate} icon={PasswordIcon} single={false} description={{ content: t('manageAccount.updatePassword'), size: 12 }} onPress={() => setShowDialog('password')} />
                    <ModernDetailItem bg={theme.background.slate} icon={WarningIcon} iconColor={theme.error} isLast description={{ content: t('manageAccount.removeAccount'), size: 12, severity: 'error' }} onPress={() => setShowDialog('remove')} />

                </ScrollView>
            </ScreenView>

            {showDialog &&
                <BottomSheet
                    visible={Boolean(showDialog)}
                    onClose={() => { }}
                    children={
                        <>
                            {showDialog == 'remove' &&
                                <Suspense fallback={<LoadingScreen />}>
                                    <DeleteAccount callback={closeDialog} />
                                </Suspense>
                            }
                            {showDialog == 'password' &&
                                <Suspense fallback={<LoadingScreen />}>
                                    <UpdatePassword callback={closeDialog} />
                                </Suspense>
                            }
                        </>
                    }
                />}


        </>
    )
}

export default ManageAccount
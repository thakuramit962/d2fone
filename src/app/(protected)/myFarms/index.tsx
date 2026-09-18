import ScreenView from '@/components/basic/containers/screenView'
import FarmList from '@/components/basic/pages/farms'
import ThemeText from '@/components/basic/text/ThemeText'
import { ArrowRightIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import useFarms from '@/hooks/use-farms'
import { useTheme } from '@/hooks/use-theme'
import { Farm } from '@/models/user'
import { RootState } from '@/store/store'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { useSelector } from 'react-redux'


const MyFarms = () => {

    const theme = useTheme()
    const { fetchFarms, loading } = useFarms()
    const { t } = useTranslation()

    const selectorFarms = useSelector((state: RootState) => state.auth?.currentUser?.userFarms)
    const farms: Farm[] = Array.isArray(selectorFarms) ? selectorFarms : selectorFarms ? [selectorFarms] : []


    useEffect(() => {
        farms?.length == 0 &&
            fetchFarms({})
    }, [farms?.length])

    return (
        <ScreenView
            edges={['bottom', 'left', 'right']}
        >
            <Header
                backIcon
                label={t('myFarms.header.title')}
                description={t('myFarms.header.description')}
                rightSlot={
                    <Pressable
                        onPress={() => router.navigate('/myFarms/addFarm')}
                        style={{
                            borderRadius: 14,
                            borderCurve: 'continuous',
                            backgroundColor: theme?.text.primary,
                            paddingLeft: 24, paddingRight: 8,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                        }}>
                        <ThemeText content={t('myFarms.buttons.createNew')} variant='xs' color={theme.background.main} fontFamily='MontserratSemiBold' />
                        <ArrowRightIcon color={theme.background.main} size={20} />
                    </Pressable>
                } />

            <FarmList farms={farms} loading={loading} onRefresh={() => fetchFarms({})}
                onFarmPress={(farm) =>
                    router.navigate({
                        pathname: '/myFarms/[id]',
                        params: { id: farm.id }
                    })
                }
            />

        </ScreenView>
    )
}

export default MyFarms
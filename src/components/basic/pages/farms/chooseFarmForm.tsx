import useFarms from '@/hooks/use-farms'
import { useTheme } from '@/hooks/use-theme'
import { Farm } from '@/models/user'
import { useAppSelector } from '@/store/store'
import { camelCaseWords, dimensions } from '@/utils/app-helper'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, ListRenderItem, Pressable, StyleSheet, View } from 'react-native'
import ActionText from '../../text/ActionText'
import ThemeText from '../../text/ThemeText'

const CARD_WIDTH = Math.min(dimensions.width * 0.4, 260)

const ChooseFarmForm = ({ onChange, selectedId }: { onChange?: (farm: null | Farm) => void, selectedId?: string }) => {

    const theme = useTheme()
    const { fetchFarms, loading } = useFarms()
    const [selectedFarm, setSelectedFarm] = useState<null | Farm>(null)

    const myFarms = useAppSelector((state) => state.auth?.currentUser?.userFarms)

    const farms: Farm[] = useMemo(
        () => (Array.isArray(myFarms) ? myFarms : myFarms ? [myFarms] : []),
        [myFarms]
    )

    const handleSelect = useCallback((item: Farm) => {
        setSelectedFarm((prev) => {
            const next = prev && prev.id === item.id ? null : item
            onChange?.(next)
            return next
        })
    }, [onChange])

    const keyExtractor = useCallback((item: Farm) => String(item.id), [])

    const renderItem: ListRenderItem<Farm> = useCallback(({ item }) => {
        const isSelected = selectedFarm?.id === item.id

        return (
            <Pressable onPress={() => item?.status && handleSelect(item)}>
                <LinearGradient
                    colors={[theme.background.slate, `${isSelected ? theme.success : theme.background.main}40`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.card,
                        {
                            borderColor: isSelected ? theme.primary : `${theme.text.primary}25`,
                            backgroundColor: theme.background.main,
                        },
                    ]}
                >
                    <ThemeText
                        content={item.field_area}
                        fontFamily="MontserratBold"
                        variant="xs"
                        severity={isSelected ? 'primary' : 'main'}
                        size={14}
                        style={styles.title}
                        numberOfLines={1}
                    />
                    <ThemeText
                        content={`${item.acerage} acre in ${camelCaseWords([item.district, item.state].filter(Boolean).join(', '))}`}
                        numberOfLines={1}
                    />
                    {item.status == '0' &&
                        <ThemeText
                            content={'Inactive'} severity='error'
                        />}
                </LinearGradient>
            </Pressable>
        )
    }, [selectedFarm, theme, handleSelect])

    const listEmptyComponent = useMemo(() => (
        loading ? (
            <View style={[styles.card, { backgroundColor: theme.background.main }]}>
                <ActivityIndicator color={theme.primary} />
            </View>
        ) : (
            <View style={[styles.card, { backgroundColor: theme.background.main }]}>
                <ThemeText content="No farms found" />
                <ActionText label="View Farms" action={() => router.navigate('/myFarms')} />
                <ActionText label="Reload" action={() => fetchFarms({})} />
            </View>
        )
    ), [loading, theme, fetchFarms])


    useEffect(() => {
        if (selectedId) {
            const farmChoosed = farms.filter((el) => String(el.id) == String(selectedId))[0]
            setSelectedFarm(farmChoosed || null)
        }
    }, [selectedId])

    useEffect(() => {
        !farms.length && fetchFarms({})
    }, [])

    return (
        <>
            <FlatList
                data={farms}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={listEmptyComponent}
            />
            {farms?.every((el) => el.status == '0') && <ActionText label='Manage Farms' action={() => router.navigate('/myFarms')} />}
        </>
    )
}

const styles = StyleSheet.create({
    listContent: {
        gap: 8,
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    card: {
        minWidth: CARD_WIDTH,
        maxWidth: 320,
        borderRadius: 18,
        borderCurve: 'continuous',
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        height: 64,
        justifyContent: 'center',
    },
    title: {
        lineHeight: 16,
    },
})

export default ChooseFarmForm
import { ArrowDownIcon, ArrowRightIcon, LocationIcon, PlantIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import useMandiBhaav from '@/hooks/useMandiBhaav'
import { GroupedCommodity } from '@/models/mandibhaav'
import { memo, useState } from 'react'
import { View } from 'react-native'
import ModernDetailItem from '../../modernDetailItem'
import DetailLine from '../../text/detailLine'

const CommodityItem = ({ item, index }: { item: GroupedCommodity, index: number }) => {

    const theme = useTheme()
    const [expanded, setExpanded] = useState(index === 0)
    const { formatPrice } = useMandiBhaav()

    return (
        <View
            style={{
                backgroundColor: theme?.background.main,
                borderRadius: 18,
                padding: 6,
                gap: 2,
                marginBottom: 8,
                borderCurve: 'continuous'
            }}>
            <ModernDetailItem
                bg={'transparent'}
                icon={PlantIcon}
                padding={0}
                minHeight={24}
                iconColor={theme?.text?.primary}
                iconSize={22}
                description={{ content: item.commodity, variant: 'sm' }}
                actionIcon={expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
                onPress={() => setExpanded(e => !e)}
            />
            {
                expanded
                    ? <>
                        {item.items.map((d, i) => (
                            <ModernDetailItem
                                key={i}
                                bg={theme?.background.slate}
                                isFirst={i == 0}
                                isLast={i == item.items.length - 1}
                                single={item.items?.length == 1}
                                children={
                                    <View
                                        key={i}
                                        style={{
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, borderBottomWidth: 0.5, borderColor: theme?.text.disabled, marginBottom: 4 }}>
                                            <View style={{ flex: 1 }}>
                                                <DetailLine icon={LocationIcon} label={{ content: 'Mandi/ Market' }} />
                                                <DetailLine description={{ content: `${d.market}, ${d.district}`, fontFamily: 'MontserratBold', variant: 'xs', severity: 'main', style: { width: '90%', } }} />
                                            </View>
                                            <DetailLine
                                                description={{ content: formatPrice(d.modal_price), fontFamily: 'MontserratBold', variant: 'sm', severity: 'primary' }}
                                            />
                                        </View>

                                        <DetailLine label={{ content: 'Min Price', fontFamily: 'InterMedium' }} description={{ content: formatPrice(d.min_price), fontFamily: 'MontserratSemiBold' }} />
                                        <DetailLine label={{ content: 'Max Price', fontFamily: 'InterMedium' }} description={{ content: formatPrice(d.max_price), fontFamily: 'MontserratSemiBold' }} />
                                        <DetailLine label={{ content: 'Grade', fontFamily: 'InterMedium' }} description={{ content: d.grade, fontFamily: 'MontserratSemiBold' }} />
                                        <DetailLine label={{ content: 'Variety', fontFamily: 'InterMedium' }} description={{ content: d.variety, fontFamily: 'MontserratSemiBold' }} />
                                        <DetailLine label={{ content: 'Date', fontFamily: 'InterMedium' }} description={{ content: d.arrival_date, fontFamily: 'MontserratSemiBold' }} />
                                    </View>
                                }
                            />
                        ))}
                    </>
                    : null
            }
        </View >
    )
}

export default memo(CommodityItem)

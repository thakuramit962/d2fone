import { dimensions } from '@/utils/app-helper'
import { View } from 'react-native'
import Skelton from '../../Skelton'

const CommunityPostCardSkelton = ({ height }: { height: number }) => {
    return (
        <View style={{
            height,
            justifyContent: 'flex-start'
        }}>
            <View style={{
                flexDirection: 'row',
                gap: 8,
                padding: 8,
                alignItems: 'flex-start',
            }}>
                <Skelton dimensions={{ height: 48, width: 48 }} />
                <View style={{
                    gap: 4,
                    flex: 1
                }}>
                    <Skelton dimensions={{ height: 22, width: 160 }} />
                    <Skelton dimensions={{ height: 16, width: 100 }} />
                </View>
            </View>
            <Skelton dimensions={{ height: height - 120, width: dimensions.width }} />
        </View>
    )
}

export default CommunityPostCardSkelton
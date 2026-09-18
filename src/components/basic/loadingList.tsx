import { memo } from 'react'
import { View } from 'react-native'
import Skelton from './Skelton'

const LoadingList = ({ count = 5, height = 72 }: { count?: number, height?: number }) => {
    return (
        <View style={{ gap: 2 }}>
            {
                [...new Array(count)].map((_, i) =>
                    <Skelton dimensions={{ height }} key={i} />
                )
            }
        </View >
    )
}

export default memo(LoadingList)
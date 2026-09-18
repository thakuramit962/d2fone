import ScreenView from '@/components/basic/containers/screenView'
import Header from '@/components/layout/navigation/Header'
import { useLocalSearchParams } from 'expo-router'
import { Text } from 'react-native'

const SinglePost = () => {

    const { id } = useLocalSearchParams()

    return (
        <ScreenView>
            <Header backIcon label={'Post Details'} withoutTopPadding />
            <Text>SinglePost</Text>
            <Text>{id}</Text>
        </ScreenView>
    )
}

export default SinglePost
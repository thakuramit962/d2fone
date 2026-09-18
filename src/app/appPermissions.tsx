import ScreenView from '@/components/basic/containers/screenView'
import Permissions from '@/components/basic/permissions'
import Header from '@/components/layout/navigation/Header'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { ScrollView } from 'react-native'

const AppPermissions = () => {
    const scrollRef = useScrollToTop()
    return (
        <ScreenView>
            <Header withoutTopPadding label={'App Permissions'} description={'See what services we are using for better efficiency.'} />

            <ScrollView ref={scrollRef} contentContainerStyle={{
                padding: 16,
            }}>
                <Permissions />
            </ScrollView>
        </ScreenView>
    )
}

export default AppPermissions
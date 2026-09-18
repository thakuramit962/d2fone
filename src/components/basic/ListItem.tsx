import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { ReactNode } from 'react'
import { View } from 'react-native'
import ThemeText from './text/ThemeText'



interface ListItemProps {
    icon?: ReactNode
    label: string
    actionElement?: ReactNode
    variant?: 'xs' | 'sm' | 'md' | 'lg'

}

const ListItem = ({ icon, label, actionElement, variant = 'xs' }: ListItemProps) => {

    const globalStyle = useGlobalStyle()

    return (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {icon}
            <View style={[globalStyle.flex1]}>
                <ThemeText content={label} variant={variant} severity='secondary' />
            </View>
            {actionElement}
        </View>
    )
}

export default ListItem
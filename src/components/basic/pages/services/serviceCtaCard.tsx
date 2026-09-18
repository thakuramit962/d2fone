import { useTheme } from '@/hooks/use-theme'
import useAppText from '@/hooks/useAppText'
import { FeaturedTool } from '@/models/commonTypes'
import { View } from 'react-native'
import ThemeText from '../../text/ThemeText'
import ThemeDivider from '../../ThemeDivider'


const CtaItem = ({ icon, title, description = "" }: FeaturedTool) => {

  const theme = useTheme()
  const Icon = icon

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      // padding: 16,
      flex: 1
    }}>
      {Icon && <Icon height={32} width={32} color={theme.text.primary} />}
      <ThemeDivider size={12} />
      <ThemeText content={title} fontFamily='InterMedium' size={10} style={{ textAlign: 'center' }} />
      <ThemeText content={description} size={8} severity='secondary' style={{ textAlign: 'center' }} />
    </View>
  )
}

const ServiceCtaCard = () => {
  const { serviceCtas } = useAppText()
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    }}>
      {serviceCtas.map((item, i) => (
        <CtaItem key={i} {...item} />
      ))}
    </View>

  )
}

export default ServiceCtaCard
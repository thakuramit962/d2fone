import ThemeText from '@/components/basic/text/ThemeText';
import ThemeChip from '@/components/basic/ThemeChip';
import ThemeDivider from '@/components/basic/ThemeDivider';
import { ArrowRightIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { RootState } from '@/store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { useSelector } from 'react-redux';

export default function NotFoundScreen() {

  const theme = useTheme()
  const hasOnboarded = useSelector((state: RootState) => state?.appSlice?.hasOnboarded ?? false);
  const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn ?? false);

  const redirectUrl: Href = hasOnboarded || isLoggedIn ? "/tabs/home" : "/landing";

  return (
    <LinearGradient colors={[`${theme?.info}`, `${theme?.background.main}`]}
      style={{
        flex: 1,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
      }}>

      <ThemeText content={`Oops!`}
        fontFamily='MontserratBlack'
        color={theme?.background.main}
        style={{
          fontSize: 64,
        }} />

      <ThemeText content={'Navigated to a screen that does not exists.'} variant='xs' color={theme?.background.main} />
      <ThemeDivider size={32} />
      <ThemeChip
        label={'Back'}
        variant='sm'
        color={theme?.info}
        type='solid'
        icon={ArrowRightIcon}
        iconPosition='right'
        iconColor={theme?.background?.main}
        onPress={() => router.replace(redirectUrl)}
        containerStyle={{
          height: 42,
          width: 170,
          justifyContent: 'center',
          paddingLeft: 32,
        }} />

    </LinearGradient>
  )
}
import { getFontSize } from '@/constants/appConstant';
import { useTheme } from '@/hooks/use-theme';
import { FontFamily } from '@/models/fontFamily';
import { memo } from 'react';
import { Text, TextProps } from 'react-native';


export interface ThemeTextProps extends TextProps {
  content: string | string[]
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xxs'
  severity?: 'success' | 'info' | 'warning' | 'error' | 'main' | 'secondary' | 'disabled' | 'primary'
  fontFamily?: FontFamily
  color?: string
  size?: number
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
}

const ThemeText: React.FC<ThemeTextProps> = memo(({
  size,
  content,
  style,
  variant,
  severity,
  fontFamily = 'InterRegular',
  color,
  weight,
  ...restProps
}) => {

  const theme = useTheme()

  const fontSize = getFontSize(variant)


  return (
    <Text
      style={[
        {
          color: color ? color
            : severity === 'success' ? theme?.success
              : severity === 'primary' ? theme?.primary
                : severity === 'info' ? theme?.info
                  : severity === 'warning' ? theme?.warning
                    : severity === 'error' ? theme?.error
                      : severity === 'disabled' ? theme?.text?.disabled
                        : severity === 'secondary' ? theme?.text?.secondary
                          : theme?.text?.primary,
          fontSize: size || fontSize,
          fontWeight: weight || (variant === 'lg' ? 600 : variant === 'md' ? 600 : variant === 'sm' ? 500 : 400),
          fontFamily: String(fontFamily)
        },
        style
      ]}
      {...restProps}
    >
      {content}
    </Text>
  );
});

export default ThemeText
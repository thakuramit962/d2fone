import { useTheme } from '@/hooks/use-theme';
import { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

interface SkeltonProps extends ViewProps {
    dimensions: {
        width?: number,
        height: number,
        radius?: number
    }
    content?: ReactNode
    color?: string

}

const Skelton = ({ dimensions, content, color, style, ...restProps }: SkeltonProps) => {

    const theme = useTheme()

    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: color ?? `${theme?.text.secondary}20`,
                    minHeight: dimensions.height ?? 10,
                    borderRadius: dimensions.radius ?? 16,
                    opacity,
                    width: dimensions.width,
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                style
            ]}
            {...restProps}
        >
            {content}
        </Animated.View>
    );
};

export default Skelton;

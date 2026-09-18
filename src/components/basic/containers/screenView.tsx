import { useTheme } from '@/hooks/use-theme';
import { ReactNode } from 'react';
import { ColorValue, KeyboardAvoidingView, Platform } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

const ScreenView = ({
    children,
    edges = ['top', 'bottom', 'left', 'right'],
    bg
}: {
    children: ReactNode;
    edges?: Edges | undefined;
    bg?: ColorValue
}) => {
    const theme = useTheme()
    return (
        <SafeAreaView
            edges={edges}
            style={[{
                flex: 1,
                backgroundColor: bg || theme.background.main,
            }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                }}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ScreenView
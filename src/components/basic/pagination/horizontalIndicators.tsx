import { useTheme } from "@/hooks/use-theme";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

type Props = {
    currentIndex: number;
    total: number;
    color?: string
};

const MAX_DOTS = 3;
const DOT_SIZE = 7;
const ACTIVE_WIDTH = 24;
const DURATION = 250;

function getWindow(currentIndex: number, total: number): number {
    if (total <= MAX_DOTS) return 0; // show all, no offset needed

    // Keep active dot in the center slot, clamped to valid range
    const ideal = currentIndex - 1;
    const max = total - MAX_DOTS;
    return Math.min(Math.max(ideal, 0), max);
}

function Dot({ active, color }: { active: boolean, color?: string }) {
    const theme = useTheme()
    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(active ? ACTIVE_WIDTH : DOT_SIZE, { duration: DURATION }),
        opacity: withTiming(active ? 1 : 0.4, { duration: DURATION }),
    }));

    return (
        <Animated.View
            style={[
                {
                    height: DOT_SIZE,
                    borderRadius: 999,
                    backgroundColor: color ? color : `${theme.text.primary}25`,
                    marginHorizontal: 3,
                },
                animatedStyle,
            ]}
        />
    );
}

export default function HorizontalIndicators({ currentIndex, total, color }: Props) {
    const count = Math.min(total, MAX_DOTS);
    const windowStart = getWindow(currentIndex, total);

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <Dot
                    color={color}
                    key={windowStart + i}
                    active={windowStart + i === currentIndex}
                />
            ))}
        </View>
    );
}
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface SectionCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
});

export default SectionCard;
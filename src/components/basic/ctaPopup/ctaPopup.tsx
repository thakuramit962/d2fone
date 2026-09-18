import { dimensions } from '@/utils/app-helper';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '../bottomSheet';
import { PopupFeature } from './useFeatureNudge';

interface NudgeModalProps {
    popup: PopupFeature | null;
    onClose: (dontShowAgain: boolean) => void;
    onAction: () => void;
}

export const CtaPopup: React.FC<NudgeModalProps> = ({ popup, onClose, onAction }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!popup) return null;

    return (
        <BottomSheet
            visible={Boolean(popup)}
            onClose={() => onClose(dontShowAgain)}
            height={dimensions.height * 0.75}
        >
            <View style={styles.alertBox}>

                <Text style={styles.title}>{popup.title}</Text>
                <Text style={styles.tagline}>{popup.tagline}</Text>

                {popup.frequency === 'once' && (
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        activeOpacity={0.8}
                        onPress={() => setDontShowAgain(!dontShowAgain)}
                    >
                        <View style={[styles.checkbox, dontShowAgain && styles.checkboxChecked]} />
                        <Text style={styles.checkboxLabel}>Don't show this suggestion again</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => {
                            onClose(dontShowAgain);
                            setDontShowAgain(false); // Reset state
                        }}
                    >
                        <Text style={styles.secondaryButtonText}>Dismiss</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={onAction}
                    >
                        <Text style={styles.primaryButtonText}>Check it out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    alertBox: {
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    tagline: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    checkboxLabel: {
        fontSize: 13,
        color: '#4B5563',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    secondaryButton: {
        backgroundColor: '#F3F4F6',
    },
    secondaryButtonText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: '#10B981',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
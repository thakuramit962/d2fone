import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import ThemeText from './text/ThemeText'

const NotesSection = ({ NOTES }: { NOTES: string[] }) => {
    const { t } = useTranslation()
    return (
        <View
            style={styles.notesContainer}
            accessibilityRole="none"
            accessible={false}
        >
            <ThemeText content={t('note')} fontFamily="MontserratSemiBold" />
            <View style={styles.notesList}>
                {NOTES?.map((note, i) => (
                    <ThemeText key={note + i} content={`• ${note}`} severity="secondary" />
                ))}
            </View>
        </View>
    )
}

export default NotesSection

const styles = StyleSheet.create({
    notesContainer: {
        paddingHorizontal: 8,
        paddingVertical: 24,
    },
    notesList: {
        paddingHorizontal: 16,
        marginTop: 4,
    },
});
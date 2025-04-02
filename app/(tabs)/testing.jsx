import { View, Text, StyleSheet } from 'react-native';
import DndTest from '../../components/DndTest';

export default function TestingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>DndTest Component Demo</Text>
            <DndTest />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
});
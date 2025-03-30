import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { FormElement } from './FormElement';

export const ElementSettings = ({ element, onUpdate, onClose }: any) => (
  <ThemedView style={styles.panel}>
    <ThemedText type="title">Edit Element</ThemedText>
    
    <TextInput
      style={styles.input}
      value={element.label}
      onChangeText={text => onUpdate({ ...element, label: text })}
    />
    
    {element.options && (
      <View style={styles.options}>
        {element.options.map((opt: string, i: number) => (
          <TextInput
            key={i}
            style={styles.input}
            value={opt}
            onChangeText={text => {
              const newOptions = [...element.options];
              newOptions[i] = text;
              onUpdate({ ...element, options: newOptions });
            }}
          />
        ))}
      </View>
    )}
    
    <Button title="Close" onPress={onClose} />
  </ThemedView>
);

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    padding: 16,
    gap: 8,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  options: {
    gap: 4,
  },
});
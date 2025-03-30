import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FormElement, formElementPalette } from '@/components/FormElement';
import { ElementSettings } from '@/components/ElementSettings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function FormBuilderScreen() {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddElement = (type: FormElementType) => {
    const newElement = {
      ...formElementPalette.find(e => e.id === type)!,
      id: `element-${Date.now()}`,
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (updated: FormElement) => {
    setElements(elements.map(e => e.id === updated.id ? updated : e));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemedView style={styles.container}>
      <View style={styles.sidebar}>
        <ThemedText type="title">Elements</ThemedText>
        {formElementPalette.map(element => (
          <TouchableOpacity
            key={element.id}
            onPress={() => handleAddElement(element.type)}
          >
            <ThemedView style={styles.paletteItem}>
              <ThemedText>{element.label}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.builderArea}>
        <DraggableFlatList
          data={elements}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setElements(data)}
          renderItem={({ item, drag }) => (
            <TouchableOpacity
              onLongPress={drag}
              onPress={() => setSelectedElement(item.id)}
            >
              <EditableElement
                element={item}
                isPreview={previewMode}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedElement && (
        <ElementSettings
          element={elements.find(e => e.id === selectedElement)!}
          onUpdate={updateElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      <Button
        title={previewMode ? "Edit Mode" : "Preview Mode"}
        onPress={() => setPreviewMode(!previewMode)}
      />
    </ThemedView>
    </GestureHandlerRootView>
  );
}



const EditableElement = ({ element, isPreview, onPress }: any) => (
  <ThemedView style={styles.element} onTouchStart={onPress}>
    {isPreview ? (
      <ThemedText>{element.label}</ThemedText>
    ) : (
      <>
        <ThemedText type="subtitle">{element.label}</ThemedText>
        {element.type === 'dropdown' && element.options?.map((opt, i) => (
          <ThemedText key={i}>{opt}</ThemedText>
        ))}
      </>
    )}
  </ThemedView>
);

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 200, padding: 16, gap: 8 },
  builderArea: { flex: 1, padding: 16, gap: 8 },
  paletteItem: { padding: 12, borderRadius: 8 },
  element: { padding: 16, margin: 4, borderRadius: 8 },
  draggingItem: { padding: 16, borderRadius: 8, opacity: 0.8 },
});
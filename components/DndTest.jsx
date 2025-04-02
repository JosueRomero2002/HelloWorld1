import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';


const COMPONENT_TYPES = {
  TEXT_INPUT: 'TEXT_INPUT',
  DROPDOWN: 'DROPDOWN',
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO',
  DATE_PICKER: 'DATE_PICKER',
};


const TextInputField = ({ field, updateField, onFocus }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <TextInput
        style={styles.input}
        placeholder={field.placeholder || 'Introduce texto...'}
        value={field.value}
        onChangeText={(text) => updateField(field.id, { ...field, value: text })}
        onFocus={() => onFocus(field.id)}
      />
    </View>
  );
};


const DropdownField = ({ field, updateField, onFocus }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => onFocus(field.id)}
      >
        <Text>{field.value || field.placeholder || 'Selecciona una opción'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const CheckboxField = ({ field, updateField, onFocus }) => {
  return (
    <View style={styles.fieldContainer}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => {
          updateField(field.id, { ...field, value: !field.value });
          onFocus(field.id);
        }}
      >
        <View style={[styles.checkbox, field.value && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>{field.label}</Text>
      </TouchableOpacity>
    </View>
  );
};


const RadioField = ({ field, updateField, onFocus }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <View style={styles.radioOptions}>
        {field.options && field.options.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.radioOption}
            onPress={() => {
              updateField(field.id, { ...field, value: option });
              onFocus(field.id);
            }}
          >
            <View style={styles.radioOuterCircle}>
              {field.value === option && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


const DatePickerField = ({ field, updateField, onFocus }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <TouchableOpacity 
        style={styles.datePicker}
        onPress={() => onFocus(field.id)}
      >
        <Text>{field.value || field.placeholder || 'Selecciona una fecha'}</Text>
      </TouchableOpacity>
    </View>
  );
};


const DraggableFormField = ({ field, updateField, onFocus, moveField, index, onLongPress }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
      runOnJS(onLongPress)(index);
      isDragging.value = true;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
      translateX.value = event.translationX;
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      translateX.value = withSpring(0);
      runOnJS(moveField)(index, translateY.value);
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      zIndex: isDragging.value ? 100 : 1,
      shadowOpacity: isDragging.value ? 0.2 : 0,

     // shadowOffset: { width: 0, height: isDragging.value ? 10 : 0 },
      shadowRadius: isDragging.value ? 10 : 0,
      elevation: isDragging.value ? 5 : 0,
    };
  });

  const renderField = () => {
    switch (field.type) {
      case COMPONENT_TYPES.TEXT_INPUT:
        return <TextInputField field={field} updateField={updateField} onFocus={onFocus} />;
      case COMPONENT_TYPES.DROPDOWN:
        return <DropdownField field={field} updateField={updateField} onFocus={onFocus} />;
      case COMPONENT_TYPES.CHECKBOX:
        return <CheckboxField field={field} updateField={updateField} onFocus={onFocus} />;
      case COMPONENT_TYPES.RADIO:
        return <RadioField field={field} updateField={updateField} onFocus={onFocus} />;
      case COMPONENT_TYPES.DATE_PICKER:
        return <DatePickerField field={field} updateField={updateField} onFocus={onFocus} />;
      default:
        return null;
    }
  };

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View style={[styles.draggableField, animatedStyle]}>
        {renderField()}
        <View style={styles.dragHandle}>
          <View style={styles.dragLine} />
          <View style={styles.dragLine} />
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

// Componente principal del Form Builder
const FormBuilder = () => {
  const [fields, setFields] = useState([
    {
      id: '1',
      type: COMPONENT_TYPES.TEXT_INPUT,
      label: 'Nombre',
      placeholder: 'Introduce tu nombre',
      value: '',
    },
    {
      id: '2',
      type: COMPONENT_TYPES.TEXT_INPUT,
      label: 'Email',
      placeholder: 'Introduce tu email',
      value: '',
    },
    {
      id: '3',
      type: COMPONENT_TYPES.DROPDOWN,
      label: 'País',
      placeholder: 'Selecciona tu país',
      options: ['España', 'México', 'Argentina', 'Colombia', 'Chile'],
      value: '',
    },
    {
      id: '4',
      type: COMPONENT_TYPES.CHECKBOX,
      label: 'Acepto los términos y condiciones',
      value: false,
    },
    {
      id: '5',
      type: COMPONENT_TYPES.RADIO,
      label: 'Género',
      options: ['Masculino', 'Femenino', 'Otro'],
      value: '',
    },
    {
      id: '6',
      type: COMPONENT_TYPES.DATE_PICKER,
      label: 'Fecha de nacimiento',
      value: '',
    },
  ]);

  const [focusedFieldId, setFocusedFieldId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);


  const updateField = (id, updatedField) => {
    setFields(fields.map(field => (field.id === id ? updatedField : field)));
  };

 
  const moveField = (fromIndex, yOffset) => {
    if (yOffset === 0) return;

    const direction = yOffset > 0 ? 1 : -1;
    const toIndex = Math.max(0, Math.min(fields.length - 1, fromIndex + direction));

    if (fromIndex !== toIndex) {
      const newFields = [...fields];
      const [movedItem] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedItem);
      setFields(newFields);
    }
    setDragIndex(null);
  };


  const addField = (type) => {
    const newField = {
      id: `${Date.now()}`,
      type,
      label: `Nuevo ${type.toLowerCase().replace('_', ' ')}`,
      value: type === COMPONENT_TYPES.CHECKBOX ? false : '',
    };

    if (type === COMPONENT_TYPES.DROPDOWN || type === COMPONENT_TYPES.RADIO) {
      newField.options = ['Opción 1', 'Opción 2', 'Opción 3'];
    }

    setFields([...fields, newField]);
  };


  const deleteField = (id) => {
    setFields(fields.filter(field => field.id !== id));
    if (focusedFieldId === id) {
      setFocusedFieldId(null);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        {fields.map((field, index) => (
          <DraggableFormField
            key={field.id}
            field={field}
            updateField={updateField}
            onFocus={setFocusedFieldId}
            moveField={moveField}
            index={index}
            onLongPress={setDragIndex}
          />
        ))}
      </ScrollView>

      <View style={styles.toolbox}>
        <Text style={styles.toolboxTitle}>Agregar campo</Text>
        <View style={styles.toolboxButtons}>
          <TouchableOpacity
            style={styles.toolboxButton}
            onPress={() => addField(COMPONENT_TYPES.TEXT_INPUT)}
          >
            <Text style={styles.toolboxButtonText}>Texto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolboxButton}
            onPress={() => addField(COMPONENT_TYPES.DROPDOWN)}
          >
            <Text style={styles.toolboxButtonText}>Dropdown</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolboxButton}
            onPress={() => addField(COMPONENT_TYPES.CHECKBOX)}
          >
            <Text style={styles.toolboxButtonText}>Checkbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolboxButton}
            onPress={() => addField(COMPONENT_TYPES.RADIO)}
          >
            <Text style={styles.toolboxButtonText}>Radio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolboxButton}
            onPress={() => addField(COMPONENT_TYPES.DATE_PICKER)}
          >
            <Text style={styles.toolboxButtonText}>Fecha</Text>
          </TouchableOpacity>
        </View>

        {focusedFieldId && (
          <View style={styles.fieldActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteField(focusedFieldId)}
            >
              <Text style={styles.actionButtonText}>Eliminar campo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  draggableField: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
  },
  fieldContainer: {
    padding: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  dropdown: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  radioOptions: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  radioLabel: {
    fontSize: 14,
  },
  datePicker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dragHandle: {
    position: 'absolute',
    right: 12,
    top: 12,
    alignItems: 'center',
  },
  dragLine: {
    width: 20,
    height: 2,
    backgroundColor: '#ddd',
    marginBottom: 2,
  },
  toolbox: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  toolboxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  toolboxButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolboxButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  toolboxButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fieldActions: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FormBuilder;
import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formElements = [
  { id: "input", label: "Input Text" },
  { id: "textarea", label: "Textarea" },
  { id: "checkbox", label: "Checkbox" },
];

const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    padding: "10px",
    margin: "5px",
    border: "1px solid gray",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </div>
  );
};

const DroppableArea = ({ items, setItems }) => {
  const { setNodeRef } = useDroppable({ id: "dropzone" });

  return (
    <div ref={setNodeRef} style={{ minHeight: "200px", border: "1px dashed gray", padding: "10px" }}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id} label={item.label} />
        ))}
      </SortableContext>
    </div>
  );
};

const FormBuilder = () => {
  const [items, setItems] = useState([]);

  const handleDragEnd = (event) => {
    const { active } = event;
    const newItem = formElements.find((el) => el.id === active.id);
    if (newItem) {
      setItems((prev) => [...prev, newItem]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Elements</h3>
          {formElements.map((element) => (
            <DraggableItem key={element.id} id={element.id} label={element.label} />
          ))}
        </div>
        <div>
          <h3>Form</h3>
          <DroppableArea items={items} setItems={setItems} />
        </div>
      </div>
    </DndContext>
  );
};

export default FormBuilder;

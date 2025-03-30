import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ThemedView } from './ThemedView';

export const SortableItem = ({ id, children, isPalette }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isPalette ? 1 : undefined,
  };

  return (
    <ThemedView
      ref={setNodeRef}
      style={style}
      {...(!isPalette ? { ...attributes, ...listeners } : {})}
    >
      {children}
    </ThemedView>
  );
};
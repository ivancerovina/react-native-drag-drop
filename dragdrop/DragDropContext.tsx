import { createContext, useContext, useState } from "react";
import { DroppableData } from "../types/droppable-types";
import {
  DragDropContextValues,
  DragDropProviderProps,
  ElementLayout,
} from "../types/dragdropcontext-types";

const DragDropContext = createContext<DragDropContextValues | null>(null);

/**
 * Context provider for managing drag and drop functionality.
 * @param {DragDropProviderProps} props - The props for the DragDropProvider component.
 * @param {ReactNode} props.children - The child elements to be wrapped by the DragDropProvider.
 * @param {Function} props.onDrop - Optional callback function triggered when a draggable element is dropped.
 * @returns {JSX.Element} - Returns a context provider for managing drag and drop state.
 */
export function DragDropProvider({
  children,
  onDrop,
  dropCheckOption
}: DragDropProviderProps): JSX.Element {
  const [droppables, setDroppables] = useState<DroppableData>({});

  function addDroppable(
    id: string | number,
    layout: ElementLayout,
    payload?: any,
    acceptsType?: string[]
  ) {
    setDroppables((prev) => ({
      ...prev,
      [id]: {
        layout: layout,
        payload: payload,
        acceptsType: acceptsType,
      },
    }));
  }

  function removeDroppable(id: number) {
    setDroppables((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }

  return (
    <DragDropContext.Provider
      value={{ droppables, addDroppable, removeDroppable, onDrop, dropCheckOption }}
    >
      {children}
    </DragDropContext.Provider>
  );
}

export const useDragDropContext = () => useContext(DragDropContext);

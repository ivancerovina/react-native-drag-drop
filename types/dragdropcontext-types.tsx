import { ReactNode } from "react";
import { DroppableData } from "./droppable-types";

/**
 * Interface representing the context values for drag and drop functionality.
 */
export type DragDropContextValues = {
  droppables: DroppableData;
  addDroppable: (
    id: string | number,
    layout: ElementLayout,
    payload?: any,
    acceptsType?: string[],
  ) => void;
  removeDroppable: (id: number) => void;
  onDrop?: DropCallback;
  dropCheckOption?: DropCheckOption;
};

/**
 * Interface representing the props for the DragDropProvider component.
 */
export type DragDropProviderProps = {
  children?: ReactNode;
  onDrop?: DropCallback;
  dropCheckOption?: DropCheckOption;
};

/**
 * Interface representing the layout of a droppable area.
 */
export type ElementLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Interface representing the event data when an element is dropped.
 */
export type DropEvent = {
  draggable: ElementData;
  droppable: ElementData | null;
};

/**
 * Interface representing the data associated with an element.
 */
export type ElementData = {
  id: string | number;
  payload?: any;
};

/**
 * Type representing a callback function for handling drop events.
 */
export type DropCallback = (event: DropEvent) => boolean;

/**
 * Type representing options for checking whether a draggable inside a droppable.
 *
 * **default** Looks for the first droppable the draggable is overlapping in (better for performance).
 * **closest** Looks for the closest droppable if a draggable overlaps multiple droppables (good if you have multiple droppables close to each other, and a draggable may ovelap two at the same time, but may hurt performance).
 * **custom** You can implement your own method for checking whether a draggable is inside or not 
*/
export type DropCheckOption =
  | "default"
  | "closest"
  | ((
      droppableLayout: ElementLayout,
      draggableLayout: ElementLayout
    ) => boolean);

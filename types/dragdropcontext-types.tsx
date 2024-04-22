import { ReactNode } from "react";

/**
 * Interface representing the context values for drag and drop functionality.
 */
export interface DragDropContextValues {
  droppables: DroppableData;
  addDroppable: (
    id: string | number,
    layout: ElementLayout,
    payload?: any
  ) => void;
  removeDroppable: (id: number) => void;
  onDrop?: DropCallback;
}

/**
 * Interface representing the props for the DragDropProvider component.
 */
export interface DragDropProviderProps {
  children?: ReactNode;
  onDrop?: DropCallback;
}

/**
 * Interface representing the data associated with a droppable area.
 */
export interface DroppableData {
  [id: string]: {
    layout: ElementLayout;
    payload?: any;
  };
}

/**
 * Interface representing the layout of a droppable area.
 */
export interface ElementLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Interface representing the event data when an element is dropped.
 */
export interface DropEvent {
  draggable: ElementData;
  droppable: ElementData | null;
}

/**
 * Interface representing the data associated with an element.
 */
export interface ElementData {
  id: string | number;
  payload?: any;
}

/**
 * Type representing a callback function for handling drop events.
 */
export type DropCallback = (event: DropEvent) => boolean;

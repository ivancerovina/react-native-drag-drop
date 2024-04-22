import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

/**
 * Props for the Draggable component, used to create draggable elements.
 */
export interface DraggableProps {
  /**
   * The child elements to be rendered inside the Draggable component.
   */
  children?: ReactNode;
  /**
   * The unique identifier for the draggable element.
   */
  id: string | number;
  /**
   * Optional payload data associated with the draggable element.
   */
  payload?: any;
  /**
   * Optional styles to be applied to the draggable element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Optional callback function triggered when dragging starts.
   */
  onDragStart?: () => void;
  /**
   * Optional callback function triggered when dragging ends.
   */
  onDragEnd?: () => void;
  /**
   * Optional callback function triggered when the draggable element's position changes.
   * @param {number} x - The x-coordinate of the draggable element.
   * @param {number} y - The y-coordinate of the draggable element.
   */
  onChange?: (x: number, y: number) => void;
  /**
   * Optional flag to disable dragging of the element.
   */
  disabled?: boolean;
  /**
   * Optional duration in milliseconds to activate dragging after a long press.
   */
  activateAfterLongPress?: number;
  /**
   * Optional function to set the dragging state of the element externally.
   * @param {boolean} state - The dragging state of the element.
   */
  setDragging?: (state: boolean) => void;
}

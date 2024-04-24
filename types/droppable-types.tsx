import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { ElementLayout } from "./dragdropcontext-types";

/**
 * Props for the Droppable component, used to create droppable areas.
 */
export type DroppableProps = {
  /**
   * The child elements to be rendered inside the Droppable component.
   */
  children?: ReactNode;
  /**
   * The unique identifier for the droppable area.
   */
  id: string | number;
  /**
   * Optional payload data associated with the droppable area.
   */
  payload?: any;
  /**
   * Optional styles to be applied to the droppable area.
   */
  style?: StyleProp<ViewStyle>;

  setHovering?: (state: boolean) => void;

  acceptsType?: string[];
}

/**
 * Interface representing the data associated with droppable areas.
 */
export interface DroppableData {
  [key: string | number]: {
    layout: ElementLayout;
    payload?: any;
    acceptsType?: string[],
  };
}

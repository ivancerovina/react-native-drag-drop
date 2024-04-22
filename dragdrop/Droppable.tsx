import { useDragDropContext } from "./DragDropContext";
import Animated from "react-native-reanimated";
import { LayoutChangeEvent } from "react-native";
import { DroppableProps } from "../types/droppable-types";
import { ElementLayout } from "../types/dragdropcontext-types";

/**
 * Component for creating a droppable area that can receive draggable elements.
 * @param {DroppableProps} props - The props for the Droppable component.
 * @param {ReactNode} props.children - The child elements to be rendered inside the Droppable component.
 * @param {string} props.id - The unique identifier for the droppable area.
 * @param {any} props.payload - Optional payload data associated with the droppable area.
 * @param {StyleProp<ViewStyle>} props.style - Optional styles to be applied to the droppable area.
 * @returns {JSX.Element} - Returns a droppable area wrapped in an Animated.View component.
 * @throws {Error} - Throws an error if the id prop is not provided or if there is no parent DragDropContext.
 */
function Droppable({
  children,
  id,
  payload,
  style,
}: DroppableProps): JSX.Element {
  if (id === undefined || id === null) {
    throw new Error("You must set an ID property for your Draggable element");
  }

  const dragDropContext = useDragDropContext();

  if (dragDropContext === null) {
    throw new Error("Draggables must have a parent element DragDropContext");
  }

  const { addDroppable } = dragDropContext;

  const handleLayout = (event: LayoutChangeEvent) => {
    event.target.measure((_x, _y, width, height, pageX, pageY) => {
      const layout: ElementLayout = {
        x: pageX,
        y: pageY,
        height: height,
        width: width,
      };

      addDroppable(id, layout, payload);
    });
  };

  return (
    <Animated.View onLayout={handleLayout} style={style}>
      {children}
    </Animated.View>
  );
}

export default Droppable;

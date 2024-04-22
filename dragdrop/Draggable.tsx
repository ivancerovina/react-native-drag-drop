import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import React from "react";
import * as Haptics from "expo-haptics";
import { useDragDropContext } from "./DragDropContext";
import { DraggableProps } from "../types/draggable-types";
import { DropEvent } from "../types/dragdropcontext-types";

/**
 * Component for creating a draggable element that can be moved within a droppable area.
 * @param {DraggableProps} props - The props for the Draggable component.
 * @param {ReactNode} props.children - The child elements to be rendered inside the Draggable component.
 * @param {string} props.id - The unique identifier for the draggable element.
 * @param {any} props.payload - Optional payload data associated with the draggable element.
 * @param {StyleProp<ViewStyle>} props.style - Optional styles to be applied to the draggable element.
 * @param {Function} props.onDragStart - Optional callback function triggered when dragging starts.
 * @param {Function} props.onDragEnd - Optional callback function triggered when dragging ends.
 * @param {Function} props.onChange - Optional callback function triggered when the draggable element's position changes.
 * @param {boolean} props.disabled - Optional flag to disable dragging of the element.
 * @param {number} props.activateAfterLongPress - Optional duration in milliseconds to activate dragging after a long press.
 * @param {Function} props.setDragging - Optional function to set the dragging state of the element externally.
 * @returns {JSX.Element} - Returns a draggable element wrapped in a GestureDetector and Animated.View components.
 * @throws {Error} - Throws an error if there is no parent DragDropContext.
 */
function Draggable({
  children,
  id,
  payload,
  style = {},
  onDragStart,
  onDragEnd,
  onChange,
  disabled = false,
  activateAfterLongPress,
  setDragging,
}: DraggableProps): JSX.Element {
  const dragDropContext = useDragDropContext();

  if (dragDropContext === null) {
    throw new Error("Droppables must have a parent element DragDropContext");
  }

  const { droppables, onDrop } = dragDropContext;

  const animatedRef = useAnimatedRef();

  // location while dragging
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // handling drop
  const handleDrop = (dropEvent: DropEvent) => {
    if (!onDrop) {
      return;
    }

    const shouldResetTransform = onDrop(dropEvent);

    if (shouldResetTransform) {
      offsetX.value = withSpring(0, {
        duration: 1000,
        dampingRatio: 1,
        stiffness: 1,
      });

      offsetY.value = withSpring(0, {
        duration: 1000,
        dampingRatio: 1,
        stiffness: 1,
      });
    }
  };

  // handling gestures
  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activateAfterLongPress(activateAfterLongPress ?? 0)
    .onStart((event) => {
      if (onDragStart) {
        runOnJS(onDragStart)();
      }

      if (setDragging) {
        runOnJS(setDragging)(true);
      }

      runOnJS(Haptics.impactAsync)();
    })
    .onChange((event) => {
      // TODO Check if there's a zone underneath every time the element moves
      // POSSIBLY add a delay between checks
      if (onChange) {
        const measurement = measure(animatedRef);

        if (measurement === null) {
          throw new Error("onChange listener: Measurement is null");
        }

        runOnJS(onChange)(measurement.pageX, measurement.pageY);
      }

      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    })
    .onFinalize((event) => {
      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }

      if (setDragging) {
        runOnJS(setDragging)(false);
      }

      // finding drop zone
      const measurement = measure(animatedRef);

      if (measurement === null) {
        throw new Error("Measurement of droppable is null");
      }

      const droppableX = measurement.pageX;
      const droppableY = measurement.pageY;
      const droppableWidth = measurement.width;
      const droppableHeight = measurement.height;

      let dropZone = null;

      for (const key in droppables) {
        const droppable = droppables[key];

        const droppableLayout = droppable.layout;

        if (!droppableLayout) {
          throw new Error(
            "Droppable with ID " + key + " doesn't have a layout"
          );
        }

        const zoneX = droppableLayout.x;
        const zoneY = droppableLayout.y;
        const zoneWidth = droppableLayout.width;
        const zoneHeight = droppableLayout.height;

        if (
          (droppableX >= zoneX &&
            droppableX <= zoneX + zoneWidth &&
            droppableY >= zoneY &&
            droppableY <= zoneY + zoneHeight) ||
          (droppableX + droppableWidth >= zoneX &&
            droppableX + droppableWidth <= zoneX + zoneWidth &&
            droppableY >= zoneY &&
            droppableY <= zoneY + zoneHeight) ||
          (droppableX >= zoneX &&
            droppableX <= zoneX + zoneWidth &&
            droppableY + droppableHeight >= zoneY &&
            droppableY + droppableHeight <= zoneY + zoneHeight) ||
          (droppableX + droppableWidth >= zoneX &&
            droppableX + droppableWidth <= zoneX + zoneWidth &&
            droppableY + droppableHeight >= zoneY &&
            droppableY + droppableHeight <= zoneY + zoneHeight)
        ) {
          /*if (dropZone !== null) {
            const prevLayout = droppables[dropZone].layout;
            const prevZoneX = prevLayout.x;
            const prevZoneY = prevLayout.y;
            const prevZoneWidth = prevLayout.width;
            const prevZoneHeight = prevLayout.height;

            TODO Check which zone is the closest if there are multiple drop zones
            TODO Separate calculation into a different function
          }*/

          dropZone = key;
          break;
        }
      }

      if (onDrop) {
        const dropEvent: DropEvent = {
          draggable: {
            id: id,
            payload: payload,
          },

          droppable:
            dropZone !== null
              ? {
                  id: dropZone,
                  payload: droppables[dropZone].payload,
                }
              : null,
        };

        runOnJS(handleDrop)(dropEvent);
      }
    });

  // animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: 1 },
    ],

    opacity: 1,
  }));

  // render
  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={animatedRef} style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default Draggable;

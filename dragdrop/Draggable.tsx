import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import { useDragDropContext } from "./DragDropContext";
import { DraggableProps } from "../types/draggable-types";
import { DropEvent, ElementLayout } from "../types/dragdropcontext-types";
import { findCloser, isInside } from "../utils/math-utils";

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
  type,
  scaleWhileDragging,
}: DraggableProps): JSX.Element {
  const dragDropContext = useDragDropContext();

  if (dragDropContext === null) {
    throw new Error("Droppables must have a parent element DragDropContext");
  }

  const { droppables, onDrop, dropCheckOption } = dragDropContext;

  const animatedRef = useAnimatedRef();

  // location while dragging
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const [internalDragging, setInternalDragging] = useState(false);

  const [previousState, setPreviousState] = useState({ x: 0, y: 0 });

  // handling drop

  const handleDrop = (draggableLayout: ElementLayout) => {
    let dropZone = null;

    for (const key in droppables) {
      const droppable = droppables[key];

      // type checking
      if (
        droppable.acceptsType &&
        type &&
        !droppable.acceptsType.includes(type)
      ) {
        continue;
      }

      const droppableLayout = droppable.layout;

      if (!droppableLayout) {
        throw new Error("Droppable with ID " + key + " doesn't have a layout");
      }

      if (isInside(draggableLayout, droppableLayout)) {
        if (dropCheckOption === "closest") {
          if (dropZone !== null) {
            const prevZoneLayout = droppables[dropZone].layout;
            const closer = findCloser(
              draggableLayout,
              prevZoneLayout,
              droppable.layout
            );

            if (closer !== prevZoneLayout) {
              dropZone = key;
            }
          } else {
            dropZone = key;
          }
        } else {
          dropZone = key;
          break;
        }
      }
    }

    // triggering event
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

      // deciding whether or not to return the element back into it's
      // original position
      const shouldResetTransform = onDrop(dropEvent);

      if (shouldResetTransform) {
        const options = {
          duration: 1000,
          dampingRatio: 1,
          stiffness: 1,
        };

        offsetX.value = withSpring(previousState.x, options);
        offsetY.value = withSpring(previousState.y, options);
      } else {
        setPreviousState({ x: offsetX.value, y: offsetY.value });
      }
    }
  };

  // handling gestures
  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activateAfterLongPress(activateAfterLongPress ?? 0)
    .onStart((event) => {
      runOnJS(setInternalDragging)(true);
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
      // POSSIBLY add a delay between checks for performance
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
      runOnJS(setInternalDragging)(false);

      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }

      if (setDragging) {
        runOnJS(setDragging)(false);
      }

      const draggableMeasurement = measure(animatedRef);

      if (draggableMeasurement === null) {
        throw new Error("Measurement of droppable is null");
      }

      const draggableLayout: ElementLayout = {
        x: draggableMeasurement.pageX,
        y: draggableMeasurement.pageY,
        width: draggableMeasurement.width,
        height: draggableMeasurement.height,
      };

      runOnJS(handleDrop)(draggableLayout);
    });

  // animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      {
        scale: internalDragging
          ? withSpring(scaleWhileDragging ?? 1)
          : withSpring(1),
      },
    ],
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

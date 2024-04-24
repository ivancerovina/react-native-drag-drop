import Draggable from "./dragdrop/Draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { DragDropProvider } from "./dragdrop/DragDropContext";
import Droppable from "./dragdrop/Droppable";
import { DropEvent } from "./types/dragdropcontext-types";
import Constants from "expo-constants";

function App() {
  const handleDrop = (event: DropEvent) => {
    if (event.droppable !== null) {
      console.log("Dropped on " + event.droppable.id);
    } else {
      console.log("Dropped on nothing");
    }

    return event.droppable === null;
  };

  const draggableItems = [
    {
      id: 1,
      name: "FRUIT",
      initialPosition: [0, 0],
      scaleWhileDragging: 1.1
    },
    {
      id: 2,
      name: "FRUIT2",
      initialPosition: [100, 0],
      scaleWhileDragging: 1.1
    },
    {
      id: 3,
      name: "FRUIT3",
      initialPosition: [200, 0],
      scaleWhileDragging: 1.1
    },
    {
      id: 4,
      name: "FRUIt5",
      initialPosition: [200, 0],
      scaleWhileDragging: 1.1
    },
  ]

  return (
    <GestureHandlerRootView style={styles.container}>
      <DragDropProvider onDrop={handleDrop} dropCheckOption={"closest"}>
        {
          draggableItems?.map(item => (
            <Draggable
              id={item?.id}
              type={"fruit"}
              activateAfterLongPress={100}
              style={styles.draggable}
              scaleWhileDragging={item?.scaleWhileDragging}
            >
              <Text>{item?.name}</Text>
            </Draggable>
          ))
        }
        {/* <Draggable
          id={"drag-1"}
          type={"fruit"}
          activateAfterLongPress={100}
          style={styles.draggable}
          scaleWhileDragging={1.1}
        >
          <Text>FRUIT</Text>
        </Draggable> */}
        <Droppable
          acceptsType={["fruit"]}
          id={"drop-1"}
          style={styles.droppable1}
        >
          <Text>Fruits</Text>
        </Droppable>
        <Droppable id={"drop-2"} style={styles.droppable2} acceptsType={['frudit']}>
          <Text style={{ color: "white" }}>Vegetables</Text>
        </Droppable>
      </DragDropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingTop: Constants.statusBarHeight,
    height: "100%",
    width: "100%",
  },

  draggable: {
    backgroundColor: "green",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,

    top: 50,
    left: "30%",
    position: "absolute",
    borderWidth: 1,
    borderColor: "green",
    zIndex: 5,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  droppable1: {
    marginTop: 200,
    width: "100%",
    height: 200,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  droppable2: {
    marginTop: 10,
    width: "100%",
    height: 200,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;

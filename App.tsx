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

  return (
    <GestureHandlerRootView style={styles.container}>
      <DragDropProvider onDrop={handleDrop}>
        <Draggable
          id={"drag-1"}
          type={"fruit"}
          activateAfterLongPress={100}
          style={styles.draggable}
          scaleWhileDragging={1.1}
        >
          <Text>FRUIT</Text>
        </Draggable>
        <Droppable
          acceptsType={["fruit"]}
          id={"drop-1"}
          style={styles.droppable1}
        >
          <Text>Fruits</Text>
        </Droppable>
        <Droppable id={"drop-2"} style={styles.droppable2}>
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

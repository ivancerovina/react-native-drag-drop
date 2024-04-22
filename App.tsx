import Draggable from "./dragdrop/Draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";
import { DragDropProvider } from "./dragdrop/DragDropContext";
import Droppable from "./dragdrop/Droppable";
import { DropEvent } from "./types/dragdropcontext-types";
import Constants from "expo-constants";

function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  const handleDrop = (event: DropEvent) => {
    return event.droppable === null;
  };

  return (
    <GestureHandlerRootView>
      <DragDropProvider onDrop={handleDrop}>
        { /* You can add draggables and droppables here */ }
      </DragDropProvider>
    </GestureHandlerRootView>
  );
}

export default App;

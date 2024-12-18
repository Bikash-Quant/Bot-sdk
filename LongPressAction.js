import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Higher-Order Component to add long press functionality
export const withLongPressActions = (WrappedComponent) => {
  const WithLongPressActions = (props) => {
    const [showActions, setShowActions] = useState(false);

    const handleLongPress = () => {
      setShowActions(true);
    };

    const handleHideActions = () => {
      setShowActions(false);
    };

    return (
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        onPress={handleHideActions} // Hide actions on press
      >
        {/* Render the original component */}
        <View>
          <WrappedComponent {...props} />
          {/* Conditionally show the action container */}
          {showActions && (
            <View
              style={{
                maxWidth: "80%",
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => console.log("Liked!")}>
                  <Text style={styles.actionButton}>👍</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Disliked!")}>
                  <Text style={styles.actionButton}>👎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Play Pressed!")}>
                  <Text style={styles.actionButton}>▶️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  WithLongPressActions.displayName = "WithLongPressActions"; // Add display name

  return WithLongPressActions;
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 1,
    marginTop: 1,
    padding: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    width: "auto",
  },
  actionButton: {
    fontSize: 18,
    marginHorizontal: 5,
  },
});

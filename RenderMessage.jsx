import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TypingText from "./TypingText";

export const RenderMessage = ({ message, mergedConfig, onTyping }) => {
  const isBot = message.sender === "bot";
  const [showActions, setShowActions] = useState(false);

  const handleLongPress = () => {
    setShowActions(true);
  };

  const handleHideActions = () => {
    setShowActions(false);
  };

  const styles = StyleSheet.create({
    messageBubble: {
      maxWidth: "80%",
      borderRadius: 12,
      marginVertical: 5,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    botBubble: {
      alignSelf: "flex-start",
      color: "#000",
      backgroundColor: "#fff",
    },
    userBubble: {
      alignSelf: "flex-end",
      color: "#fff",
      backgroundColor: "#000",
    },
    botText: {
      color: "#000",
    },
    userText: {
      color: "#fff",
    },
    messageText: {
      fontSize: 16,
    },
    actionContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
      gap: 1,
      marginTop: 1,
      padding: 5,
      backgroundColor: "#f2f2f2",
      borderRadius: 20,
      width: "auto",
      position: "absolute",
      zIndex: 5,
    },
    actionButton: {
      fontSize: 18,
      marginHorizontal: 5,
    },
  });

  // if (message.type === "card") {
  //   return (
  //     <View
  //       style={{
  //         marginVertical: 10,
  //         marginHorizontal: 5,
  //         borderRadius: 10,
  //         backgroundColor: "white",
  //         shadowColor: "#000",
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowOpacity: 0.25,
  //         shadowRadius: 3.84,
  //         elevation: 5,
  //         maxWidth: "80%",
  //       }}
  //     >
  //       <Image
  //         source={carImage}
  //         style={{ width: "100%", height: 150, borderRadius: 10 }}
  //       />
  //       <View style={{ padding: 10 }}>
  //         <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
  //           Car booking card
  //         </Text>
  //         <Text style={{ fontSize: 16, color: "black" }}>Skoda slavia </Text>
  //         <Text style={{ fontSize: 14, color: "gray" }}>
  //           Lorem Ipsum is simply dummy text of the printing and typesetting
  //           industry. Lorem Ipsum has been the industry's standard dummy text
  //           ever since the 1500s, when
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }
  let response = "";
  if (message.typing) {
    response = (
      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <TypingText
          msg={message.text}
          onTyping={onTyping}
          // color={mergedConfig.theme.primaryColor}
        />
      </View>
    );
  } else {
    response = (
      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text
          style={[styles.messageText, isBot ? styles.botText : styles.userText]}
        >
          {message.text}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      onPress={handleHideActions} // Hide actions on press
    >
      {/* Render the original component */}
      <View style={{ position: "relative" }}>
        {response}
        {/* Conditionally show the action container */}
        {isBot && showActions && (
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

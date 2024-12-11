import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

const TypingText = ({ msg, keyTyping = true }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    if (keyTyping) {
      // Reset the typing animation when keyTyping is true
      setDisplayedText("");
      setTypingIndex(0);

      // Start typing the message letter by letter
      const typingInterval = setInterval(() => {
        setTypingIndex((prevIndex) => {
          if (prevIndex < msg.length) {
            setDisplayedText((prevText) => prevText + msg[prevIndex]);
            return prevIndex + 1; // Increment the index
          } else {
            clearInterval(typingInterval); // Stop the interval when the message is fully typed
            return prevIndex; // Return the current index to avoid further updates
          }
        });
      }, 1); // Adjust the speed by changing the interval time (in ms)

      // Cleanup the interval on component unmount or when typing stops
      return () => clearInterval(typingInterval);
    } else {
      // If keyTyping is false, show the full message immediately
      setDisplayedText(msg);
    }
  }, [keyTyping, msg]);

  return (
    <Text style={[styles.messageText, styles.botText]}>{displayedText}</Text>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  botText: {
    color: "black",
  },
  userText: {
    color: "green",
  },
});

export default TypingText;

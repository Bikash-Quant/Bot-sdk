import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

const TypingText = ({ msg, keyTyping = true, onTyping = () => {} }) => {
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
            return prevIndex + 1;
          } else {
            clearInterval(typingInterval);
            return prevIndex;
          }
        });
      }, 50); // Adjust the speed by changing the interval time (in ms)

      // Cleanup the interval on component unmount or when typing stops
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(msg);
    }
  }, [keyTyping, msg]);

  useEffect(() => {
    const txt = msg === displayedText ? "" : displayedText;
    onTyping(txt);
  }, [displayedText]);

  return (
    <Text style={[styles.messageText, styles.botText]} className="w-auto">
      {displayedText}
    </Text>
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

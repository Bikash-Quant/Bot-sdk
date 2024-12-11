import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  PanResponder,
  Animated,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import Avatar from "./Avatar";
import closeIcon from "./assets/icons/close.png";
import attachIcon from "./assets/icons/attachment.png";
import sendIcon from "./assets/icons/send.png";
import TypingText from "./TypingText";
import carImage from "./assets/images/car.png";
import { useStreamResponse } from "./hooks";

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzNjI4Y2U5Yi0yODA5LTRhYTEtOTc5Ny02MzMyNWQzZGE1N2EiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiMzYyOGNlOWItMjgwOS00YWExLTk3OTctNjMzMjVkM2RhNTdhIiwiYXBwX2NvZGUiOiIxaEtBZU1PVkJJNUY2NkZPIiwiZW5kX3VzZXJfaWQiOiI4YzBiNjdmOS1jYzIzLTRkNTctODllOC1kMjc0ZTRjYjZmZWIifQ.6YYdRRh4ivboXUVxyt_cM96-9WHZ43_duZudPcxC4jA";

const defaultConfig = {
  theme: {
    primaryColor: "#007bff",
    backgroundColor: "#f4f4f4",
    textColor: "#000000",
    botBubbleColor: "#e6e6e6",
    userBubbleColor: "#007bff",
  },
  apiEndpoint: "https://app.eng.quant.ai/api/chat-messages",
  apiToken: token,
  botName: "ChatBot",
};

const FloatingChatbot = ({ config = {} }) => {
  const { fullMessage, fetchStreamingResponse, isStreaming, resetMessage } =
    useStreamResponse();

  // Merge default and provided configurations
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    theme: { ...defaultConfig.theme, ...config.theme },
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! Welcome to Telco. I'm Quant. How can I help you today?",
      sender: "bot",
      typing: false,
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Draggable Icon Position
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const sendMessage = async () => {
    if (!inputText.trim() || isStreaming) return;

    setMessages((prev) => [
      ...prev,
      {
        text: inputText,
        sender: "user",
        typing: false,
        type: "text",
      },
    ]);

    setInputText("");

    fetchStreamingResponse({
      inputText,
      apiToken: mergedConfig.apiToken,
      apiEndpoint: mergedConfig.apiEndpoint,
    });
  };

  useEffect(() => {
    if (fullMessage) {
      setMessages((prev) => [
        ...prev,
        {
          text: fullMessage,
          sender: "bot",
          typing: true,
          type: "text",
        },
      ]);
      resetMessage();
    }
  }, [fullMessage]);

  const renderMessage = (message) => {
    const isBot = message.sender === "bot";

    if (message.type === "card") {
      return (
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 5,
            borderRadius: 10,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxWidth: "80%",
          }}
        >
          <Image
            source={carImage}
            style={{ width: "100%", height: 150, borderRadius: 10 }}
          />
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              Car booking card
            </Text>
            <Text style={{ fontSize: 16, color: "black" }}>Skoda slavia </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when
            </Text>
          </View>
        </View>
      );
    }

    if (message.typing) {
      return (
        <View
          style={[
            styles.messageBubble,
            isBot ? styles.botBubble : styles.userBubble,
            {
              backgroundColor: isBot
                ? mergedConfig.theme.botBubbleColor
                : mergedConfig.theme.userBubbleColor,
            },
          ]}
        >
          <TypingText
            msg={message.text}
            // color={mergedConfig.theme.primaryColor}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
          {
            backgroundColor: isBot
              ? mergedConfig.theme.botBubbleColor
              : mergedConfig.theme.userBubbleColor,
          },
        ]}
      >
        <Text
          style={[styles.messageText, { color: mergedConfig.theme.textColor }]}
        >
          {message.text}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    floatingIcon: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 62,
      height: 56,
      borderRadius: 30,
      backgroundColor: "gray",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: mergedConfig.theme.backgroundColor,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      backgroundColor: mergedConfig.theme.primaryColor,
      paddingTop: 20,
      zIndex: 9,
    },
    logoContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 1,
      flex: 1,
    },
    closeButton: {
      color: "white",
      fontSize: 18,
    },
    chatContainer: {
      flex: 1,
      padding: 10,
      paddingBottom: 20,
      overflow: "auto",
      backgroundColor: "rgb(221, 240, 215)",
    },
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: mergedConfig.theme.primaryColor,
    },
    inputContainer: {
      flexDirection: "column",
      padding: 4,
      backgroundColor: "#fff",
      borderRadius: 12,
    },
    inputWrapper: {
      height: 40,
      borderRadius: 12,
    },
    input: {
      flex: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      height: "100%",
      width: "100%",
    },
    actionButtonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    actionButtonLeftContainer: {
      display: "flex",
      flex: 1,
      justifyContent: "start",
    },
    messageBubble: {
      maxWidth: "80%",
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
    },
    botBubble: {
      alignSelf: "flex-start",
    },
    userBubble: {
      alignSelf: "flex-end",
    },
    messageText: {
      fontSize: 16,
    },
    inputButton: {
      padding: 8,
    },
    sendButton: {
      padding: 8,
    },
  });

  useEffect(() => {
    if (isStreaming) {
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.typing)
          .concat({
            text: "Thinking ...",
            sender: "bot",
            typing: true,
            type: "text",
          })
      );
    } else {
      if (fullMessage) {
        setMessages((prev) =>
          prev
            .filter((msg) => !msg.typing)
            .filter((msg) => msg.text !== "Thinking ...")
            .concat({
              text: fullMessage,
              sender: "bot",
              typing: true,
              type: "text",
            })
        );
      }
    }
  }, [fullMessage, isStreaming]);

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingIcon,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={{
            height: 54,
            width: 60,
            borderRadius: 9999,
          }}
        >
          <Avatar
            source={mergedConfig.theme.avatarImage}
            height={54}
            width={62}
            borderRadius={9999}
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Avatar
                  source={mergedConfig.theme.avatarImage}
                  height={44}
                  width={50}
                  borderRadius={9999}
                />
                {mergedConfig.botName && (
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {mergedConfig.botName}
                  </Text>
                )}
                {mergedConfig.botImage && (
                  <Avatar
                    source={mergedConfig.botImage}
                    height={30}
                    width={180}
                    borderRadius={1}
                  />
                )}
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Avatar source={closeIcon} height={20} width={20} />
              </TouchableOpacity>
            </View>

            {/* <LinearGradient
            colors={["rgb(255, 255, 255)", "rgb(221, 240, 215)"]} // Set gradient colors
            start={{ x: 0, y: 0 }} // Starting point of gradient (top-left)
            end={{ x: 0, y: 1 }} // Ending point of gradient (bottom-left)
            locations={[0, 0.523]} // Set the percentage for color stops (52.3%)
            style={styles.chatContainer}
          > */}
            <View style={{ flex: 1, overflow: "auto" }}>
              <ScrollView
                style={styles.chatContainer}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {messages.map((msg, index) => (
                  <React.Fragment key={index}>
                    {renderMessage(msg)}
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>
            {/* </LinearGradient> */}

            {/* <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                style={styles.input}
              />
              <TouchableOpacity onPress={sendMessage} disabled={isLoading}>
                <Text style={{ color: mergedConfig.theme.primaryColor }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View> */}
            <View
              style={[{ backgroundColor: "rgb(221, 240, 215)", padding: 8 }]}
            >
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask me anything..."
                    placeholderTextColor="#999"
                    onSubmitEditing={sendMessage}
                    focusable
                  />
                </View>

                <View style={styles.actionButtonContainer}>
                  <View style={styles.actionButtonLeftContainer}>
                    <TouchableOpacity style={styles.inputButton}>
                      <Avatar
                        height={24}
                        width={24}
                        borderRadius={1}
                        source={attachIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                  >
                    <Avatar
                      height={24}
                      width={24}
                      borderRadius={1}
                      source={sendIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default FloatingChatbot;

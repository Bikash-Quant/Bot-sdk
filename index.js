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
import sendActiveIcon from "./assets/icons/sendActive.png";
import { useStreamResponse } from "./hooks";
import { RenderMessage } from "./RenderMessage";

const defaultConfig = {
  theme: {
    primaryColor: "#007bff",
    backgroundColor: "#f4f4f4",
    textColor: "#000000",
    botBubbleColor: "#e6e6e6",
    userBubbleColor: "#007bff",
  },
  apiEndpoint: "https://app.eng.quant.ai/api/chat-messages",
  apiToken: "",
  botName: "ChatBot",
};

const FloatingChatbot = ({ config = {} }) => {
  const scrollViewRef = useRef(null);
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
  const [isTyping, setIsTyping] = useState("");

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

    setMessages((prev) =>
      [
        ...prev,
        {
          text: inputText,
          sender: "user",
          typing: false,
          type: "text",
        },
      ].map((x) => ({ ...x, typing: false }))
    );

    setInputText("");

    fetchStreamingResponse({
      inputText,
      apiToken: mergedConfig.apiToken,
      apiEndpoint: mergedConfig.apiEndpoint,
    });
  };

  const isSendButtonActive = !isStreaming && inputText.trim();

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
      display: "flex",
      flexDirection: "column",
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
    inputButton: {
      padding: 8,
    },
    sendButton: {
      padding: 4,
      backgroundColor: isSendButtonActive ? "#101828" : "#fff",
      borderRadius: "50%",
    },
  });

  useEffect(() => {
    if (isStreaming) {
      setMessages((prev) =>
        prev
          // .filter((msg) => !msg.typing)
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
            // .filter((msg) => !msg.typing)
            .filter((msg) => msg.text !== "Thinking ...")
            .concat({
              text: fullMessage,
              sender: "bot",
              typing: true,
              type: "text",
            })
        );
        resetMessage();
      }
    }
  }, [fullMessage, isStreaming]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    if (isTyping) {
      scrollToBottom(); // Scroll to the bottom when streaming
    }
  }, [isTyping]);

  if (messages.length) {
    scrollToBottom();
  }

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
          onPressIn={() => setIsOpen(true)}
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
        <View style={styles.modalContainer}>
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

            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {messages.map((msg, index) => (
                <React.Fragment key={index}>
                  <RenderMessage
                    message={msg}
                    onTyping={(msg) => setIsTyping(msg)}
                    mergedConfig={mergedConfig}
                  />
                </React.Fragment>
              ))}
            </ScrollView>

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
                    disabled={isStreaming}
                  >
                    <Avatar
                      height={24}
                      width={24}
                      borderRadius={1}
                      source={isSendButtonActive ? sendActiveIcon : sendIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

export default FloatingChatbot;

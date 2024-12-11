import { useState } from "react";

export const useStreamResponse = () => {
  const [fullMessage, setFullMessage] = useState("");

  const handleStreamResponse = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.event === "agent_message" && data.answer) {
        setFullMessage((prevMessage) => prevMessage + data.answer);
      }
    } catch (error) {
      console.error("Error parsing stream response:", error);
    }
  };

  const resetMessage = () => {
    setFullMessage("");
  };

  return {
    fullMessage,
    handleStreamResponse,
    resetMessage,
  };
};

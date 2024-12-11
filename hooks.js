export const useStreamResponse = () => {
  const [fullMessage, setFullMessage] = useState("");

  const handleStreamResponse = (event) => {
    try {
      // Parse the event data
      const data = JSON.parse(event.data);

      // Check if the event is an agent message
      if (data.event === "agent_message" && data.answer) {
        // Append the new part of the answer to the existing message
        setFullMessage((prevMessage) => prevMessage + data.answer);
      }
    } catch (error) {
      console.error("Error parsing stream response:", error);
    }
  };

  // Reset the full message if needed
  const resetMessage = () => {
    setFullMessage("");
  };

  return {
    fullMessage,
    handleStreamResponse,
    resetMessage,
  };
};

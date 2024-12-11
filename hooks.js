import { useState, useCallback } from "react";
import axios from "axios";

export const useStreamResponse = () => {
  const [fullMessage, setFullMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const resetMessage = useCallback(() => {
    setFullMessage("");
  }, []);

  const fetchStreamingResponse = useCallback(
    async ({ inputText, apiToken, apiEndpoint }) => {
      // Reset previous state
      setIsStreaming(true);
      setFullMessage("");
      console.log("apiEndpoint:", apiEndpoint);
      console.log("apiToken:", apiToken);
      console.log("inputText:", inputText);

      try {
        const response = await axios({
          method: "post",
          url: apiEndpoint,
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          data: {
            channel: "web",
            conversation_id: "",
            inputs: {},
            query: inputText,
            response_mode: "streaming",
          },
          responseType: "stream",
          transformResponse: [
            function (data) {
              // Split the response into individual events
              const events = data
                .split("\n")
                .filter((event) => event.startsWith("data: "));

              // Process each event
              events.forEach((eventData) => {
                try {
                  // Remove 'data: ' prefix
                  const cleanData = eventData.replace("data: ", "").trim();

                  // Parse the JSON
                  const parsedData = JSON.parse(cleanData);

                  // Check for agent_message event
                  if (
                    parsedData.event === "agent_message" &&
                    parsedData.answer
                  ) {
                    setFullMessage((prev) => prev + parsedData.answer);
                  }
                } catch (parseError) {
                  console.error("Error parsing event:", parseError);
                }
              });

              return data;
            },
          ],
        });
      } catch (error) {
        console.error("Streaming error:", error);
      }
      setIsStreaming(false);
    },
    []
  );

  return {
    fullMessage,
    fetchStreamingResponse,
    resetMessage,
    isStreaming,
  };
};

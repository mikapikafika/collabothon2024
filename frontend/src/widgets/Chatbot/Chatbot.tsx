/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Paper, Typography, IconButton, InputBase, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { WidgetContainer } from "../../components/WidgetContainer/WidgetContainer";
import {
  chatbotHeaderStyle,
  chatWindowStyle,
  dialogBubbleStyle,
  dialogLineContainerStyle,
  iconButtonStyle,
  userInputStyle,
} from "./Chatbot.style";
import { IRecommendedProduct } from "../../hooks/useFetchProducts";
import Dots from "../../components/Dots/Dots";

type IProps = {
  data: IRecommendedProduct[] | undefined;
  isChatbotVisible: boolean;
};

interface IMessage {
  text?: string;
  isUser: boolean;
  type?: string;
}

const mockConversation: IMessage[] = [
  { text: "Hello! How can I assist you today?", isUser: false },
  { text: "What are the current loan offers?", isUser: true },
  { text: "We have home loans, car loans, and personal loans available.", isUser: false },
  { text: "Tell me more about the home loan.", isUser: true },
  { text: "Our home loan offers the best interest rates in the market.", isUser: false },
];

export const Chatbot = ({ data, isChatbotVisible }: IProps) => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>(mockConversation);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isChatActive) {
      const fetchData = async () => {
        const ids = Array.isArray(data) && data.length > 0 ? data.map((product) => product.id) : [];
        try {
          await axios.post(`http://localhost:8080/api/v1/chatbot/start-chat`, { ids });
          setIsChatActive(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [data, isChatActive]);

  const handleSendMessage = useCallback(async () => {
    if (inputValue.trim() !== "") {
      try {
        setLoading(true);

        setMessages((prevMessages) => [...prevMessages, { text: inputValue, isUser: true }]);
        setMessages((prevMessages) => [...prevMessages, { type: "loading", isUser: false }]);

        const response = await axios.post(`http://localhost:8080/api/v1/chatbot/send-message`, { message: inputValue });

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { text: response.data.response, isUser: false },
        ]);

        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [inputValue, setMessages, setInputValue]);

  return (
    <WidgetContainer width={"30rem"} height={"40rem"} bgColor="#fbfbfe">
      <Box css={chatbotHeaderStyle}>
        <Typography variant="h5" css={{ fontWeight: "bold" }}>
          Chatbot
        </Typography>
      </Box>
      <Box className="messages-container" css={chatWindowStyle} style={{ position: "relative" }}>
        {messages.map((message, index) => (
          <Box key={index} css={dialogLineContainerStyle(message.isUser)}>
            <Paper elevation={0} css={dialogBubbleStyle(message.isUser)}>
              {message.type === "loading" ? <Dots /> : message.text}
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box css={userInputStyle}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={!isChatActive || isLoading}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          disabled={!isChatActive || isLoading}
          css={iconButtonStyle}
          onClick={handleSendMessage}
          aria-label="send"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </WidgetContainer>
  );
};

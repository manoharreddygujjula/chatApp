import React, { useState, useEffect ,useRef} from 'react';
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from './miscellaneous/ProfileModal';
import ScrollableChat from './ScrollableChat';
import { getSender, getSenderFull } from '../config/ChatLogics';
import axios from 'axios';
import { io } from 'socket.io-client'; // Add semicolon

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const toast = useToast(); // Initialize toast

  // Socket initialization
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Logic for typing
  };

  return (
    <>
      {selectedChat ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100vh"
          width="100%"
          padding={3}
          background="#E8E8E8"
          borderRadius="lg"
          overflowY="hidden"
        >
          {/* Chat header */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            paddingX={2}
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
              </>
            )}
          </Text>

          {/* Chat messages */}
          <Box
            flex="1"
            overflowY="scroll"
            marginBottom={3}
            paddingRight={2}
          >
            {loading ? (
              <Spinner size="xl" width={20} height={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
          </Box>

          {/* Input field */}
          <FormControl
            onKeyDown={sendMessage}
            isRequired
            marginTop={3}
          >
            <Input
              variant="filled"
              background="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Text fontSize="3xl" paddingBottom={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

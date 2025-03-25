// ScrollableChat.js
import { Avatar } from "@chakra-ui/react"; // Importing from Chakra UI's main package
import { Tooltip } from "@chakra-ui/react"; // Importing Tooltip from the main package
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics"; // Utility functions for message display logic
import { ChatState } from "../Context/ChatProvider"; // Context for accessing user state

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState(); // Fetch the user from context

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {/* If it's the same sender or the last message, display the Avatar */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic} // User profile picture
                />
              </Tooltip>
            )}
            {/* Message bubble */}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`, // Different colors for user vs other messages
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content} {/* Display the message content */}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

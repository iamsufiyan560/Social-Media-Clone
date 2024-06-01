import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// import React, { useRef } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";

import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { IoMdArrowBack } from "react-icons/io";

const MessageContainer = ({ onBackButtonClick }) => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const handleBackButtonClick = () => {
    setSelectedConversation({ _id: "" });
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId]);

  return (
    <>
      <Flex
        flex="70"
        bg={useColorModeValue("#CBF6F6", "#0E5050")}
        borderRadius={"15"}
        p={2}
        flexDirection={"column"}
        border="3px solid #4F9D69"
      >
        {/* Message header */}
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
          <IoMdArrowBack onClick={handleBackButtonClick} size={"25"} />
          <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation.username}{" "}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>

        <Divider />

        <Flex
          flexDir={"column"}
          gap={4}
          my={4}
          p={2}
          height={"400px"}
          className="hide-scrollbar"
        >
          {loadingMessages &&
            [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={"column"} gap={2}>
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))}

          {!loadingMessages &&
            messages.map((message) => (
              <Flex
                key={message._id}
                direction={"column"}
                // ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
              >
                <Message
                  message={message}
                  ownMessage={currentUser._id === message.sender}
                />
              </Flex>
            ))}
        </Flex>

        <MessageInput setMessages={setMessages} />
      </Flex>
    </>
  );
};

export default MessageContainer;

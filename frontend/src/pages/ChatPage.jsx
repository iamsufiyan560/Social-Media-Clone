import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import responsiveAtom from "../atoms/responsiveAtom";

const ChatPage = () => {
  const [isMobile, setIsMobile] = useRecoilState(responsiveAtom);
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const [errorMessage, setErrorMessage] = useState("");
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Clear error message when the user starts typing
    if (value.trim()) {
      setErrorMessage("");
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      // If the input is empty or only contains whitespace
      setErrorMessage("Please enter a User Name.");
      return;
    }

    setErrorMessage("");
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);

      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", "Network error. Please try again.", "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <>
      <Box
        mt={-5}
        backgroundImage="url('/3.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        h={"84vh"}
        position={"absolute"}
        left={"50%"}
        w={{ base: "90%", md: "80%", lg: "750px" }}
        p={4}
        transform={"translateX(-50%)"}
        // border="3px solid #4F9D69"
        borderRadius={15}
      >
        <Flex
          gap={4}
          flexDirection={{ base: "column", md: "row" }}
          maxW={{
            sm: "400px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Flex
            display={!isMobile ? { base: "none", md: "flex" } : "flex"}
            flex={30}
            gap={2}
            flexDirection={"column"}
            maxW={{ sm: "250px", md: "full" }}
            mx={"auto"}
          >
            <Text fontWeight={700} color={useColorModeValue("white", "white")}>
              Your Conversations
            </Text>
            <form onSubmit={handleConversationSearch}>
              <Flex flexDirection="column" gap={2}>
                <Flex alignItems={"center"} gap={2}>
                  <Input
                    bg={"#808080"}
                    fontWeight={500}
                    border="2px solid #4F9D69"
                    placeholder="Search for a user"
                    _placeholder={{
                      color: "white", // Change placeholder color here
                    }}
                    onChange={handleInputChange}
                    value={searchText}
                    color={"white"}
                  />

                  <Button
                    bg={useColorModeValue("white", "white")}
                    size={"sm"}
                    type="submit"
                    isLoading={searchingUser}
                  >
                    <SearchIcon color={"black"} />
                  </Button>
                </Flex>
                {errorMessage && (
                  <Text color="red" fontWeight={"600"} fontSize="xm">
                    {errorMessage}
                  </Text>
                )}
              </Flex>
            </form>

            {loadingConversations &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton bg={"black"} h={"10px"} w={"45%"} />
                    <Skeleton bg={"black"} h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))}

            {!loadingConversations &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                  conversation={conversation}
                />
              ))}
          </Flex>

          {!selectedConversation._id && (
            <Flex
              flex={70}
              borderRadius={"md"}
              p={2}
              flexDir={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"400px"}
              display={{ base: "none", md: "flex" }}
              m="auto"
            >
              <GiConversation color="white" size={100} />
              <Text color={"white"} fontSize={20}>
                Select a conversation to start messaging
              </Text>
            </Flex>
          )}
          {selectedConversation._id && <MessageContainer />}
        </Flex>
      </Box>
    </>
  );
};

export default ChatPage;

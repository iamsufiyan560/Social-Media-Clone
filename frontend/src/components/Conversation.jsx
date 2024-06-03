import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import responsiveAtom from "../atoms/responsiveAtom";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();
  const [isMobile, setIsMobile] = useRecoilState(responsiveAtom);

  const handleClickUser = () => {
    setSelectedConversation({
      _id: conversation._id,
      userId: user._id,
      userProfilePic: user.profilePic,
      username: user.username,
      mock: conversation.mock,
    });

    setIsMobile(false);
  };

  return (
    <>
      <Flex
        mb={1}
        gap={4}
        alignItems={"center"}
        p={"1"}
        _hover={{
          cursor: "pointer",
          bg: useColorModeValue("gray.600", "gray.dark"),
          color: "white",
        }}
        borderRadius={"md"}
        onClick={handleClickUser}
        // onClick={() =>
        //   setSelectedConversation({
        //     _id: conversation._id,
        //     userId: user._id,
        //     userProfilePic: user.profilePic,
        //     username: user.username,
        //     mock: conversation.mock,
        //   })
        // }
        bg={
          selectedConversation?._id === conversation._id
            ? colorMode === "light"
              ? "gray.400"
              : "gray"
            : ""
        }
      >
        <WrapItem>
          <Avatar
            size={{
              base: "xs",
              sm: "sm",
              md: "md",
            }}
            src={user.profilePic}
          >
            {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
          </Avatar>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
          <Text fontWeight="700" display={"flex"} alignItems={"center"}>
            {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {currentUser._id === lastMessage.sender ? (
              <Box color={lastMessage.seen ? "blue.400" : ""}>
                <BsCheck2All size={16} />
              </Box>
            ) : (
              ""
            )}

            {lastMessage.text.length > 18
              ? lastMessage.text.substring(0, 18) + "..."
              : lastMessage.text || <BsFillImageFill size={16} />}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default Conversation;

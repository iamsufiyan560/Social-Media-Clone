import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { format } from "date-fns";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import useShowToast from "../hooks/useShowToast";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const messageTime = format(new Date(message.createdAt), "HH:mm");
  const [imgLoaded, setImgLoaded] = useState(false);
  const showToast = useShowToast();

  const downloadImage = async () => {
    try {
      const response = await fetch(message.img);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = message.img.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast("Failed to download image:", "error");
      return;
    }
  };
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
              <Text
                pl={1}
                fontSize={"xs"}
                color={"gray.500"}
                alignSelf={"flex-end"}
              >
                {messageTime}
              </Text>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                hidden
                onLoad={() => setImgLoaded(true)}
              />
              <Skeleton w={"200px"} h={"200px"} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"} position="relative">
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
              <IconButton
                aria-label="Download Image"
                icon={<FiDownload />}
                onClick={downloadImage}
                position="absolute"
                top="8px"
                right="8px"
                size="sm"
                colorScheme="teal"
              />
            </Flex>
          )}

          <Avatar src={user.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
          {message.text && (
            <Flex bg={"gray.400"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"black"}>{message.text}</Text>
              <Text
                pl={1}
                fontSize={"xs"}
                color={"gray.500"}
                alignSelf={"flex-end"}
              >
                {messageTime}
              </Text>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                hidden
                onLoad={() => setImgLoaded(true)}
              />
              <Skeleton w={"200px"} h={"200px"} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"} position="relative">
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <IconButton
                aria-label="Download Image"
                icon={<FiDownload />}
                onClick={downloadImage}
                position="absolute"
                top="8px"
                left="8px"
                size="sm"
                colorScheme="teal"
              />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;

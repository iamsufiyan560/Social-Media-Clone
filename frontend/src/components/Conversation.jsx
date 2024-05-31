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
} from "@chakra-ui/react";
import React from "react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";

const Conversation = () => {
  const lastMessage =
    " Hii Kaise ho bhailog aaj milte kya Hii Kaise ho bhailog aaj milteHii Kaise ho bhailog aaj milte kya Hii Kaise ho bhailog aaj milte kya Hii Kaise hobhailog aaj milte kya kya";

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
        border="1px solid red"
      >
        <WrapItem>
          <Avatar
            size={{
              base: "xs",
              sm: "sm",
              md: "md",
            }}
            src="/zuck-avatar.png"
          >
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
          <Text fontWeight="700" display={"flex"} alignItems={"center"}>
            sufiyan <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {lastMessage.length > 18
              ? lastMessage.substring(0, 18) + "..."
              : lastMessage}
            {/* <Box color="blue.400">
              <BsCheck2All size={16} />
            </Box>
            <BsFillImageFill size={16} /> */}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default Conversation;

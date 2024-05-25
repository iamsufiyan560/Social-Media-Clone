import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Mark
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            1d
          </Text>
          <DeleteIcon size={20} cursor={"pointer"} />

          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>Let's talh about threads</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src="/post1.png" w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          458 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          1200 likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      <Comment
        Comment="looks realy good"
        createdAt="4d"
        likes={100}
        username="abc"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        Comment="nice"
        createdAt="2d"
        likes={105}
        username="xyz"
        userAvatar="https://bit.ly/tioluwani-kolawole"
      />
      <Comment
        Comment="looks realy bad"
        createdAt="1d"
        likes={10}
        username="pr"
        userAvatar="https://bit.ly/ryan-florence"
      />
    </>
  );
};

export default PostPage;

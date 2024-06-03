import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <Button
        _hover={{
          bg: "blue.200",
        }}
        position={"fixed"}
        // ml={{ base: "17%", md: "8%" }}
        // top={{ base: "25.5%", md: "28.5%" }}
        bg={useColorModeValue("blue.300", "blue.400")}
        onClick={onOpen}
        size={{ base: "sm", sm: "sm" }}
      >
        Create Post
      </Button> */}

      {/* Create Post Button for extra small devices */}
      <Button
        _hover={{
          bg: "blue.200",
        }}
        ml={{ base: "10%", xs: "12%" }}
        top={{ base: "20%", xs: "22.5%" }}
        bg={useColorModeValue("blue.300", "blue.400")}
        onClick={onOpen}
        size="sm"
        display={{ base: "flex", sm: "none" }}
        paddingX="4"
        paddingY="2"
        fontSize="xs" // smaller font size for extra small devices
        width="fit-content"
      >
        Create Post
      </Button>

      {/* Create Post Button for small devices */}
      <Button
        _hover={{
          bg: "blue.200",
        }}
        ml={{ base: "15%", sm: "17%" }}
        top={{ base: "23%", sm: "25.5%" }}
        bg={useColorModeValue("blue.300", "blue.400")}
        onClick={onOpen}
        size="sm"
        display={{ base: "none", sm: "flex", md: "none" }}
        paddingX="9"
        paddingY="2"
        fontSize="sm"
        width="fit-content"
      >
        Create Post
      </Button>

      {/* Create Post Button for medium and larger devices */}
      <Button
        _hover={{
          bg: "blue.200",
        }}
        ml={{ base: "20%", md: "8%" }}
        top={{ base: "25%", md: "28.5%" }}
        bg={useColorModeValue("blue.300", "blue.400")}
        onClick={onOpen}
        size="sm"
        display={{ base: "none", md: "flex" }}
      >
        Create Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

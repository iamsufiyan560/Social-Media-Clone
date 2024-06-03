import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Button, Spinner, useColorModeValue, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import useGetFollowerList from "../hooks/useGetFollowerList";
import useGetFollowingList from "../hooks/useGetFollowingList";
import { useState } from "react";
import followingAtom from "../atoms/followingAtom";
import CreatePost from "./CreatePost";

const UserHeader = ({ user }) => {
  const following = useRecoilValue(followingAtom);
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { handleFollowUnfollow, updating } = useFollowUnfollow(user);
  const {
    loading: followerLoading,
    followers,
    getFollowerList,
  } = useGetFollowerList(user);
  const {
    loading: followingLoading,
    followings,
    getFollowingList,
  } = useGetFollowingList(user);

  const [modalType, setModalType] = useState("");

  const handleOpenModal = async (type) => {
    setModalType(type); // Set the modalType
    if (type === "followers") {
      await getFollowerList();
    } else if (type === "following") {
      await getFollowingList();
    }
    onOpen();
  };

  const navigate = useNavigate();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user.username}</Text>
              <Text
                fontSize={"xs"}
                bg={"white.light"}
                color={"gray"}
                p={1}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            {user.profilePic && (
              <Avatar
                name={user.name}
                src={user.profilePic}
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
            {!user.profilePic && (
              <Avatar
                name={user.name}
                src="https://bit.ly/C-link"
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
          </Box>
        </Flex>

        <Text>{user.bio}</Text>

        {currentUser?._id !== user._id && (
          <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}

        {currentUser?._id === user._id && (
          <Flex>
            <Link as={RouterLink} to="/update">
              <Button
                bg={useColorModeValue("blue.300", "blue.400")}
                _hover={{
                  bg: "blue.200",
                }}
                size={"sm"}
              >
                Update Profile
              </Button>
            </Link>
            <CreatePost />
          </Flex>
        )}

        <Modal bg={"grey"} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius="12">
            <ModalHeader>
              {modalType === "followers" ? "Followers" : "Following"}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              {followerLoading || followingLoading ? (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  height="100px"
                >
                  <Spinner size="lg" />
                </Flex>
              ) : (
                <>
                  {modalType === "followers" &&
                  Array.isArray(followers) &&
                  followers.length > 0
                    ? followers.map((follower, index) => (
                        <Box
                          onClick={(e) => {
                            onClose();
                            e.preventDefault();
                            navigate(`/${follower.username}`);
                          }}
                          mb={6}
                          key={follower._id}
                          cursor="pointer"
                        >
                          <Flex gap={2} alignItems="center">
                            <Avatar
                              src={follower.profilePic}
                              alt={follower.name}
                            />
                            <Box>
                              <Text color={"grey.dark"} fontSize="sm">
                                {follower.name}
                              </Text>
                            </Box>
                          </Flex>
                          {index < followers.length - 1 && (
                            <Divider
                              border={"1px "}
                              borderColor="black"
                              my={4}
                            />
                          )}
                        </Box>
                      ))
                    : modalType === "followers" && (
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          height="100px"
                        >
                          <Text mb={6} color="gray.light" fontSize="sm">
                            No followers found.
                          </Text>
                        </Flex>
                      )}

                  {modalType === "following" &&
                  Array.isArray(followings) &&
                  followings.length > 0
                    ? followings.map((followingss, index) => (
                        <Box
                          onClick={(e) => {
                            onClose();
                            e.preventDefault();
                            navigate(`/${followingss.username}`);
                          }}
                          mb={6}
                          key={followingss._id}
                          cursor="pointer"
                        >
                          <Flex gap={2} alignItems="center">
                            <Avatar
                              src={followingss.profilePic}
                              alt={followingss.name}
                            />
                            <Box>
                              <Text color={"black"} fontSize="sm">
                                {followingss.name}
                              </Text>
                            </Box>
                          </Flex>
                          {index < followings.length - 1 && (
                            <Divider
                              border={"1px "}
                              borderColor="black"
                              my={4}
                            />
                          )}
                        </Box>
                      ))
                    : modalType === "following" && (
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          height="100px"
                        >
                          <Text mb={6} color="gray.light" fontSize="sm">
                            No following found.
                          </Text>
                        </Flex>
                      )}
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{posts.length} Posts</Text>

            <Text
              cursor="pointer"
              onClick={() => handleOpenModal("followers")}
              color={"gray.light"}
            >
              {user.followers.length} followers
            </Text>
            <Text
              cursor="pointer"
              onClick={() => handleOpenModal("following")}
              color={"gray.light"}
            >
              {user.following.length} following
            </Text>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray"}>
                    <MenuItem bg={"gray"} onClick={copyURL}>
                      Copy link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={"2.5px solid white"}
            justifyContent={"center"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}> Threads</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={"2.5px solid gray"}
            justifyContent={"center"}
            color={"gray.light"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}> Replies</Text>
          </Flex>
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;

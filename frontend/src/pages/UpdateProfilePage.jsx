import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  HStack,
  useColorModeValue,
  Avatar,
  Center,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    profilePic: user.profilePic,
  });
  const fileRef = useRef(null);
  const showToast = useShowToast();

  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json(); // updated user object
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={2}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={-4}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edit Your Profile
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || inputs.profilePic}
                ></Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Profile
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <HStack>
            <Box>
              <FormControl>
                <FormLabel>Full name</FormLabel>
                <Input
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  placeholder="John Doe"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </FormControl>
            </Box>

            <Box>
              <FormControl>
                <FormLabel>User name</FormLabel>
                <Input
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  placeholder="Itzz_John"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </FormControl>
            </Box>
          </HStack>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              placeholder="Your Bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              value={inputs.password}
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack mt={4} spacing={6} direction={["column", "row"]}>
            <Button
              loadingText="Updating"
              bg={"green.400"}
              color={"white"}
              w="full"
              type="submit"
              _hover={{
                bg: "green.500",
              }}
              isLoading={updating}
            >
              Update Profile
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}

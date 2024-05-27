import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  // Initialize an empty array to keep track of fields that are empty
  // const validateInputs = () => {
  // Iterate over the entries (key-value pairs) of the inputs object
  //   const emptyFields = [];
  //   for (const [key, value] of Object.entries(inputs)) {
  // If a value is empty (falsy), add the key (field name) to the emptyFields array
  //     if (!value) {
  //       emptyFields.push(key);
  //     }
  //   }
  // Return the array of empty fields
  //   return emptyFields;
  // };

  const validateInputs = () => {
    const newErrors = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (!value) {
        newErrors[key] = `Please fill the ${key}`;
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  // Inside the handleSignup function
  const handleSignup = async () => {
    // Call validateInputs to get an array of empty fields

    // const emptyFields = validateInputs();
    // If there are any empty fields
    // if (emptyFields.length > 0) {
    // Show a toast notification for each empty field
    //   emptyFields.forEach((field) =>
    //     showToast("Error", `Please fill the ${field}`, "error")
    //   );
    // Return early to prevent the signup process from continuing
    //   return;
    // }

    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        setLoading(false);
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      showToast("Success", "Account created successfully!", "success");
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading marginTop={-12} fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={7}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isInvalid={errors.name} isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    value={inputs.name}
                  />

                  {errors.name && (
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired isInvalid={errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    value={inputs.username}
                  />
                  {errors.username && (
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
              />
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    isDisabled={loading}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Signing up..."
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSignup}
                isLoading={loading}
                isDisabled={loading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

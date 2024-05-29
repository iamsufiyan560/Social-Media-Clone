import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Link to={"/markzuckerberg"}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button
          mx={"auto"}
          bg={useColorModeValue("blue.300", "blue.400")}
          _hover={{
            bg: "blue.200",
          }}
        >
          {" "}
          Visit profile page
        </Button>
      </Flex>
    </Link>
  );
};

export default HomePage;

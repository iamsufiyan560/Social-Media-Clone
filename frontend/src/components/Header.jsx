import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import authScreenAtom from "../atoms/authAtom";
import LogoutButton from "./LogoutButton";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mb="12">
      {user && (
        <Link mt={"6"} as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {/* <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        mt={"6"}
        ml={"20%"}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      /> */}

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link mt={"6"} as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link mt={"6"} as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Link mt={"6"} as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>

          <Link mt={"6"} as={RouterLink} to={`/auth`}>
            <LogoutButton />
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setLoading(false);
          return;
        }
        // console.log(data);
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={900}
        postImg="/post1.png"
        postTitle="lets talk about theread"
      />
      <UserPost
        likes={1800}
        replies={400}
        postImg="/post2.png"
        postTitle="lets talk about theread"
      />
      <UserPost
        likes={600}
        replies={666}
        postImg="/post3.png"
        postTitle="lets talk about theread"
      />
    </>
  );
};

export default UserPage;

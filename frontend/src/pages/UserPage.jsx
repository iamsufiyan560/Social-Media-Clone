import React from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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

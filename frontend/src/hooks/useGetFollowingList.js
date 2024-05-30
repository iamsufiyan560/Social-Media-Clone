import { useEffect, useState } from "react";

import useShowToast from "./useShowToast";
import listAtom from "../atoms/listAtom";
import { useRecoilState } from "recoil";

const useGetFollowingList = (user) => {
  const [loading, setLoading] = useState(true);

  const [followings, setFollowing] = useRecoilState(listAtom);

  const showToast = useShowToast();

  const getFollowingList = async () => {
    setLoading(true); // Ensure loading state is true at the beginning
    setFollowing([]);
    try {
      const res = await fetch(`/api/users/${user._id}/following`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log("following", data);
      setFollowing(data);
      setLoading(false);
    } catch (error) {
      showToast("Error", error.message, "error");
      setFollowing([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getFollowingList();
    }
  }, [user]);

  return { getFollowingList, loading, followings };
};

export default useGetFollowingList;

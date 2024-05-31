import { useEffect, useState } from "react";

import useShowToast from "./useShowToast";
import listAtom from "../atoms/listAtom";
import { useRecoilState } from "recoil";

const useGetFollowerList = (user) => {
  const [loading, setLoading] = useState(true);

  const [followers, setFollowers] = useRecoilState(listAtom);

  const showToast = useShowToast();

  const getFollowerList = async () => {
    setLoading(true); // Ensure loading state is true at the beginning
    setFollowers([]);
    try {
      const res = await fetch(`/api/users/${user._id}/followers`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setFollowers(data);
      setLoading(false);
    } catch (error) {
      showToast("Error", error.message, "error");
      setLoading(false);

      setFollowers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getFollowerList();
    }
  }, [user]);

  return { getFollowerList, loading, followers };
};

export default useGetFollowerList;

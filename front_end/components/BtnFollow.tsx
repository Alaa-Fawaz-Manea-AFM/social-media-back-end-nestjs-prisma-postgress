"use client";
import { handleTogleFollowing } from "@/constant/api";
import { useUserContext } from "@/context/MyState";
import { useRouter } from "next-nprogress-bar";
import { Dispatch, SetStateAction, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

type IBtnFollow = {
  followCounts?: number;
  setFollowCounts?: Dispatch<SetStateAction<number>>;
  userFollowId: string;
  isFollow: boolean;
};

const BtnFollow = ({ setFollowCounts, isFollow, userFollowId }: IBtnFollow) => {
  const { user } = useUserContext();
  const [IsFollow, setIsFollow] = useState(isFollow || false);
  const router = useRouter();

  const handleButtonClick = () => {
    if (!user?.id) return router.push("/log-in");
    if (setFollowCounts) {
      setFollowCounts((prev) => {
        if (IsFollow) {
          return prev > 0 ? prev - 1 : 0;
        } else {
          return prev + 1;
        }
      });
    }
    handleTogleFollowing(userFollowId, setIsFollow);
  };

  return (
    <button
      onClick={handleButtonClick}
      className="px-5 py-2 bg-light-purple h-fit rounded-lg font-semibold cursor-pointer"
    >
      {user?.id && IsFollow ? (
        <span className="flex items-center gap-2">
          <RiUserUnfollowLine />
          <span> Following</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <RiUserFollowLine />
          <span> Follow</span>
        </span>
      )}
    </button>
  );
};

export default BtnFollow;

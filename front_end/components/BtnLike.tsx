"use client";
import { abbreviateNumber } from "js-abbreviation-number";
import { Like_Icon, Liked_Icon } from "@/public/assets";
import { handleToggleLikes } from "@/constant/api";
import { useUserContext } from "@/context/MyState";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import Image from "next/image";

const BtnLike = ({
  likeCounts,
  isliked,
  postId,
}: {
  likeCounts: number;
  isliked: boolean;
  postId: string;
}) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [liked, setLiked] = useState(isliked || false);
  const [likeCount, setLikeCount] = useState<number>(likeCounts);

  const handleBtnRoute = () => {
    if (user?.id) {
      return handleToggleLikes(postId, setLiked, likeCount, setLikeCount);
    }
    return router.push("/log-in");
  };

  return (
    <div className="flex items-center gap-1">
      <Image
        onClick={handleBtnRoute}
        src={user?.id && liked ? Liked_Icon : Like_Icon}
        alt="liked"
        width={32}
        height={32}
        className="cursor-pointer"
        unoptimized
      />

      {abbreviateNumber(likeCount, 2)}
    </div>
  );
};

export default BtnLike;

"use client";
import { useState } from "react";
import UserInfCercle from "./UserInfCercle";
import BtnFollow from "./BtnFollow";
import { IUser } from "@/types";
import BtnSeeMore from "./BtnSeeMore";

const ComProfileCounts = ({ user }: { user: IUser }) => {
  const [followCounts, setFollowCounts] = useState<number>(
    +user?.followerCounts || 0,
  );
  return (
    <div className="flex gap-10 flex-col">
      <div className="flex items-center justify-between max-xxs:gap-2 gap-5 w-full md:w-4/5">
        <UserInfCercle MyPage user={user} />
        <BtnFollow
          followCounts={followCounts}
          setFollowCounts={setFollowCounts}
          isFollow={user.isFollow}
          userFollowId={user.id}
        />
      </div>

      <div className="flex flex-wrap flex-col gap-5">
        <BtnSeeMore details={user?.bio} length={130} />

        <div className="flex flex-wrap gap-5">
          <span className="flex items-center gap-1 mt-5">
            <p className="text-light-purple">{user?.postCounts}</p> Posts
          </span>
          <span className="flex items-center gap-1 mt-5">
            <p className="text-light-purple">{followCounts}</p>
            Followers
          </span>
          <span className="flex items-center gap-1 mt-5">
            <p className="text-light-purple">{user?.followingCounts}</p>
            Following
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComProfileCounts;

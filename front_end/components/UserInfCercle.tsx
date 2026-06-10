"use client";
import { formateDate } from "@/constant/api";
import { IUserInfCercle } from "@/types";
import { useUserContext } from "@/context/MyState";
import Link from "next/link";

const UserInfCercle = ({
  col,
  user,
  createdAt,
  time,
  MyPage,
}: IUserInfCercle) => {
  const { user: currentUser } = useUserContext();

  return (
    <Link
      href={currentUser?.id === user.id ? `/user/profile` : `/user/${user.id}`}
      className={`${col ? "flex-col" : ""} ${
        time ? "" : " text-center"
      } flex items-center ${MyPage ? "" : "cursor-pointer"} gap-2 w-fit cursor-pointer`}
    >
      <div className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-3xl w-12 h-12">
        {user?.name?.slice(0, 1).toUpperCase()}
      </div>
      <div className={`${col ? "" : "items-start"} flex flex-col`}>
        <span className="line-clamp-1">{user?.name}</span>
        {time ? (
          <span className="text-[#7878A3]">
            <b className="text-gray-400 mr-1">•</b>
            {formateDate(createdAt)}
          </span>
        ) : (
          <span className="text-[#7878A3]">
            <b className="text-gray-400 mr-1"></b>@
            {user?.userName?.replace(/^@/, "")}
          </span>
        )}
      </div>
    </Link>
  );
};

export default UserInfCercle;

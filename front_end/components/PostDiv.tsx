"use client";
import { useUserContext } from "@/context/MyState";
import BtnEditPost from "./BtnEditPost";
import BtnSeved from "./BtnSaved";
import { IPosts } from "@/types";
import BtnLike from "./BtnLike";
import Image from "next/image";
import Link from "next/link";

type IPostDiv = {
  profile?: true;
  post: IPosts;
  savedPage?: boolean;
  user?: boolean;
  userId?: string;
  saved?: boolean;
  explore?: boolean;
};

const PostDiv = ({
  savedPage,
  profile,
  explore,
  userId,
  saved,
  post,
  user,
}: IPostDiv) => {
  const { user: currentUser } = useUserContext();

  return (
    <div className="h-64 w-11/12 max-sm:mx-auto mdd:w-64 overflow-hidden rounded-xl relative">
      {post?.imageUrl && (
        <Link href={`/post/${post?.id}/${userId || post?.userId}`}>
          <Image
            fill
            src={post?.imageUrl}
            alt="Snapgram Image"
            className="object-cover cursor-pointer"
            unoptimized
          />
        </Link>
      )}

      <div className="justify-between absolute bottom-0 w-full h-10 bg-black/50 flex items-center px-2">
        {profile ? (
          <div className="w-full">
            <BtnEditPost post={post} profile />
          </div>
        ) : (
          <>
            {explore && (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    currentUser?.id === post.userId
                      ? `/user/profile`
                      : `/user/${userId}`
                  }
                  className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-xl w-8 h-8 cursor-pointer"
                >
                  {post.user?.name?.slice(0, 1).toUpperCase()}
                </Link>
                <span className="font-semibold text-left line-clamp-1">
                  {post.user?.name}
                </span>
              </div>
            )}
            <div
              className={`${
                explore ? "gap-2" : "justify-between w-full"
              } flex items-center`}
            >
              {user ? (
                <BtnLike
                  isliked={post.isLiked}
                  postId={post.id}
                  likeCounts={post.likeCounts}
                />
              ) : (
                <Link
                  href={
                    currentUser?.id === post.userId
                      ? `/user/profile`
                      : `/user/${userId}`
                  }
                  className="flex items-center justify-center font-semibold bg-green-700 rounded-full w-7 h-7 cursor-pointer"
                >
                  {post.user?.name?.slice(0, 1).toUpperCase()}
                </Link>
              )}
              {saved ? (
                <BtnSeved
                  savedPage={savedPage || false}
                  isSaved={post.isSaved}
                  postId={post.id}
                />
              ) : (
                ""
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDiv;

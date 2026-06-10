"use client";
import { useCallback, useRef, useState } from "react";
import AxiosClient from "@/lib/axios-client";
import { IPosts } from "@/types";
import UserInfCercle from "./UserInfCercle";
import BtnSeeMore from "./BtnSeeMore";
import Link from "next/link";
import Image from "next/image";
import BtnLike from "./BtnLike";
import BtnSaved from "./BtnSaved";
import Loader from "./Loader";

export default function CompHomePage({
  targetUserId,
  initialPosts,
}: {
  targetUserId?: string;
  initialPosts: IPosts[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef<string | null>(
    initialPosts.length ? initialPosts[initialPosts.length - 1].id : null,
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const ApiUrl = targetUserId
        ? `posts/home-page?curseId=${cursorRef.current || ""}&targetUserId=${targetUserId}`
        : `posts/home-page?curseId=${cursorRef.current || ""}`;
      const { data } = await AxiosClient.get(ApiUrl);

      const newPosts = data?.data?.posts || [];

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);

      cursorRef.current = newPosts[newPosts.length - 1]?.id || null;
    } finally {
      setLoading(false);
    }
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className="space-y-10">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return (
          <div
            key={post?.id}
            ref={isLast ? lastPostRef : null}
            className="flex flex-col gap-5 justify-center text-start bg-whit max-w-md mx-auto"
          >
            {!targetUserId && (
              <div className="px-5 xs:px-0 space-y-5">
                <UserInfCercle
                  user={post.user}
                  createdAt={post.createdAt}
                  time
                />
                <BtnSeeMore details={post.caption} length={130} />
              </div>
            )}
            <Link
              href={`/post/${post.id}/${post.userId}`}
              className="relative w-full h-72 block"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="mx-auto rounded-lg cursor-pointer object-cover"
                  unoptimized
                />
              )}
            </Link>
            <div className="flex justify-between px-2">
              <BtnLike
                likeCounts={post.likeCounts}
                isliked={post.isLiked}
                postId={post.id}
              />
              <BtnSaved postId={post.id} isSaved={post.isSaved} />
            </div>
          </div>
        );
      })}

      {loading && <Loader sideBar />}
    </div>
  );
}

import {
  BtnLike,
  PostDiv,
  BtnSaved,
  UserInfCercle,
  Loader,
  BtnSeeMore,
  CompHomePage,
} from "@/components";
import Image from "next/image";
import { getUserId } from "@/lib/token";
import { IPosts } from "@/types";
import BtnEditPost from "@/components/BtnEditPost";
import { AxiosServer } from "@/lib/axios-server";

interface Props {
  params: Promise<{
    postId: string;
    userId: string;
  }>;
}

const PostInfoPage = async ({ params }: Props) => {
  const { postId, userId } = await params;
  const currentUserId = await getUserId();
  const { data } = await AxiosServer("get", `posts/${postId}/${userId}`);
  const post = data.data?.post || null;
  const postsAll = data.data?.posts || [];

  if (!post) return <Loader />;

  return (
    <div className="h-screen overflow-y-scroll pb-28 max-ssx:pt-20 ssx:pb-20 max-w-5xl mx-auto ssx:mx-0 ssx:py-12">
      <div className="flex gap-10 max-md:flex-wrap pb-10 sm:pl-10">
        {post?.imageUrl && (
          <div className="relative h-80 max-ss:w-11/12 ss:w-lg max-sm:mx-auto rounded-md max-sm:w-full">
            <Image
              fill
              src={post?.imageUrl}
              alt="image snapgram"
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="flex gap-5 flex-col md:h-80 w-80 max-md:w-lg max-sm:w-11/12 md:justify-between max-md:space-y-5 max-sm:mx-auto">
          <div className="flex flex-col gap-5 px-2">
            <div className="flex items-center justify-between">
              <UserInfCercle user={post.user} createdAt={post.createdAt} time />
              {post?.userId == currentUserId && <BtnEditPost post={post} />}
            </div>
            <BtnSeeMore details={post.caption} length={280} />
          </div>

          {post && (
            <div className="flex items-center justify-between px-2">
              <BtnLike
                likeCounts={post.likeCounts}
                postId={post.id}
                isliked={post.isLiked}
              />
              <BtnSaved isSaved={post.isSaved} postId={post.id} />
            </div>
          )}
        </div>
      </div>

      <div className="flex max-sm:justify-center gap-5 flex-wrap w-full mt-5">
        <div className="w-11/12 mb-20 mt-10 h-0.5 bg-light-purple" />
        {postsAll?.map((post: IPosts) => (
          <PostDiv key={post.id} saved user post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostInfoPage;

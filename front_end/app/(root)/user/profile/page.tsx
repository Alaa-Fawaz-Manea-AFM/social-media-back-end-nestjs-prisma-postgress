import { BtnSeeMore, PostDiv, UserInfCercle } from "@/components";
import { AxiosServer } from "@/lib/axios-server";
import { Edit, Posts_Icon } from "@/public/assets";
import { IPosts, IUser } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "profile",
};

const MyPosts = async () => {
  const { data } = await AxiosServer("get", "auth/profile");
  if (!data) return redirect("/");
  const { user, posts }: { user: IUser; posts: IPosts[] } = data?.data || [];

  return (
    <div className="h-screen overflow-y-scroll max-ssx:pb-28 pb-20 max-ssx:pt-20 max-w-5xl mx-auto ssx:mx-0 ssx:py-10">
      <div className="space-y-10">
        <div className="flex gap-10 flex-col">
          <div className="flex items-center justify-between max-xxs:gap-2 gap-5 w-full">
            <UserInfCercle MyPage user={user} />
            <Link
              href={`/user/edit`}
              className="px-3 py-2 bg-[#1F1F22] h-fit rounded-lg font-semibold flex items-center space-x-2"
            >
              <Image src={Edit} alt="edit" width={25} height={25} unoptimized />

              <span className="max-xs:hidden">Edit Profile</span>
            </Link>
          </div>
          <div className="flex flex-wrap flex-col gap-5">
            <BtnSeeMore details={user?.bio} length={250} />
            <div className="flex flex-wrap gap-5">
              <span className="flex items-center gap-1 mt-5">
                <p className="text-light-purple">{user?.postCounts}</p> Posts
              </span>
              <span className="flex items-center gap-1 mt-5">
                <p className="text-light-purple">{user?.followerCounts}</p>
                Followers
              </span>
              <span className="flex items-center gap-1 mt-5">
                <p className="text-light-purple">{user?.followingCounts}</p>
                Following
              </span>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-16">
            <button className="flex items-center gap-2">
              <Image
                width={32}
                height={32}
                src={Posts_Icon}
                alt="Posts_Icon"
                unoptimized
              />

              <span className="text-light-purple text-xl">Posts</span>
            </button>
          </div>
        </div>
        <div className="flex gap-10 max-sm:justify-center flex-wrap w-full">
          {posts?.length == 0 && (
            <div className="mx-auto text-3xl font-semibold">
              You do not have posts
            </div>
          )}
          {posts?.map((post: IPosts) => (
            <PostDiv key={post.id} saved profile user post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;

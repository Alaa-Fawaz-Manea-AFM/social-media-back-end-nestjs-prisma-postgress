import { ComProfileCounts, Loader, PostDiv } from "@/components";
import { AxiosServer } from "@/lib/axios-server";
import { IPosts, IUser } from "@/types";

type IParamsUser_Id = {
  params: Promise<{
    userId: string;
  }>;
};

const UserInfoPage = async ({ params }: IParamsUser_Id) => {
  const { userId } = await params;
  const { data } = await AxiosServer("get", `users/${userId}`);
  const user = data.data.user as IUser;
  const posts = data.data.posts;

  if (!user) return <Loader />;
  return (
    <div className="h-screen overflow-y-scroll max-w-5xl px-2 xxs:px-5 mx-auto space-y-10 max-ssx:pb-24 pb-20 max-ssx:pt-20 py-10">
      <ComProfileCounts user={user} />
      <div className="flex max-sm:justify-center gap-5 flex-wrap w-full">
        {posts?.length == 0 ? (
          <div className="mx-auto text-3xl font-semibold">He has no posts</div>
        ) : (
          posts?.map((post: IPosts) => (
            <PostDiv key={post.id} saved user post={post} userId={userId} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserInfoPage;

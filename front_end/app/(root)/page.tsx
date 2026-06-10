import { CompHomePage, UserInfCercle } from "@/components";
import { AxiosServer } from "@/lib/axios-server";
import { IUser } from "@/types";
import Link from "next/link";

const HomePage = async () => {
  const { data: posts } = await AxiosServer("get", "posts/home-page");
  const { data: users } = await AxiosServer("get", "users");

  return (
    <div className="flex h-screen ssx:py-10">
      <div className="flex-[1.5] space-y-5 overflow-y-scroll pb-20 max-ssx:pb-28 max-ssx:pt-20">
        <CompHomePage initialPosts={posts?.data?.posts || []} />
      </div>

      <div className="space-y-20 flex-[0.75] overflow-y-scroll h-screen max-md:hidden gap-10 pb-20 max-ssx:pb-28 max-ssx:pt-20">
        <div className="w-fit items-start group mb-10">
          <h1 className="font-semibold text-3xl">Top Creators</h1>
          <div className="bg-light-purple w-1/2 h-1 group-hover:w-full duration-200 ease-out mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full justify-items-center items-center gap-y-20">
          {users?.data?.users?.map((user: IUser) => (
            <UserInfCercle home col key={user.id} user={user} />
          ))}
        </div>
        {users?.data?.users > 0 && (
          <Link
            href="/people"
            className="text-sm font-bold bg-light-purple hover:bg-[#6b63ffad] py-2.5 px-5 rounded-lg block text-center duration-300 transition-all active:scale-95 shadow-md shadow-[#877effb9]"
          >
            See More
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;

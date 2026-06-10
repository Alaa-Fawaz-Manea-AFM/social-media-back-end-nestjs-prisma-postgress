import { BtnPaginations, InputExplore, Loader, PostDiv } from "@/components";
import { validateAndGetPagination } from "@/utils/paginationSafe";
import { AxiosServer } from "@/lib/axios-server";
import { Filter, Search } from "@/public/assets";
import { redirect } from "next/navigation";
import { IPosts } from "@/types";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore more posts",
};

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ExplorePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const search = params?.search || "";
  const pageParam = params?.page || "1";

  let posts: IPosts[] = [];
  let totalPage = 0;

  try {
    const { data } = await AxiosServer("get", `posts?page=${pageParam}`, {
      caption: search.trim(),
    });

    posts = data?.data?.posts || [];
    totalPage = data?.data?.meta?.totalPage || 0;
  } catch (error) {
    console.error("Backend Error caught safely in Explore:", error);
    redirect(`/explore?page=1${search ? `&search=${search}` : ""}`);
  }

  const { rawPage, pages } = validateAndGetPagination({
    searchParamsPage: params?.page,
    totalPage,
    usersLength: posts.length,
    pathName: "/explore",
  });

  if (posts.length === 0 && !search) return <Loader />;

  return (
    <div className="h-screen overflow-y-scroll max-ssx:pb-28 max-ssx:pt-20 py-12 space-y-10 flex flex-col justify-between">
      <div className="space-y-10">
        <div className="flex gap-7 w-11/12 mx-auto flex-col max-w-5xl">
          <h2 className="text-2xl font-semibold">Search Posts</h2>
          <div className="flex gap-2 bg-gray-input items-center p-2 rounded-lg">
            <label htmlFor="search">
              <Image
                src={Search}
                alt="search"
                width={24}
                height={24}
                className="cursor-pointer"
                unoptimized
              />
            </label>
            <InputExplore search={search} />
          </div>
          <div className="flex items-center justify-between px-3">
            <h2 className="text-xl font-semibold">Popular Today</h2>
            <div className="flex items-center gap-2">
              All <Image src={Filter} alt="search" width={32} height={32} />
            </div>
          </div>
        </div>

        <div className="w-11/12 mx-auto flex flex-wrap gap-5 max-ssx:justify-center px-5 ssx:px-10">
          {posts.length > 0 ? (
            posts
              ?.filter((post: IPosts) =>
                post.caption?.toLowerCase().includes(search?.toLowerCase()),
              )
              .map((post: IPosts) => (
                <PostDiv key={post.id} explore saved user post={post} />
              ))
          ) : (
            <div className="text-zinc-500 w-full text-center py-10">
              No posts found.
            </div>
          )}
        </div>
      </div>

      <BtnPaginations totalPage={totalPage} rawPage={rawPage} pages={pages} />
    </div>
  );
};

export default ExplorePage;

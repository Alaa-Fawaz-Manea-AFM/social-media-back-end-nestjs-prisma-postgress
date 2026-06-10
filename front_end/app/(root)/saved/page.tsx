import { AxiosServer } from "@/lib/axios-server";
import { validateAndGetPagination } from "@/utils/paginationSafe";
import { Save_Icon } from "@/public/assets";
import { BtnPaginations, Loader, PostDiv } from "@/components";
import { IPosts } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Saved",
  description: "Save all the posts you like on the saved page",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const SavedPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const pageParam = params?.page || "1";

  let saved = [];
  let totalPage = 0;

  try {
    const { data } = await AxiosServer("get", `saves?page=${pageParam}`);

    saved = data?.data?.saved || [];
    totalPage = data?.meta?.totalPage || data?.data?.meta?.totalPage || 0;
  } catch (error) {
    console.error("Backend Error caught safely in SavedPage:", error);
    redirect("/saved?page=1");
  }

  const { rawPage, pages } = validateAndGetPagination({
    searchParamsPage: params?.page,
    totalPage,
    usersLength: saved.length,
    pathName: "/saved",
  });

  if (saved.length === 0 && rawPage === 1 && totalPage === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-3xl font-semibold text-zinc-500">
        There is no saving
      </div>
    );
  }

  if (saved?.length === 0 && totalPage > 0) return <Loader />;
  return (
    <div className="h-screen overflow-y-scroll pb-28 pt-12 ssx:py-12 flex flex-col justify-between">
      <div className="space-y-10">
        <div className="max-ssx:pl-5 flex items-center gap-2 px-5 ssx:px-10">
          <Image
            src={Save_Icon}
            alt="Save_Icon"
            width={25}
            height={25}
            unoptimized
          />
          <h2 className="font-semibold text-2xl">Saved Posts</h2>
        </div>

        <div className="w-11/12 mx-auto flex flex-wrap gap-5 max-ssx:justify-center px-5 ssx:px-10">
          {saved?.map(({ post }: { post: IPosts }) => (
            <PostDiv key={post.id} savedPage saved post={post} />
          ))}
        </div>
      </div>
      <BtnPaginations totalPage={totalPage} rawPage={rawPage} pages={pages} />
    </div>
  );
};

export default SavedPage;

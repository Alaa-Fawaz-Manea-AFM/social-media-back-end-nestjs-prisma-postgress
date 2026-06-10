import { BtnFollow, BtnPaginations, Loader, UserInfCercle } from "@/components";
import { validateAndGetPagination } from "@/utils/paginationSafe";
import { AxiosServer } from "@/lib/axios-server";
import { IUser } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "People",
  description: "Explore more people",
};

const PeoplePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;

  let users: IUser[] = [];
  let totalPage = 0;

  try {
    const pageNum = params?.page || "1";
    const { data } = await AxiosServer("get", `users?page=${pageNum}`);

    users = data?.data?.users || [];
    totalPage = data?.data?.meta?.totalPage || 0;
  } catch (error) {
    console.error("Backend Error caught safely:", error);
    redirect("/people?page=1");
  }

  const { rawPage, pages } = validateAndGetPagination({
    searchParamsPage: params?.page,
    totalPage,
    usersLength: users.length,
    pathName: "/people",
  });

  if (users.length === 0) return <Loader />;

  return (
    <div className="h-screen overflow-y-scroll max-ssx:mx-auto max-ssx:pb-28 pt-12 space-y-10 flex flex-col justify-between">
      <div className="space-y-10">
        <h2 className="text-xl font-semibold pl-10">All Users</h2>
        <div className="grid max-ssx:justify-items-center grid-cols-1 xs:grid-cols-2 mdd:grid-cols-4 gap-10 px-5 ssx:px-0">
          {users?.map((user: IUser) => (
            <div
              key={user.id}
              className="flex w-40 flex-col items-center gap-2"
            >
              <UserInfCercle col user={user} />
              <BtnFollow userFollowId={user.id} isFollow={user.isFollow} />
            </div>
          ))}
        </div>
      </div>

      <BtnPaginations totalPage={totalPage} rawPage={rawPage} pages={pages} />
    </div>
  );
};

export default PeoplePage;

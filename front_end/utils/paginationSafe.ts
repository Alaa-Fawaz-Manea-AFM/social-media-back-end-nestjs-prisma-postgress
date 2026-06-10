import { redirect } from "next/navigation";

interface PaginationSafeProps {
  searchParamsPage: string | undefined;
  totalPage: number;
  usersLength: number;
  pathName: string;
}

export const validateAndGetPagination = ({
  searchParamsPage,
  totalPage,
  usersLength,
  pathName,
}: PaginationSafeProps) => {
  const rawPage = Number(searchParamsPage || 1);

  if (isNaN(rawPage) || rawPage < 1) {
    redirect(`${pathName}?page=1`);
  }

  if (totalPage > 0 && rawPage > totalPage) {
    redirect(`${pathName}?page=${totalPage}`);
  }

  if (usersLength === 0 && rawPage > 1) {
    redirect(`${pathName}?page=1`);
  }
  const startPage = Math.max(1, rawPage - 1);
  const endPage = Math.min(totalPage, startPage + 2);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return { rawPage, pages };
};

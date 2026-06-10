import Link from "next/link";

type IPagination = {
  totalPage: number;
  rawPage: number;
  pages: number[];
};

const BtnPaginations = ({
  totalPage = 0,
  rawPage = 1,
  pages = [],
}: IPagination) => {
  return (
    <>
      {totalPage > 1 && (
        <div className="p-6 flex justify-center items-center my-10 mx-5 ssx:mx-0">
          <div className="flex items-center gap-2 select-none">
            {rawPage > 1 ? (
              <Link
                href={`?page=${rawPage - 1}`}
                className="px-4 py-2.5 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2F] text-white border border-transparent hover:border-zinc-700 text-sm font-semibold duration-200 transition-all active:scale-95 cursor-pointer"
              >
                {"<"}
              </Link>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-[#1A1A1E] text-zinc-500 border border-zinc-800/80 text-sm font-semibold cursor-not-allowed opacity-70">
                {"<"}
              </span>
            )}

            <div className="flex items-center gap-1.5 bg-[#151518] p-1.5 rounded-2xl border border-zinc-900">
              {pages.map((p) => (
                <Link
                  href={`?page=${p}`}
                  key={p}
                  className={`px-4 py-2 rounded-xl text-sm font-bold duration-200 transition-all active:scale-105 cursor-pointer block ${
                    p === rawPage
                      ? "bg-light-purple text-white shadow-md shadow-light-purple/20 scale-105"
                      : "text-zinc-400 hover:text-white hover:bg-[#1F1F22]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {rawPage < totalPage ? (
              <Link
                href={`?page=${rawPage + 1}`}
                className="px-4 py-2.5 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2F] text-white border border-transparent hover:border-zinc-700 text-sm font-semibold duration-200 transition-all active:scale-95 cursor-pointer"
              >
                {">"}
              </Link>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-[#1A1A1E] text-zinc-500 border border-zinc-800/80 text-sm font-semibold cursor-not-allowed opacity-70">
                {">"}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BtnPaginations;

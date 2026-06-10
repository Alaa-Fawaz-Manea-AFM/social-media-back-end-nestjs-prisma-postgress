import { Side_Img } from "@/public/assets";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getUserId } from "@/lib/token";

const LayoutAuth = async ({ children }: { children: React.ReactNode }) => {
  const userId = await getUserId();
  if (!userId) redirect("/");
  return (
    <div className="grid grid-cols-2 w-screen overflow-hidden h-screen">
      <div className="overflow-y-scroll col-span-2 md:col-span-1">
        <div className="flex justify-center items-center">{children}</div>
      </div>

      <div className="relative w-full h-screen md:col-span-1 max-md:sr-only">
        <Image fill src={Side_Img} className="object-cover" alt="side-img" />
      </div>
    </div>
  );
};

export default LayoutAuth;

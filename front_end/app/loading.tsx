import { Loader_icon } from "@/public/assets";
import Image from "next/image";

const loading = () => (
  <span className="flex h-screen items-center justify-center w-full">
    <Image src={Loader_icon} alt="" width={32} height={32} unoptimized />
  </span>
);

export default loading;

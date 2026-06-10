"use client";
import { useRouter } from "next-nprogress-bar";

import { Back } from "@/public/assets";
import Image from "next/image";

const GobackPage = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      title="Go back"
      className="absolute z-10 max-ssx:hidden p-2 top-10 -right-10 cursor-pointer"
    >
      <Image src={Back} alt="back" width={30} height={30} unoptimized />
    </button>
  );
};

export default GobackPage;

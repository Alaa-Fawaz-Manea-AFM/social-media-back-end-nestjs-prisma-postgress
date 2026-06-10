import { Form_Log_In } from "@/components";
import { Logo } from "@/public/assets";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "log-in",
  description: "log-in users",
};

const LoginPage = () => (
  <div className="px-10 py-12 max-w-lg w-full mx-auto space-y-5">
    <div className="flex items-center flex-col gap-7">
      <Link href="/">
        <Image
          src={Logo}
          alt="img Sign-Up"
          width={176}
          height={32}
          unoptimized
        />
      </Link>
      <div className="space-y-3">
        <h2 className="text-3xl text-center font-semibold">
          Log in to your account
        </h2>
        <p className="text-[#7878A3]">
          Welcome back! Please enter your details.
        </p>
      </div>
    </div>
    <Form_Log_In />
    <div className="text-center mt-3">
      {`Don't have an account?`}
      <Link href="/sign-up" className="text-light-purple font-semibold ml-1">
        Sign up
      </Link>
    </div>
  </div>
);

export default LoginPage;

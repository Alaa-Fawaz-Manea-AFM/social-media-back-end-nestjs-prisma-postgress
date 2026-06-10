import { Form_sign_Up } from "@/components";
import { Logo } from "@/public/assets";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "sign-up",
  description: "sign-up users",
};

const SignUpPage = () => (
  <div className="px-10 py-12 max-w-lg w-full space-y-5">
    <div className="flex items-center flex-col gap-7">
      <Link href="/">
        <Image src={Logo} alt="img Sign-Up" width={176} height={36} />
      </Link>
      <div>
        <h2 className="text-3xl text-center font-semibold">
          Log in to your account
        </h2>
        <p className="text-[#7878A3]">
          To use snapgram, Please enter your details
        </p>
      </div>
    </div>
    <Form_sign_Up />
    <section className="text-center mt-3">
      Already have an account?
      <Link href="/log-in" className="text-light-purple font-semibold ml-1">
        Log in
      </Link>
    </section>
  </div>
);

export default SignUpPage;

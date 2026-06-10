"use client";
import { useUserContext } from "@/context/MyState";
import { FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next-nprogress-bar";
import { handleLogin } from "@/constant/api";
import { FaRegEye } from "react-icons/fa6";
import { BtnCAEd } from "@/components";
import { IFormLog_In } from "@/types";
import { useState } from "react";

const Form_Log_in = () => {
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [shoPass, setShoPass] = useState<boolean>(false);
  const router = useRouter();

  const [form, setForm] = useState<IFormLog_In>({
    email: "",
    password: "",
  });

  const handleLoginFun = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(form, router, setUser, setLoading);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={handleLoginFun} className="space-y-7">
      <div className="space-y-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5"
        />
      </div>
      <div className="space-y-3 relative">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={shoPass ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5 text-white placeholder-gray-500"
            placeholder="Create a strong password"
          />
          <span
            onClick={() => setShoPass(!shoPass)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-purple cursor-pointer select-none"
          >
            {shoPass ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
          </span>
        </div>
      </div>
      <BtnCAEd loading={loading} title="Sign Up" NoCancel />
    </form>
  );
};

export default Form_Log_in;

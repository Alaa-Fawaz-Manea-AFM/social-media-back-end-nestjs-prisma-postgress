"use client";
import { IFormSign_up } from "@/types";
import { EditProfileInput } from "@/constant/Constant";
import { FaRegEyeSlash, FaCheck } from "react-icons/fa";
import { FaRegEye, FaXmark } from "react-icons/fa6";
import { handleSignUp } from "@/constant/api";
import { useRouter } from "next-nprogress-bar";
import { BtnCAEd } from "@/components";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/MyState";

const Form_Log_Up = () => {
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [shoPass, setShoPass] = useState<boolean>(false);
  const router = useRouter();

  const [form, setForm] = useState<IFormSign_up & { password: string }>({
    bio: "",
    name: "",
    email: "",
    userName: "",
    password: "",
  });

  const password = form.password || "";

  const hasThreeDigits = (password.match(/\d/g) || []).length >= 3;
  const hasThreeUpper = (password.match(/[A-Z]/g) || []).length >= 3;
  const hasThreeLower = (password.match(/[a-z]/g) || []).length >= 3;

  const fulfilledCount = [hasThreeDigits, hasThreeUpper, hasThreeLower].filter(
    Boolean,
  ).length;

  let strengthLabel = "";
  let strengthColor = "bg-zinc-700";
  let strengthWidth = "w-0";

  if (password.length > 0) {
    if (fulfilledCount === 1) {
      strengthLabel = "Low";
      strengthColor = "bg-red-500";
      strengthWidth = "w-1/3";
    } else if (fulfilledCount === 2) {
      strengthLabel = "Medium";
      strengthColor = "bg-orange-500";
      strengthWidth = "w-2/3";
    } else if (fulfilledCount === 3) {
      strengthLabel = "Strong";
      strengthColor = "bg-green-500";
      strengthWidth = "w-full";
    }
  }

  const handleLoginFun = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fulfilledCount < 3) {
      toast.error("Password must meet all security requirements!");
      return;
    }

    handleSignUp(form, setUser, router, setLoading);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((pre: typeof form) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleLoginFun} className="space-y-7 max-w-md mx-auto">
      {EditProfileInput.map((arr) => (
        <div key={arr.name} className="space-y-3">
          {arr?.text ? (
            <>
              <label htmlFor={arr.label}>{arr.label}</label>
              <textarea
                value={form[arr.name as keyof typeof form]}
                onChange={handleChange}
                name={arr.name}
                id={arr.label}
                cols={10}
                rows={10}
                className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5 max-h-20"
              />
            </>
          ) : (
            <>
              <label htmlFor={arr.label}>{arr.label}</label>
              <input
                id={arr.label}
                name={arr.name}
                type={arr.type}
                value={form[arr.name as keyof typeof form]}
                onChange={handleChange}
                className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5"
              />
            </>
          )}
        </div>
      ))}

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

        {password.length > 0 && (
          <div className="space-y-2 p-3 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-white animate-fadeIn">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-zinc-400">Password Strength:</span>
              <span
                className={
                  fulfilledCount === 1
                    ? "text-red-500"
                    : fulfilledCount === 2
                      ? "text-orange-500"
                      : "text-green-500"
                }
              >
                {strengthLabel}
              </span>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColor} ${strengthWidth} duration-300 transition-all`}
              />
            </div>

            <div className="pt-1 space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                {hasThreeDigits ? (
                  <FaCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FaXmark className="text-red-500 w-3 h-3" />
                )}
                <span
                  className={hasThreeDigits ? "text-zinc-400" : "text-zinc-200"}
                >
                  At least 3 digits (0-9)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasThreeUpper ? (
                  <FaCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FaXmark className="text-red-500 w-3 h-3" />
                )}
                <span
                  className={hasThreeUpper ? "text-zinc-400" : "text-zinc-200"}
                >
                  At least 3 uppercase letters (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasThreeLower ? (
                  <FaCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FaXmark className="text-red-500 w-3 h-3" />
                )}
                <span
                  className={hasThreeLower ? "text-zinc-400" : "text-zinc-200"}
                >
                  At least 3 lowercase letters (a-z)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BtnCAEd loading={loading} title="Sign Up" NoCancel />
    </form>
  );
};

export default Form_Log_Up;

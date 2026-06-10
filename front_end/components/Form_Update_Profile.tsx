"use client";
import { handleSubmitUpdateProfile } from "@/constant/api";
import { BtnCAEd, Loader } from "@/components/index";
import { useUserContext } from "@/context/MyState";
import { useRouter } from "next-nprogress-bar";
import { IFormSign_up } from "@/types";
import { useState } from "react";

const Form_Update_Profile = () => {
  const { user, setUser } = useUserContext();
  const [valid, setValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<IFormSign_up>({
    bio: user?.bio || "",
    name: user?.name || "",
    userName: user?.userName || "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValid(false);
    const value =
      e.target.value.trim().length > 0 ? e.target.value : e.target.value.trim();
    setForm((pre) => ({ ...pre, [e.target.name]: value }));
  };

  const handleEditeProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmitUpdateProfile(
      form,
      user,
      setUser,
      router,
      setValid,
      setLoading,
    );
  };

  const handleCancel = () => router.back();
  if (!user) return <Loader />;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-3xl w-16 h-16">
          {form?.name?.slice(0, 1)?.toUpperCase()}
        </span>
        <span className="text-xl">{form?.name}</span>
      </div>

      <form onSubmit={handleEditeProfile} className="flex flex-col gap-7">
        <div className="space-y-3">
          <label htmlFor="Name">Name</label>
          <input
            id="Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="UserName">UserName</label>
          <input
            id="UserName"
            name="userName"
            type="text"
            value={form.userName}
            onChange={handleChange}
            className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="Bio">Bio</label>
          <textarea
            value={form.bio}
            onChange={handleChange}
            name="bio"
            id="Bio"
            cols={10}
            rows={10}
            className="bg-gray-input outline-none font-semibold sm:text-sm rounded-lg border border-transparent focus:border-light-purple w-full p-2.5 min-h-20 max-h-20"
          />
        </div>

        <BtnCAEd
          loading={loading}
          valid={valid}
          title="Edite Profile"
          handleCancel={handleCancel}
        />
      </form>
    </div>
  );
};

export default Form_Update_Profile;

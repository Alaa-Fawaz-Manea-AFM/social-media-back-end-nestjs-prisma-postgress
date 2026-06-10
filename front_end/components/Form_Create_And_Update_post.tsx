"use client";
import { IForm_Create_Update_Post, TypeCreateAndUpdatePost } from "@/types";
import { handleSubmitCreateAndUpdatePosts } from "@/constant/api";
import { CREATE_POST, EDIT_POST } from "@/constant/Constant";
import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/MyState";
import { File_Upload } from "@/public/assets";
import { BtnCAEd } from "@/components/index";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Form_Create_And_Update_post = ({
  type = CREATE_POST,
}: {
  type: TypeCreateAndUpdatePost;
}) => {
  const { editPost, setEditPost } = useUserContext();
  const router = useRouter();

  const [form, setForm] = useState<IForm_Create_Update_Post>({
    imageUrl: type === EDIT_POST ? editPost?.imageUrl || "" : "",
    caption: type === EDIT_POST ? editPost?.caption || "" : "",
  });

  const [valid, setValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (form.imageUrl && form.caption) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      return setValid(false);
    }
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await handleSubmitCreateAndUpdatePosts(
      type,
      form,
      router,
      editPost,
      setEditPost,
      setForm,
      setValid,
      setLoading,
    );
  };

  const refFiles = useRef<HTMLInputElement | null>(null);

  const handleCancel = () => {
    if (!loading) {
      refFiles.current!.value = "";
      setForm({ imageUrl: "", caption: "" });
      setValid(true);
      if (type === EDIT_POST) {
        router.back();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-20 pr-5">
      <div className="flex flex-col gap-3">
        <label htmlFor="caption">Caption</label>
        <textarea
          onChange={(e) =>
            setForm((pre) => ({ ...pre, caption: e.target.value }))
          }
          id="caption"
          disabled={loading}
          value={form?.caption}
          name="caption"
          cols={30}
          rows={10}
          className="max-h-32 min-h-32 rounded-3xl bg-[#1F1F22] outline-none border-none p-4"
        />
      </div>
      <div className="w-full max-h-96 gap-5 justify-center flex-col flex">
        <h2>Add Photo</h2>
        <label
          htmlFor="file"
          className="cursor-pointer w-full space-y-5 bg-[#1F1F22] rounded-3xl"
        >
          <div className="w-full h-96 flex items-center justify-center">
            <div
              className={`${
                form?.imageUrl ? "h-full object-cover" : "h-32"
              } w-full flex items-center justify-center object-cover relative`}
            >
              {form?.imageUrl ? (
                <Image
                  src={
                    form?.imageUrl instanceof File
                      ? URL.createObjectURL(form.imageUrl)
                      : form?.imageUrl || File_Upload
                  }
                  fill
                  alt="addImage"
                  className="object-cover rounded-3xl"
                  unoptimized
                />
              ) : (
                <Image src={File_Upload} fill alt="addImage" unoptimized />
              )}
            </div>
          </div>
        </label>
        <input
          ref={refFiles}
          id="file"
          type="file"
          className="sr-only"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setForm((prev) => ({
              ...prev,
              imageUrl: file,
            }));
          }}
        />
      </div>

      <BtnCAEd
        loading={loading}
        valid={valid}
        title="Create Post"
        handleCancel={handleCancel}
      />
    </form>
  );
};

export default Form_Create_And_Update_post;

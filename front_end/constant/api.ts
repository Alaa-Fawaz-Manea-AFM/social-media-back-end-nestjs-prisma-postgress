import { toast } from "react-toastify";
import {
  IUser,
  IPosts,
  IFormLog_In,
  IFormSign_up,
  IForm_Create_Update_Post,
  TypeCreateAndUpdatePost,
} from "@/types";
import { Dispatch, SetStateAction } from "react";
import AxiosClient from "@/lib/axios-client";
import axios from "axios";
import { CREATE_POST, EDIT_POST } from "./Constant";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const validEmail = process.env.NEXT_PUBLIC_EIMAIL_KEY;

export const formateDate = (date: string = ""): string => {
  const seconds: number = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );

  switch (true) {
    case seconds < 60:
      return `${Math.floor(seconds)} seconds ago`;
    case seconds < 3600:
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    case seconds < 86400:
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    case seconds < 2592000:
      const days = Math.floor(seconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    case seconds < 31536000:
      const months = Math.floor(seconds / 2592000);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    default:
      const years = Math.floor(seconds / 31536000);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const getUserData = async () => {
  const { data } = await AxiosClient.get("auth/me");
  return data?.data || {};
};

export const handleNavigate = (
  currentUser: string,
  userId: string,
  router: AppRouterInstance,
) => router.push(currentUser === userId ? `/user/profile` : `/user/${userId}`);

export const handleLogin = async (
  form: IFormLog_In,
  router: AppRouterInstance,
  setUser: Dispatch<SetStateAction<IUser | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);
    const { data } = await AxiosClient.post("auth/login", form);

    setUser(data?.data || null);
    router.push("/");
    toast.success("Log in Successfully");
  } catch {
    toast.error("Log In Failed, Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleSignUp = async (
  form: IFormSign_up & { password: string },
  setUser: Dispatch<SetStateAction<IUser | null>>,
  router: AppRouterInstance,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);
    const { data } = await AxiosClient.post("auth/signup", form);

    setUser(data?.data || null);

    router.push("/");
    toast.success("Sign Up Successfully");
  } catch {
    toast.error("Sign Up Failed, Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleToggleLikes = async (
  postId: string,
  setLiked: Dispatch<SetStateAction<boolean>>,
  likeCount: number,
  setLikeCount: Dispatch<SetStateAction<number>>,
) => {
  try {
    const { data } = await AxiosClient.post(`likes/${postId}`);
    setLiked(data.data);
    setLikeCount(data.data ? ++likeCount : --likeCount);

    toast.success(data.message);
  } catch {
    toast.error("something went wrong, Please try again.");
  }
};

export const handleToggleSaved = async (
  postId: string,
  setSaved: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const { data } = await AxiosClient.post(`saves/${postId}`);
    setSaved(data.data);
    toast.success(data.message);
  } catch {
    toast.error("something went wrong, Please try again.");
  }
};

export const handleSubmitCreateAndUpdatePosts = async (
  type: TypeCreateAndUpdatePost,
  form: IForm_Create_Update_Post,
  router: AppRouterInstance,
  editPost: IPosts | null,
  setEditPost: Dispatch<SetStateAction<IPosts | null>>,
  setForm: Dispatch<SetStateAction<IForm_Create_Update_Post>>,
  setValid: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const { imageUrl, caption } = form;

  try {
    setValid(true);
    setLoading(true);

    const body: Partial<IForm_Create_Update_Post> = {};

    if (caption !== editPost?.caption) {
      body.caption = caption;
    }

    if (type === CREATE_POST) {
      if (!(imageUrl instanceof File)) {
        toast.error("Please select image");

        return;
      }

      const typeImages = /image\/(png|jpg|jpeg|svg|webp)/gi.test(imageUrl.type);

      if (imageUrl.size > 2 * 1024 * 1024 || !typeImages) {
        toast.error(
          "Image Size should be <= 2MB and type should be (svg, png, jpg)",
        );

        return;
      }

      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("folderName", "cloudinary-tutorial");
      const { data } = await axios.post("/api/fileupload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.error) {
        toast.error("Error uploading image");

        return;
      }

      body.imageUrl = data.res.secure_url;
      body.public_id = data.res.public_id;

      await AxiosClient.post("posts", body);
    } else if (type === EDIT_POST) {
      const oldPublicId = editPost?.public_id;

      if (imageUrl instanceof File) {
        const typeImages = /image\/(png|jpg|jpeg|svg|webp)/gi.test(
          imageUrl.type,
        );

        if (imageUrl.size > 2 * 1024 * 1024 || !typeImages) {
          toast.error(
            "Image Size should be <= 2MB and type should be (svg, png, jpg)",
          );

          return;
        }

        const formData = new FormData();

        formData.append("file", imageUrl);

        formData.append("folderName", "cloudinary-tutorial");

        const { data } = await axios.post("/api/fileupload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (data.error) {
          toast.error("Error uploading image");

          return;
        }

        body.imageUrl = data.res.secure_url;
        body.public_id = data.res.public_id;
      }

      if (Object.keys(body).length === 0) {
        toast.error("No changes found");

        return;
      }

      await AxiosClient.patch(`posts/${editPost?.id}`, body);

      if (imageUrl instanceof File && oldPublicId) {
        await axios.delete("/api/fileupload", {
          data: {
            public_id: oldPublicId,
          },
        });
      }

      router.refresh();
      router.back();
      setEditPost?.(null);
    }

    setForm?.({
      imageUrl: "",
      caption: "",
    });

    toast.success(`${type} Post Successfully`);
  } catch {
    toast.error("Oops, Please try again.");
  } finally {
    setValid?.(false);
    setLoading?.(false);
  }
};

export const handleSubmitUpdateProfile = async (
  form: IFormSign_up,
  user: IUser | null,
  setUser: Dispatch<SetStateAction<IUser | null>>,
  router: AppRouterInstance,
  setValid: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const updatedData: Partial<IFormSign_up> = {};

  if (form.name.trim() !== user?.name?.trim())
    updatedData.name = form.name.trim();

  if (form.userName.trim() !== user?.userName?.trim())
    updatedData.userName = form.userName.trim();

  if (form.bio.trim() !== (user?.bio?.trim() || ""))
    updatedData.bio = form.bio.trim();

  if (Object.keys(updatedData).length === 0)
    return toast.error("No changes detected");

  try {
    setLoading(true);
    setValid(true);

    await AxiosClient.patch(`users/${user?.id}`, updatedData);

    setUser((pre) => {
      if (!pre) return null;

      return {
        ...pre,
        ...updatedData,
      } as IUser;
    });
    router.refresh();
    router.back();
    toast.success("Profile Updated successfully");
  } catch {
    toast.error("Error updating profile");
  } finally {
    setLoading(false);
    setValid(false);
  }
};

export const handleRemovePosts = async (
  postId: string,
  router: AppRouterInstance,
) => {
  try {
    await AxiosClient.delete(`posts/${postId}`);

    router.refresh();

    router.push("/");

    toast.success("Post deleted");
  } catch {
    toast.error("Failed to delete post, please try again.");
  }
};

export const handleTogleFollowing = async (
  userFollowId: string,
  setIsFollow: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const { data } = await AxiosClient.post(`followers/${userFollowId}`);
    setIsFollow(data.data);
    if (data.status === "success") toast.success(data.message);
  } catch {
    toast.error("something went wrong, Please try again.");
  }
};

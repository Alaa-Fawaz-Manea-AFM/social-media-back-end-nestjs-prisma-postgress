"use client";
import { Save_Icon, Saved_Icon } from "@/public/assets";
import { useUserContext } from "@/context/MyState";
import { handleToggleSaved } from "@/constant/api";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import Image from "next/image";

const BtnSaved = ({
  savedPage,
  postId,
  isSaved,
}: {
  savedPage?: boolean;
  postId: string;
  isSaved: boolean;
}) => {
  const { user } = useUserContext();
  const router = useRouter();

  const [saved, setSaved] = useState<boolean>(isSaved || false);

  const handleBtnRout = () => {
    if (user?.id) {
      handleToggleSaved(postId, setSaved);
      if (savedPage) router.refresh();
      return;
    }

    return router.push("/log-in");
  };

  return (
    <div className="flex items-center gap-1">
      <Image
        onClick={handleBtnRout}
        src={
          savedPage ? Saved_Icon : user?.id && saved ? Saved_Icon : Save_Icon
        }
        alt="Saved_Icon"
        width={32}
        height={32}
        className="cursor-pointer"
        unoptimized
      />
    </div>
  );
};

export default BtnSaved;

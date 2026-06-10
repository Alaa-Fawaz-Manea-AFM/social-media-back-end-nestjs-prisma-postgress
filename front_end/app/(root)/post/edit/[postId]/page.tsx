import { Form_Create_And_Update_post } from "@/components/index";
import { EDIT_POST } from "@/constant/Constant";
import { Edit } from "@/public/assets";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Update Post",
  description: "Page Update Posts",
};

const UpdatePostPage = () => (
  <div className="h-screen overflow-y-scroll max-ssx:pb-56 max-ssx:pt-20 max-w-5xl py-10 mx-auto">
    <div className="flex items-center gap-5 mb-10">
      <span>
        <Image src={Edit} alt="edit" width={30} height={30} unoptimized />
      </span>
      <h2 className="text-2xl font-semibold">Edit Post</h2>
    </div>
    <Form_Create_And_Update_post type={EDIT_POST} />
  </div>
);

export default UpdatePostPage;

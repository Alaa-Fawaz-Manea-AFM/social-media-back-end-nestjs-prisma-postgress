import { Form_Create_And_Update_post } from "@/components/index";
import { CREATE_POST } from "@/constant/Constant";
import { Add_Post } from "@/public/assets";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Create Posts",
  description: "Create the posts",
};

const CreatePostPage = () => (
  <div className="h-screen overflow-y-scroll max-ssx:pb-56 max-ssx:pt-20 max-w-5xl py-10 mx-auto">
    <div className="flex items-center gap-5 mb-10">
      <Image
        src={Add_Post}
        alt="Posts_Icon"
        width={30}
        height={30}
        unoptimized
      />

      <h2 className="text-2xl font-semibold">Create Post</h2>
    </div>

    <Form_Create_And_Update_post type={CREATE_POST} />
  </div>
);

export default CreatePostPage;

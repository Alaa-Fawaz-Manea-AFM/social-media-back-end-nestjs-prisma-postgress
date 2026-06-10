import { Form_Update_Profile } from "@/components";
import { Edit } from "@/public/assets";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Update Proflie",
  description: "Page Update Proflie",
};

const EditProfilePage = () => (
  <div className="h-screen overflow-y-scroll space-y-10 max-w-lg max-ssx:px-5 max-ssx:pb-28 max-ssx:pt-20 pb-16 ssx:py-10 ssx:pl-7">
    <div className="w-fit space-x-2 rounded-lg font-semibold flex items-center">
      <Image src={Edit} alt="edit" width={30} height={30} unoptimized />

      <span className="text-2xl">Edit Profile</span>
    </div>

    <Form_Update_Profile />
  </div>
);

export default EditProfilePage;

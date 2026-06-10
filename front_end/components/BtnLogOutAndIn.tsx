"use client";
import { useUserContext } from "@/context/MyState";
import { useRouter } from "next/navigation";
import { Log_Out } from "@/public/assets";
import { BiLogIn } from "react-icons/bi";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import AxiosClient from "@/lib/axios-client";
import { toast } from "react-toastify";

type IBtnLog = {
  user: IUser | null;
  toggleMenu: boolean;
};

const BtnLogOutAndIn = ({ user, toggleMenu }: IBtnLog) => {
  const { setUser } = useUserContext();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      AxiosClient.post("auth/logout");
      setUser(null);
      router.refresh();
    } catch {
      toast.error("Error logOut");
    }
  };

  return (
    <>
      {user?.id ? (
        <div
          title="Log Out"
          onClick={handleSignOut}
          className="flex items-center ssx:pl-8 gap-3 cursor-pointer"
        >
          <Image
            width={35}
            height={30}
            src={Log_Out}
            alt="Log Out"
            className="cursor-pointer"
            unoptimized
          />
          {!toggleMenu && <span className="font-semibold text-xl">LogOut</span>}
        </div>
      ) : (
        <Link
          title="Log in"
          href="/log-in"
          className="flex items-center ssx:pl-8 gap-3 cursor-pointer"
        >
          <BiLogIn size={35} color="#877EFF" />
          {!toggleMenu && <span className="font-semibold text-xl">Log in</span>}
        </Link>
      )}
    </>
  );
};

export default BtnLogOutAndIn;

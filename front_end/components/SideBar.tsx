"use client";
import { BtnLogOutAndIn, GobackPage, NavLink, UserInfCercle } from "./index";
import { useUserContext } from "@/context/MyState";
import { Logo, Fav_icon } from "@/public/assets";
import { GiHamburgerMenu } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const SideBar = () => {
  const { user } = useUserContext();
  const pathname = usePathname();
  const router = useRouter();

  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [toggleLogOut, setToggleLogOut] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storage = localStorage.getItem("Toggle_menu_Snapgram");
    if (storage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToggleMenu(JSON.parse(storage));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggleLogOut(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToggleLogOut(false);
  }, [pathname]);

  const handleToggle = () => {
    localStorage.setItem("Toggle_menu_Snapgram", JSON.stringify(!toggleMenu));
    setToggleMenu(!toggleMenu);
  };

  const GoBack = /[^/]/gi.test(pathname);

  return (
    <div className="relative">
      <div
        className={`${
          toggleMenu ? "ssx:w-32" : "ssx:w-64"
        } duration-300 justify-between items-center flex max-ssx:fixed bg-black/50 z-10 top-0 w-full max-w-screen-xl xxs:flex gap-5 ssx:flex-col ssx:h-screen ssx:items-start pb-5`}
      >
        <div
          onClick={() => router.push("/")}
          className="ssx:flex ssx:items-center ssx:justify-center w-full ssx:pt-10 px-5 py-2 cursor-pointer"
        >
          <Image
            width={!toggleMenu ? 170 : 48}
            height={!toggleMenu ? 85 : 48}
            src={!toggleMenu ? Logo : Fav_icon}
            alt="snapgram"
            className={`${toggleMenu ? "mr-5" : ""} max-ssx:hidden`}
          />
          <Image
            src={Logo}
            alt="snapgram"
            width={200}
            height={36}
            className="ssx:hidden"
          />
        </div>

        <div className="flex flex-row-reverse ssx:h-full ssx:flex-col ssx:justify-between gap-2">
          {/* 3. ربطنا الـ Container بالـ dropdownRef هنا ليراقب الزائر والمستخدم معاً */}
          <div
            ref={dropdownRef}
            className="flex relative items-center justify-center gap-2 max-ssx:pr-5"
          >
            {!user ? (
              <div className="relative flex items-center gap-2">
                <span className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-xl w-10 h-10 ssx:w-12 ssx:h-12 max-ssx:hidden">
                  G
                </span>

                <span
                  onClick={() => setToggleLogOut((pre) => !pre)}
                  className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-xl w-10 h-10 ssx:w-12 ssx:h-12 cursor-pointer ssx:hidden"
                >
                  G
                </span>

                {toggleLogOut && (
                  <div className="absolute space-y-3 p-4 right-5 rounded-xl top-12 ssx:hidden sidebar bg-gray-gradient z-20 min-w-44 text-center sm:hidden">
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/log-in"
                        className="text-sm font-medium bg-light-purple hover:bg-[#6c63ff] py-1.5 px-3 rounded-md duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        href="/sign-up"
                        className="text-sm font-medium border border-light-purple text-light-purple hover:bg-light-purple hover:text-white py-1.5 px-3 rounded-md duration-200"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                )}

                {!toggleMenu && (
                  <div className="flex flex-col gap-1 max-ssx:hidden">
                    <div className="flex items-center gap-2">
                      <Link
                        href="/log-in"
                        className="text-sm font-semibold text-white hover:text-light-purple duration-200"
                      >
                        Login
                      </Link>
                      <span className="text-gray-500">|</span>
                      <Link
                        href="/sign-up"
                        className="text-sm font-semibold text-white hover:text-light-purple duration-200"
                      >
                        Sign up
                      </Link>
                    </div>
                    <span className="text-[#7878A3] text-xs">
                      Welcome to Snapgram
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative flex items-center gap-3">
                <Link
                  href="/user/profile"
                  className="flex items-center justify-center font-semibold bg-green-700 hover:bg-green-800 rounded-full text-xl w-10 h-10 ssx:w-12 ssx:h-12 cursor-pointer max-ssx:hidden duration-200 select-none"
                >
                  {user?.name?.slice(0, 1).toUpperCase()}
                </Link>

                <span
                  onClick={() => setToggleLogOut((pre) => !pre)}
                  className="flex items-center justify-center font-semibold bg-green-700 rounded-full text-xl w-10 h-10 ssx:w-12 ssx:h-12 cursor-pointer ssx:hidden select-none"
                >
                  {user?.name?.slice(0, 1).toUpperCase()}
                </span>

                {toggleLogOut && (
                  <div className="absolute flex flex-col items-center space-y-4 p-5 right-0 rounded-xl top-14 ssx:hidden sidebar bg-[#1F1F22] z-50 min-w-46 shadow-xl">
                    <UserInfCercle user={user} />
                    <div className="w-full pt-2">
                      <BtnLogOutAndIn user={user} toggleMenu={toggleMenu} />
                    </div>
                  </div>
                )}

                {!toggleMenu && (
                  <div className="flex flex-col max-ssx:hidden text-left justify-center">
                    <h2 className="text-sm font-bold text-white line-clamp-1">
                      {user?.name}
                    </h2>
                    <span className="text-[#7878A3] text-xs line-clamp-1">
                      @{user?.userName?.replace(/^@/, "")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className="max-ssx:fixed max-ssx:grid max-ssx:grid-cols-5 left-0 bottom-0 px-5 bg-black/50 z-10 w-full ssx:my-5 ssx:flex ssx:flex-col ssx:h-full gap-2 ssx:gap-10">
            <NavLink toggleMenu={toggleMenu} pathname={pathname} />
          </ul>

          <div className="max-ssx:hidden w-full px-5">
            <BtnLogOutAndIn user={user} toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>

      <>
        <span
          onClick={handleToggle}
          className="absolute z-10 max-ssx:hidden p-2 top-10 right-0 cursor-pointer"
        >
          <GiHamburgerMenu size={30} />
        </span>
        {GoBack ? <GobackPage /> : ""}
      </>
    </div>
  );
};

export default SideBar;

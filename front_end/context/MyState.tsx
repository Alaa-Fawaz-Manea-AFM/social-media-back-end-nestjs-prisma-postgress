"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getUserData } from "@/constant/api";
import { IPosts, IUser } from "@/types";

type IValue = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  editPost: IPosts | null;
  setEditPost: Dispatch<SetStateAction<IPosts | null>>;
};

const MyContext = createContext<IValue | null>(null);

export const useUserContext = () => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("useUserContext must be used within MyState");
  }

  return context;
};

const MyState = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [editPost, setEditPost] = useState<IPosts | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      editPost,
      setEditPost,
    }),
    [user, editPost],
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyState;

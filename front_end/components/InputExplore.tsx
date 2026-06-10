"use client";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

const InputExplore = ({ search }: { search: string }) => {
  const router = useRouter();
  const [_search, set_Search] = useState(search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const trimmedValue = value.trim().length > 0 ? value : "";
    if (value.trim().length > 0 && !trimmedValue.trim()) return;
    set_Search(trimmedValue);
    router.push(`?search=${trimmedValue.trim()}`);
  };

  return (
    <input
      value={_search}
      onChange={handleSearch}
      type="search"
      name="search"
      id="search"
      className="w-full outline-none border-none bg-transparent"
      placeholder="search..."
    />
  );
};

export default InputExplore;

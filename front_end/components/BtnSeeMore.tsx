"use client";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";

const BtnSeeMore = ({
  details = "",
  length,
}: {
  details: string;
  length: number;
}) => {
  const [seeMore, setSeeMore] = useState<boolean>(false);

  return (
    <div>
      {details?.length > length ? (
        <div className="flex flex-col gap-3">
          {seeMore ? details : `${details.slice(0, 250)}...`}
          <button
            className={`${
              seeMore ? "text-[#EF4444]" : "text-[#22C55E]"
            } w-fit flex gap-2 items-center`}
            onClick={() => setSeeMore(!seeMore)}
          >
            {seeMore ? (
              <>
                <MdKeyboardArrowUp /> See Less
              </>
            ) : (
              <>
                <IoIosArrowDown /> See More
              </>
            )}
          </button>
        </div>
      ) : (
        details
      )}
    </div>
  );
};

export default BtnSeeMore;

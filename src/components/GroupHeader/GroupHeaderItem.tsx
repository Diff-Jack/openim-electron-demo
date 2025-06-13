import React, { FC, ReactNode, useCallback, useState } from "react";

interface IGroupHeaderItemProps {
  src: string;
  title: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const GroupHeaderItem: FC<IGroupHeaderItemProps> = ({ src, title, onClick }) => {
  return (
    <div
      className="flex flex-col items-center rounded-xl bg-white p-3"
      onClick={onClick}
    >
      <img src={src} alt="" width={16} className="" />
      <div className="mt-2 text-sm text-[#8F8F8F]">{title}</div>
    </div>
  );
};

export default GroupHeaderItem;

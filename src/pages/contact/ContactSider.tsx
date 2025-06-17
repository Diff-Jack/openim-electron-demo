import { Badge } from "antd";
import clsx from "clsx";
import i18n, { t } from "i18next";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import my_friends from "@/assets/images/contact/my_friends.png";
import new_friends from "@/assets/images/contact/new_friends.png";
import FlexibleSider from "@/components/FlexibleSider";
import { useContactStore } from "@/store";
import { emit } from "@/utils/events";

const Links = [
  {
    label: t("placeholder.newFriends"),
    icon: new_friends,
    path: "/contact/newFriends",
  },
  // {
  //   label: t("placeholder.groupNotification"),
  //   icon: group_notifications,
  //   path: "/contact/groupNotifications",
  // },
  {
    label: t("placeholder.myFriend"),
    icon: my_friends,
    path: "/contact",
  },
  // {
  //   label: t("placeholder.myGroup"),
  //   icon: my_groups,
  //   path: "/contact/myGroups",
  // },
];

i18n.on("languageChanged", () => {
  Links[0].label = t("placeholder.newFriends");
  Links[1].label = t("placeholder.groupNotification");
  Links[2].label = t("placeholder.myFriend");
  Links[3].label = t("placeholder.myGroup");
});

const AddIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <rect
        width="15.6172"
        height="1.72304"
        rx="0.861518"
        transform="matrix(1.02408 -0.00376701 0.00395519 -0.975312 0 9.07031)"
      />
      <rect
        width="16.3983"
        height="1.723"
        rx="0.8615"
        transform="matrix(0.00395519 0.975312 1.02408 0.00376701 7.10791 0)"
      />
    </svg>
  );
};

interface AddProps extends React.HTMLAttributes<HTMLDivElement> {
  onAdd?: () => void;
}

const Add: React.FC<AddProps> = ({ onAdd, ...divProps }) => {
  return (
    <div className="flex justify-center py-3" {...divProps}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="inline-flex items-center rounded-[62px] bg-[#DCFFF4] px-[30px] py-[11px] text-[#17B09E]"
        onClick={onAdd}
      >
        <AddIcon className="mr-[14px]" /> Add new friend
      </motion.button>
    </div>
  );
};

const ContactSider = () => {
  const [selectIndex, setSelectIndex] = useState(1);
  const unHandleFriendApplicationCount = useContactStore(
    (state) => state.unHandleFriendApplicationCount,
  );
  const unHandleGroupApplicationCount = useContactStore(
    (state) => state.unHandleGroupApplicationCount,
  );
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/contact/newFriends")) {
      setSelectIndex(0);
    } else if (location.pathname.includes("/contact")) {
      setSelectIndex(1);
    }
  }, [location.pathname]);

  const getBadge = (index: number) => {
    if (index === 0) {
      return unHandleFriendApplicationCount;
    }
    if (index === 1) {
      return unHandleGroupApplicationCount;
    }
    return 0;
  };

  const handleAdd = () => {
    emit("OPEN_ADD", 0);
  };

  return (
    <FlexibleSider needHidden={true}>
      <div className="h-full bg-white">
        <Add onAdd={handleAdd} />
        <ul className="border-t-[1px] border-[#e6e6e663]">
          {Links.map((item, index) => {
            return (
              <li
                key={item.path}
                className={clsx(
                  "flex cursor-pointer items-center border-b-[1px] border-l-[1px] border-[#e6e6e663] px-[19px] py-3 text-sm hover:bg-[#F3F3F3]",
                  { "bg-[#F3F3F3]": index === selectIndex },
                )}
                onClick={() => {
                  setSelectIndex(index);
                  navigate(String(item.path));
                }}
              >
                <Badge size="small" count={getBadge(index)}>
                  <img
                    alt={item.label}
                    src={item.icon}
                    className="mr-4.5 h-auto w-[60px] rounded-md"
                  />
                </Badge>
                <div className="text-base text-[#494949]">{item.label}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </FlexibleSider>
  );
};
export default ContactSider;

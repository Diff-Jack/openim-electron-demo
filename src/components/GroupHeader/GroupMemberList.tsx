import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import clsx from "clsx";
import { t } from "i18next";
import { memo, useEffect } from "react";

import invite from "@/assets/images/chatSetting/invite.png";
import kick from "@/assets/images/chatSetting/kick.png";
import GroupHeaderTab from "@/components/GroupHeader/GroupHeaderTab";
import OIMAvatar from "@/components/OIMAvatar";
import useGroupMembers from "@/hooks/useGroupMembers";
import { emit } from "@/utils/events";

import styles from "./index.module.scss";

const GroupMemberList = ({ currentGroupInfo }: { currentGroupInfo: GroupItem }) => {
  const { fetchState, getMemberData, resetState } = useGroupMembers();

  useEffect(() => {
    if (currentGroupInfo?.groupID) {
      getMemberData(true);
    }
    return () => {
      resetState();
    };
  }, [currentGroupInfo?.groupID]);

  const handleTabChange = (index: number) => {
    console.log("当前选中 Tab 索引:", index);
    // 根据 index 切换内容等逻辑
  };

  return (
    <div className="p-4 pt-2">
      <GroupHeaderTab
        tabs={["Agent Members", "Friends Members"]}
        onChange={handleTabChange}
      />
      <div className="flex flex-col items-center">
        {fetchState.groupMemberList.map((member) => (
          <div
            key={member.userID}
            title={member.nickname}
            className={styles["member-item-col"]}
            onClick={() => window.userClick(member.userID, member.groupID)}
          >
            <OIMAvatar src={member.faceURL} text={member.nickname} size={48} />
            <div className="ml-6 flex max-h-[48px] max-w-full flex-col">
              <div className="max-w-full truncate text-base font-medium">
                {member.nickname}
              </div>
              <div className="max-w-full truncate text-xs text-[#B0B0B0]">
                {member.userID}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(GroupMemberList);

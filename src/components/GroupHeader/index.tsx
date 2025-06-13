import { Switch, Upload } from "antd";
import { t } from "i18next";
import { FC, ReactNode, useCallback, useState } from "react";
import { useCopyToClipboard } from "react-use";

import addIcon from "@/assets/images/chatSetting/add.png";
import copy from "@/assets/images/chatSetting/copy.png";
import quiteIcon from "@/assets/images/chatSetting/quite.png";
import EditableContent from "@/components/EditableContent";
import GroupHeaderItem from "@/components/GroupHeader/GroupHeaderItem";
import OIMAvatar from "@/components/OIMAvatar";
import { FileWithPath } from "@/pages/chat/queryChat/ChatFooter/SendActionBar/useFileMessage";
import { useGroupSettings } from "@/pages/chat/queryChat/GroupSetting/useGroupSettings";
import { feedbackToast } from "@/utils/common";
import { uploadFile } from "@/utils/imCommon";

interface IGroupHeaderProps {
  hasPermissions: boolean;
  className?: string;
  addAgentClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  addFriendClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  muteClick?: (isMuted: boolean) => void;
  quiteClick?: () => void;
  closeOverlay: () => void;
}

const GroupHeader: FC<IGroupHeaderProps> = ({
  hasPermissions,
  className,
  addAgentClick,
  addFriendClick,
  muteClick,
  quiteClick,
  closeOverlay,
}) => {
  const { currentGroupInfo, updateGroupInfo, tryQuitGroup, tryDismissGroup } =
    useGroupSettings({ closeOverlay });

  const [_, copyToClipboard] = useCopyToClipboard();

  const customUpload = async ({ file }: { file: FileWithPath }) => {
    try {
      const {
        data: { url },
      } = await uploadFile(file);
      await updateGroupInfo({ faceURL: url });
    } catch (error) {
      feedbackToast({ error: t("toast.updateAvatarFailed") });
    }
  };

  const updateGroupName = useCallback(
    async (groupName: string) => {
      await updateGroupInfo({ groupName });
    },
    [updateGroupInfo],
  );

  return (
    <div className="flex flex-col items-center bg-[linear-gradient(to_bottom,rgba(255,255,255,1),rgba(235,255,250,1))]">
      <Upload
        accept="image/*"
        // className={clsx({ "disabled-upload": isNomal })}
        // openFileDialogOnClick={hasPermissions}
        openFileDialogOnClick={false}
        showUploadList={false}
        customRequest={customUpload as any}
      >
        <div className="relative">
          <OIMAvatar
            isgroup
            size={85}
            src={currentGroupInfo?.faceURL}
            text={currentGroupInfo?.groupName}
          />
        </div>
      </Upload>
      <EditableContent
        textClassName="font-medium text-base"
        value={currentGroupInfo?.groupName}
        editable={hasPermissions}
        onChange={updateGroupName}
      />
      <div className="mt-1 flex items-center">
        <div className="text-sm text-[#8F8F8F]">ID:{currentGroupInfo?.groupID}</div>
        <img
          className="ml-2 cursor-pointer"
          width={14}
          src={copy}
          alt=""
          onClick={() => {
            copyToClipboard(currentGroupInfo?.groupID ?? "");
            feedbackToast({ msg: t("toast.copySuccess") });
          }}
        />
      </div>
      <div className="mb-6 mt-6 flex flex-1 items-center gap-3">
        <GroupHeaderItem src={addIcon} title={"Add agent"} onClick={addAgentClick} />
        <GroupHeaderItem src={addIcon} title={"Add friend"} onClick={addFriendClick} />
        <GroupHeaderItem src={quiteIcon} title={"Quite"} onClick={quiteClick} />
      </div>
    </div>
  );
};

export default GroupHeader;

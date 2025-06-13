import { RightOutlined } from "@ant-design/icons";
import { Button, Divider, Upload } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { memo, useCallback } from "react";
import { useCopyToClipboard } from "react-use";

import copy from "@/assets/images/chatSetting/copy.png";
import edit_avatar from "@/assets/images/chatSetting/edit_avatar.png";
import EditableContent from "@/components/EditableContent";
import OIMAvatar from "@/components/OIMAvatar";
import SettingRow from "@/components/SettingRow";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import { feedbackToast } from "@/utils/common";
import { emit } from "@/utils/events";
import { uploadFile } from "@/utils/imCommon";

import { FileWithPath } from "../ChatFooter/SendActionBar/useFileMessage";
import GroupMemberRow from "./GroupMemberRow";
import { useGroupSettings } from "./useGroupSettings";
import GroupHeader from "@/components/GroupHeader";
import GroupMemberList from "@/components/GroupHeader/GroupMemberList";

const GroupInfo = ({
  updateTravel,
  closeOverlay,
}: {
  updateTravel: () => void;
  closeOverlay: () => void;
}) => {
  const { isNomal, isOwner, isAdmin, isJoinGroup } = useCurrentMemberRole();

  const { currentGroupInfo, updateGroupInfo, tryQuitGroup, tryDismissGroup } =
    useGroupSettings({ closeOverlay });

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

  const transferGroup = () => {
    emit("OPEN_CHOOSE_MODAL", {
      type: "TRANSFER_IN_GROUP",
      extraData: currentGroupInfo?.groupID,
    });
  };

  const inviteMember = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    emit("OPEN_CHOOSE_MODAL", {
      type: "INVITE_TO_GROUP",
      extraData: currentGroupInfo?.groupID,
    });
  };

  const hasPermissions = isAdmin || isOwner;

  return (
    <div className="flex h-full flex-col">
      {/*<div className="flex flex-col items-center">*/}
      {/*  <Upload*/}
      {/*    accept="image/*"*/}
      {/*    className={clsx({ "disabled-upload": isNomal })}*/}
      {/*    // openFileDialogOnClick={hasPermissions}*/}
      {/*    openFileDialogOnClick={false}*/}
      {/*    showUploadList={false}*/}
      {/*    customRequest={customUpload as any}*/}
      {/*  >*/}
      {/*    <div className="relative">*/}
      {/*      <OIMAvatar*/}
      {/*        isgroup*/}
      {/*        size={85}*/}
      {/*        src={currentGroupInfo?.faceURL}*/}
      {/*        text={currentGroupInfo?.groupName}*/}
      {/*      />*/}
      {/*      /!*{hasPermissions && (*!/*/}
      {/*      /!*  <img*!/*/}
      {/*      /!*    className="absolute -bottom-1 -right-1"*!/*/}
      {/*      /!*    width={15}*!/*/}
      {/*      /!*    src={edit_avatar}*!/*/}
      {/*      /!*    alt="edit avatar"*!/*/}
      {/*      /!*  />*!/*/}
      {/*      /!*)}*!/*/}
      {/*    </div>*/}
      {/*  </Upload>*/}
      {/*  <EditableContent*/}
      {/*    textClassName="font-medium text-base"*/}
      {/*    value={currentGroupInfo?.groupName}*/}
      {/*    editable={hasPermissions}*/}
      {/*    onChange={updateGroupName}*/}
      {/*  />*/}
      {/*  <div className="mt-1 flex items-center">*/}
      {/*    <div className="text-sm text-[#8F8F8F]">ID:{currentGroupInfo?.groupID}</div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <GroupHeader
        hasPermissions={hasPermissions}
        closeOverlay={closeOverlay}
        addFriendClick={inviteMember}
        addAgentClick={inviteMember}
        quiteClick={tryQuitGroup}
      />

      {/*<Divider className="m-0 border-4 border-[#F4F5F7]" />*/}
      {currentGroupInfo && isJoinGroup && (
        <GroupMemberList currentGroupInfo={currentGroupInfo} />
      )}
      {/*<Divider className="m-0 border-4 border-[#F4F5F7]" />*/}

      {/*<Divider className="m-0 border-4 border-[#F4F5F7]" />*/}
      {/*<SettingRow className="pb-2" title={`${t("placeholder.group")}ID`}>*/}
      {/*  <div className="flex items-center">*/}
      {/*    <span className="mr-1 text-xs text-[var(--sub-text)]">*/}
      {/*      {currentGroupInfo?.groupID}*/}
      {/*    </span>*/}
      {/*    <img*/}
      {/*      className="cursor-pointer"*/}
      {/*      width={14}*/}
      {/*      src={copy}*/}
      {/*      alt=""*/}
      {/*      onClick={() => {*/}
      {/*        copyToClipboard(currentGroupInfo?.groupID ?? "");*/}
      {/*        feedbackToast({ msg: t("toast.copySuccess") });*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</SettingRow>*/}
      {/*<SettingRow title={t("placeholder.groupTppe")}>*/}
      {/*  <span className="text-xs text-[var(--sub-text)]">*/}
      {/*    {t("placeholder.workGroup")}*/}
      {/*  </span>*/}
      {/*</SettingRow>*/}

      {/*<Divider className="m-0 border-4 border-[#F4F5F7]" />*/}

      {/*{isOwner && (*/}
      {/*  <>*/}
      {/*    <Divider className="m-0 border-4 border-[#F4F5F7]" />*/}
      {/*    <SettingRow*/}
      {/*      className="cursor-pointer"*/}
      {/*      title={t("placeholder.transferGroup")}*/}
      {/*      rowClick={transferGroup}*/}
      {/*    >*/}
      {/*      <RightOutlined rev={undefined} />*/}
      {/*    </SettingRow>*/}
      {/*  </>*/}
      {/*)}*/}

      {/*<div className="flex-1" />*/}
      {/*{isJoinGroup && (*/}
      {/*  <div className="flex w-full justify-center pb-3 pt-24">*/}
      {/*    {!isOwner ? (*/}
      {/*      <Button type="primary" danger ghost onClick={tryQuitGroup}>*/}
      {/*        {t("placeholder.exitGroup")}*/}
      {/*      </Button>*/}
      {/*    ) : (*/}
      {/*      <Button type="primary" danger onClick={tryDismissGroup}>*/}
      {/*        {t("placeholder.disbandGroup")}*/}
      {/*      </Button>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default memo(GroupInfo);

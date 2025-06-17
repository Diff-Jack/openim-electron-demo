import { ApplicationHandleResult } from "@openim/wasm-client-sdk";
import {
  FriendApplicationItem,
  GroupApplicationItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { Button, Spin } from "antd";
import { t } from "i18next";
import React, { memo, useCallback, useState } from "react";

import arrow from "@/assets/images/contact/arrowTopRight.png";
import checked from "@/assets/images/contact/checked.png";
import OIMAvatar from "@/components/OIMAvatar";
import { IMSDK } from "@/layout/MainContentWrap";
import { emit } from "@/utils/events";

type ApplicationItemSource = FriendApplicationItem & GroupApplicationItem;

export type AccessFunction = (
  source: Partial<ApplicationItemSource>,
  isRecv: boolean,
) => Promise<void>;

const ApplicationItem = ({
  currentUserID,
  source,
  onAccept,
  onReject,
}: {
  source: Partial<ApplicationItemSource>;
  currentUserID: string;
  onAccept: AccessFunction;
  onReject: AccessFunction;
}) => {
  const [loading, setLoading] = useState(false);
  const isRecv = source.userID !== currentUserID && source.fromUserID !== currentUserID;
  const isGroup = Boolean(source.groupID);
  const showActionBtn = source.handleResult === 0 && isRecv;

  const getApplicationDesc = () => {
    if (isGroup) {
      return t("application.applyToJoin");
    }
    return isRecv ? t("application.applyToFriend") : t("application.applyToAdd");
  };

  const getTitle = () => {
    if (isGroup) {
      return isRecv ? source.nickname : source.groupName;
    }
    return isRecv ? source.fromNickname : source.toNickname;
  };

  const getStatusStr = () => {
    if (source.handleResult === ApplicationHandleResult.Agree) {
      return t("application.agreed");
    }
    if (source.handleResult === ApplicationHandleResult.Reject) {
      return t("application.refused");
    }
    return t("application.pending");
  };

  const getAvatarUrl = () => {
    if (isGroup) {
      return isRecv ? source.userFaceURL : source.groupFaceURL;
    }
    return isRecv ? source.fromFaceURL : source.toFaceURL;
  };

  const loadingWrap = async (isAgree: boolean) => {
    setLoading(true);
    await (isAgree ? onAccept(source, isRecv) : onReject(source, isRecv));
    setLoading(false);
  };

  const tryShowCard = useCallback(async () => {
    if (isGroup) {
      const { data } = await IMSDK.getSpecifiedGroupsInfo([source.groupID!]);
      emit("OPEN_GROUP_CARD", data[0]);
      return;
    }
    window.userClick(isRecv ? source.fromUserID : source.toUserID);
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="mb-2 flex cursor-pointer flex-row items-center justify-between bg-gradient-to-r from-[rgba(255,255,255,0.39)] from-0% to-[rgba(230,230,230,0.1521)] to-100% py-[22px] pl-8 pr-12 transition-colors hover:bg-[#F3F3F3]">
        <div className="flex flex-row">
          <OIMAvatar
            src={getAvatarUrl()}
            text={getTitle()}
            isgroup={isGroup && !isRecv}
            onClick={tryShowCard}
          />
          <div className="ml-6">
            <p className="mb-2 text-base text-[#000000]">{getTitle()}</p>
            <p className="pb-2.5 pt-[5px] text-sm text-[#737373]">
              {getApplicationDesc()}
              {(isGroup || (!isGroup && !isRecv)) && (
                <span className="ml-1 text-[#17B09E]">
                  {source.groupName || source.toNickname}
                </span>
              )}
            </p>
            <p className="text-xs text-[#737373]">{t("application.information")}:</p>
            <p className="text-xs text-[#737373]">{source.reqMsg}</p>
          </div>
        </div>

        {showActionBtn && (
          <div className="flex flex-row">
            <div className="mr-2 h-[30px] w-[182px]">
              <Button
                block={true}
                size="small"
                onClick={() => loadingWrap(false)}
                className="border-1 !h-full !rounded-lg border-[#E5E5E5] text-[#515151]"
              >
                {t("application.refuse")}
              </Button>
            </div>
            <div className="h-[30px] w-[182px]">
              <Button
                block={true}
                size="small"
                type="primary"
                className="!h-full !rounded-lg border-none bg-[#88F5D4]"
                onClick={() => loadingWrap(true)}
              >
                {t("application.agree")}
              </Button>
            </div>
          </div>
        )}

        {!showActionBtn && (
          <div className="flex flex-row items-center">
            <StatusIcon isRecv={isRecv} status={source.handleResult} />
            <p className="text-sm text-[#7F7F7F]">{getStatusStr()}</p>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default memo(ApplicationItem);

const StatusIcon: React.FC<{
  isRecv: boolean;
  status?: ApplicationHandleResult;
}> = ({ isRecv, status }) => {
  if (isRecv) return null;

  switch (status) {
    case ApplicationHandleResult.Agree:
      return <img className="mr-2 h-4 w-4" src={checked} alt="" />;
    default:
      return <img className="mr-2 h-4 w-4" src={arrow} alt="" />;
  }
};

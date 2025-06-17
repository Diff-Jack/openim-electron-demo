import { ApplicationHandleResult } from "@openim/wasm-client-sdk";
import { FriendApplicationItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";

import ApplicationItem, { AccessFunction } from "@/components/ApplicationItem";
import { IMSDK } from "@/layout/MainContentWrap";
import { useUserStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";
import { calcApplicationBadge } from "@/utils/imCommon";

export const NewFriends = () => {
  const { t } = useTranslation();
  const currentUserID = useUserStore((state) => state.selfInfo.userID);

  const recvFriendApplicationList = useContactStore(
    (state) => state.recvFriendApplicationList,
  );
  const sendFriendApplicationList = useContactStore(
    (state) => state.sendFriendApplicationList,
  );
  const updateRecvFriendApplication = useContactStore(
    (state) => state.updateRecvFriendApplication,
  );
  const updateSendFriendApplication = useContactStore(
    (state) => state.updateSendFriendApplication,
  );

  const friendApplicationList = sortArray(
    recvFriendApplicationList.concat(sendFriendApplicationList),
  );

  const onAccept = useCallback(
    async (application: FriendApplicationItem, isRecv: boolean) => {
      try {
        await IMSDK.acceptFriendApplication({
          toUserID: application.fromUserID,
          handleMsg: "",
        });
        const newApplication = {
          ...application,
          handleResult: ApplicationHandleResult.Agree,
        };
        if (isRecv) {
          updateRecvFriendApplication(newApplication);
        } else {
          updateSendFriendApplication(newApplication);
        }
      } catch (error) {
        feedbackToast({ error });
      }
    },
    [],
  );

  const onReject = useCallback(
    async (application: FriendApplicationItem, isRecv: boolean) => {
      try {
        await IMSDK.refuseFriendApplication({
          toUserID: application.fromUserID,
          handleMsg: "",
        });
        const newApplication = {
          ...application,
          handleResult: ApplicationHandleResult.Reject,
        };
        if (isRecv) {
          updateRecvFriendApplication(newApplication);
        } else {
          updateSendFriendApplication(newApplication);
        }
      } catch (error) {
        feedbackToast({ error });
      }
    },
    [],
  );

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <p className="mb-5 mt-6 text-center text-base font-extrabold">
        {t("placeholder.newFriends")}
      </p>
      <div className="fixed bottom-0 h-[35vh] w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,1),rgba(235,255,250,1))] bg-cover" />
      <div className="flex-1 pb-3 pl-9 pr-10">
        <Virtuoso
          className="h-full overflow-x-hidden"
          data={friendApplicationList}
          itemContent={(_, item) => (
            <ApplicationItem
              key={`${
                currentUserID === item.fromUserID ? item.toUserID : item.fromUserID
              }${item.createTime}`}
              source={item}
              currentUserID={currentUserID}
              onAccept={onAccept as AccessFunction}
              onReject={onReject as AccessFunction}
            />
          )}
        />
      </div>
    </div>
  );
};

const sortArray = (list: FriendApplicationItem[]) => {
  list.sort((a, b) => {
    if (a.handleResult === 0 && b.handleResult !== 0) {
      return -1;
    } else if (b.handleResult === 0 && a.handleResult !== 0) {
      return 1;
    }
    return b.createTime - a.createTime;
  });
  return list;
};

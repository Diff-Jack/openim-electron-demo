import { CbEvents } from "@openim/wasm-client-sdk";
import { SessionType } from "@openim/wasm-client-sdk";
import {
  FriendUserItem,
  GroupMemberItem,
  WSEvent,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest } from "ahooks";
import { Button, Divider, Spin } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useCopyToClipboard } from "react-use";

import { BusinessUserInfo, getBusinessUserInfo } from "@/api/login";
import DraggableModalWrap from "@/components/DraggableModalWrap";
import EditableContent from "@/components/EditableContent";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationToggle } from "@/hooks/useConversationToggle";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useContactStore, useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";

import EditSelfInfo from "./EditSelfInfo";
import SendRequest from "./SendRequest";

interface IUserCardModalProps {
  userID?: string;
  groupID?: string;
  isSelf?: boolean;
  notAdd?: boolean;
  cardInfo?: CardInfo;
}

export type CardInfo = Partial<BusinessUserInfo & FriendUserItem>;

const SimpleUserCard: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  IUserCardModalProps
> = (props, ref) => {
  const { userID, isSelf, notAdd } = props;

  const editInfoRef = useRef<OverlayVisibleHandle>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [isSendRequest, setIsSendRequest] = useState(false);

  const selfInfo = useUserStore((state) => state.selfInfo);
  const isFriendUser = useContactStore(
    (state) => state.friendList.findIndex((item) => item.userID === userID) !== -1,
  );

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  const { toSpecifiedConversation } = useConversationToggle();
  const [_, copyToClipboard] = useCopyToClipboard();

  const getCardInfo = async (): Promise<{
    cardInfo: CardInfo;
    memberInfo?: GroupMemberItem | null;
  }> => {
    if (isSelf) {
      return {
        cardInfo: selfInfo,
      };
    }
    let userInfo: CardInfo | null = null;
    const friendInfo = useContactStore
      .getState()
      .friendList.find((item) => item.userID === userID);
    if (friendInfo) {
      userInfo = { ...friendInfo };
    } else {
      const { data } = await IMSDK.getUsersInfo([userID!]);
      userInfo = { ...(data[0] ?? {}) };
    }

    try {
      const {
        data: { users },
      } = await getBusinessUserInfo([userID!]);
      userInfo = { ...userInfo, ...users[0] };
    } catch (error) {
      console.error("get business user info failed", userID, error);
    }
    return {
      cardInfo: userInfo,
    };
  };

  const refreshData = (data?: { cardInfo: CardInfo | null }) => {
    if (!data) {
      return;
    }
    const { cardInfo } = data;

    setCardInfo(cardInfo!);
  };

  const {
    data: fullCardInfo,
    isLoading,
    refetch,
  } = useQuery(["userInfo", userID], getCardInfo, {
    enabled: isOverlayOpen && Boolean(userID),
    onSuccess: refreshData,
  });

  const latestFullCardInfo = useLatest(fullCardInfo);

  useEffect(() => {
    if (!isOverlayOpen) return;
    const friendAddedHandler = ({ data }: WSEvent<FriendUserItem>) => {
      if (data.userID === userID) {
        refetch();
      }
    };
    IMSDK.on(CbEvents.OnFriendAdded, friendAddedHandler);
    refreshData(
      props.cardInfo ? { cardInfo: props.cardInfo } : latestFullCardInfo.current,
    );
    return () => {
      IMSDK.off(CbEvents.OnFriendAdded, friendAddedHandler);
    };
  }, [isOverlayOpen, props.cardInfo]);

  const refreshSelfInfo = useCallback(() => {
    const latestInfo = useUserStore.getState().selfInfo;
    setCardInfo(latestInfo);
  }, [isSelf]);

  const backToCard = () => {
    setIsSendRequest(false);
  };

  const trySendRequest = () => {
    setIsSendRequest(true);
  };

  const resetState = () => {
    setCardInfo(undefined);
    setIsSendRequest(false);
  };

  const showAddFriend = !isFriendUser && !isSelf && !notAdd;

  return (
    <DraggableModalWrap
      title={null}
      footer={null}
      open={isOverlayOpen}
      closable={true}
      width={393}
      centered
      onCancel={closeOverlay}
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      afterClose={resetState}
      ignoreClasses=".ignore-drag, .no-padding-modal, .cursor-pointer"
      className="no-padding-modal-new"
      maskTransitionName=""
    >
      <Spin spinning={isLoading}>
        {isSendRequest ? (
          <SendRequest cardInfo={cardInfo!} backToCard={backToCard} />
        ) : (
          <div className="flex flex-col items-center gap-4 overflow-hidden px-5 pb-10 pt-[52px]">
            <div
              className="max-w-[100%] flex-1 select-text truncate text-xl font-medium text-black"
              title={cardInfo?.nickname}
            >
              {cardInfo?.nickname}
            </div>
            <div
              className="max-w-[100%] cursor-pointer truncate text-xs text-[rgb(0,0,0,0.54)]"
              onClick={() => {
                copyToClipboard(cardInfo?.userID ?? "");
                feedbackToast({ msg: t("toast.copySuccess") });
              }}
            >
              {cardInfo?.userID}
            </div>
            <div className="mx-1 flex w-full items-center gap-6">
              {showAddFriend && (
                <Button
                  type="primary"
                  className="h-[49px] flex-1"
                  onClick={trySendRequest}
                >
                  {t("placeholder.addFriends")}
                </Button>
              )}
              {isSelf && (
                <Button
                  type="primary"
                  className="h-[49px] flex-1"
                  onClick={() => editInfoRef.current?.openOverlay()}
                >
                  {t("placeholder.editInfo")}
                </Button>
              )}
              {!isSelf && !showAddFriend && (
                <Button
                  type="primary"
                  className="h-[49px] flex-1 text-sm font-semibold"
                  onClick={() =>
                    toSpecifiedConversation({
                      sourceID: userID!,
                      sessionType: SessionType.Single,
                    }).then(closeOverlay)
                  }
                >
                  {t("placeholder.sendMessage")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Spin>
      {/*<EditSelfInfo ref={editInfoRef} refreshSelfInfo={refreshSelfInfo} />*/}
    </DraggableModalWrap>
  );
};

export default memo(forwardRef(SimpleUserCard));

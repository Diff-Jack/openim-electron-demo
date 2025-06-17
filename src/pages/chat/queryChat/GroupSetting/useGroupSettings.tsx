import { CloseOutlined } from "@ant-design/icons";
import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Button } from "antd";
import { t } from "i18next";
import { useCallback, useRef } from "react";

import { modal } from "@/AntdGlobalComp";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

export type PermissionField = "applyMemberFriend" | "lookMemberInfo";

export function useGroupSettings({ closeOverlay }: { closeOverlay: () => void }) {
  const currentGroupInfo = useConversationStore((state) => state.currentGroupInfo);

  const modalRef = useRef<{
    destroy: () => void;
  } | null>(null);

  const updateGroupInfo = useCallback(
    async (value: Partial<GroupItem>) => {
      if (!currentGroupInfo) return;
      try {
        await IMSDK.setGroupInfo({
          ...value,
          groupID: currentGroupInfo.groupID,
        });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.updateGroupInfoFailed") });
      }
    },
    [currentGroupInfo?.groupID],
  );

  const tryDismissGroup = () => {
    if (!currentGroupInfo || modalRef.current) return;

    modalRef.current = modal.confirm({
      title: t("placeholder.disbandGroup"),
      content: (
        <div className="flex items-baseline">
          <div>{t("toast.confirmDisbandGroup")}</div>
          <span className="text-xs text-[var(--sub-text)]">
            {t("placeholder.disbandGroupToast")}
          </span>
        </div>
      ),
      onOk: async () => {
        try {
          await IMSDK.dismissGroup(currentGroupInfo.groupID);
          closeOverlay();
        } catch (error) {
          feedbackToast({ error });
        }
        modalRef.current = null;
      },
      onCancel: () => {
        modalRef.current = null;
      },
    });
  };

  const tryQuitGroup = () => {
    if (!currentGroupInfo || modalRef.current) return;

    modalRef.current = modal.info({
      title: null, // t("placeholder.exitGroup")
      icon: null,
      footer: null, // 隐藏默认底部按钮
      className: "rounded-md",
      // content: (
      //   <div className="flex items-baseline">
      //     <div>{t("toast.confirmExitGroup")}</div>
      //     <span className="text-xs text-[var(--sub-text)]">
      //       {t("placeholder.exitGroupToast")}
      //     </span>
      //   </div>
      // ),
      content: (
        <div className="flex flex-col items-center">
          <Button
            className="absolute right-2 top-2"
            type="text"
            icon={<CloseOutlined />}
            onClick={() => {
              modalRef.current = null;
            }}
          />
          <div className="mt-8 text-xl font-medium">{t("toast.confirmExitGroup")}</div>
          <div className="mt-6 flex items-baseline">
            <div className="text-xs text-[rgb(0,0,0,0.54)]">
              {t("toast.confirmExitGroup")}
              {t("placeholder.exitGroupToast")}
            </div>
            {/*<span className="text-xs text-[var(--sub-text)]">*/}
            {/*  {t("placeholder.exitGroupToast")}*/}
            {/*</span>*/}
          </div>
          <div className="mt-5 flex w-full flex-1">
            <Button
              type="primary"
              className="h-[49px] flex-1 text-sm font-semibold"
              onClick={async () => {
                try {
                  await IMSDK.quitGroup(currentGroupInfo.groupID);
                  closeOverlay();
                } catch (error) {
                  feedbackToast({ error });
                }
                modalRef.current = null;
              }}
            >
              {/*{t("placeholder.confirmExit")}*/}
              {"Yes, I want to quit"}
            </Button>
          </div>
        </div>
      ),
      onOk: async () => {
        try {
          await IMSDK.quitGroup(currentGroupInfo.groupID);
          closeOverlay();
        } catch (error) {
          feedbackToast({ error });
        }
        modalRef.current = null;
      },
      onCancel: () => {
        modalRef.current = null;
      },
    });
  };

  return {
    currentGroupInfo,
    updateGroupInfo,
    tryQuitGroup,
    tryDismissGroup,
  };
}

import { useMount } from "ahooks";
import { Layout, Spin } from "antd";
import { t } from "i18next";
import { useEffect, useMemo } from "react";
import { Outlet, useMatches, useNavigate } from "react-router-dom";

import { useContactStore, useConversationStore, useUserStore } from "@/store";
import { emit } from "@/utils/events";

import LeftNavBar from "./LeftNavBar";
import TopSearchBar from "./TopSearchBar";
import { useGlobalEvent } from "./useGlobalEvents";

export const MainContentLayout = () => {
  useGlobalEvent();
  const matches = useMatches();
  const navigate = useNavigate();

  const progress = useUserStore((state) => state.progress);
  const syncState = useUserStore((state) => state.syncState);
  const reinstall = useUserStore((state) => state.reinstall);
  const isLogining = useUserStore((state) => state.isLogining);
  const unReadCount = useConversationStore((state) => state.unReadCount);
  const unHandleFriendApplicationCount = useContactStore(
    (state) => state.unHandleFriendApplicationCount,
  );
  const unHandleGroupApplicationCount = useContactStore(
    (state) => state.unHandleGroupApplicationCount,
  );
  const contactsCount = useMemo(
    () => unHandleFriendApplicationCount + unHandleGroupApplicationCount,
    [unHandleFriendApplicationCount, unHandleGroupApplicationCount],
  );

  useMount(() => {
    const isRoot = !matches.find((item) => item.pathname !== "/");
    const inConversation = matches.some((item) => item.params.conversationID);
    if (isRoot || inConversation) {
      navigate("chat", {
        replace: true,
      });
    }
  });

  const loadingTip = isLogining ? t("toast.loading") : `${progress}%`;
  const showLockLoading = isLogining || (reinstall && syncState === "loading");

  const parentOrigin = import.meta.env.VITE_PARENT_IFRAME_ORIGIN as string;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== parentOrigin) {
        return;
      }

      const { action } = (event.data || {}) as {
        action: "copy_id" | "open_contact" | "open_messages";
      };

      const actionMapper = {
        copy_id: () => {
          emit("COPY_ID", "open");
        },
        open_contact: () => {
          emit("COPY_ID", "close");
          navigate("/contact");
        },
        open_messages: () => {
          emit("COPY_ID", "close");
          navigate("/chat");
        },
      };

      actionMapper[action]?.();
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendUnreadCount = (id: "messages" | "contacts", count?: number) => {
    window.parent.postMessage(
      {
        action: "update_unread_count",
        id: id,
        count: count,
      },
      parentOrigin,
    );
  };

  useEffect(() => {
    sendUnreadCount("messages", unReadCount);
  }, [unReadCount]);

  useEffect(() => {
    sendUnreadCount("contacts", contactsCount);
  }, [contactsCount]);

  return (
    <Spin className="!max-h-none" spinning={showLockLoading} tip={loadingTip}>
      <Layout className="h-full">
        <TopSearchBar />
        <Layout>
          <LeftNavBar />
          <Outlet />
        </Layout>
      </Layout>
    </Spin>
  );
};

import { useMount } from "ahooks";
import { Layout, Spin } from "antd";
import { t } from "i18next";
import React, { useEffect } from "react";
import { Outlet, useMatches, useNavigate } from "react-router-dom";

import { useUserStore } from "@/store";
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

  useEffect(() => {
    const parentOrigin = import.meta.env.VITE_PARENT_IFRAME_ORIGIN as string;
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== parentOrigin) {
        return;
      }

      const { action } = (event.data || {}) as {
        action: "copy_id" | "open_contact";
      };

      const actionMapper = {
        copy_id: () => {
          alert("copy_id");
        },
        open_contact: () => {
          emit("OPEN_CONTACT");
        },
      };

      actionMapper[action]?.();
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

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

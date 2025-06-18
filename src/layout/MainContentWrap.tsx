import { getWithRenderProcess } from "@openim/electron-client-sdk/lib/render";
import { AllowType } from "@openim/wasm-client-sdk";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useConversationStore, useUserStore } from "@/store";
import emitter, { emit } from "@/utils/events";
import { getIMToken, getIMUserID } from "@/utils/storage";

// const isElectronProd = import.meta.env.MODE !== "development" && window.electronAPI;

const { instance } = getWithRenderProcess({
  wasmConfig: {
    coreWasmPath: "./openIM.wasm",
    sqlWasmPath: `/sql-wasm.wasm`,
  },
});
const openIMSDK = instance;

export const IMSDK = openIMSDK;

export const MainContentWrap = () => {
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loginCheck = async () => {
      const IMToken = await getIMToken();
      const IMUserID = await getIMUserID();
      if (!IMToken || !IMUserID) {
        // todo delete
        navigate("/login");
        emit("LOGOUT", { type: "missing" });
        return;
      }
    };

    loginCheck();
  }, [location.pathname]);

  useEffect(() => {
    window.userClick = (userID?: string, groupID?: string) => {
      if (!userID || userID === "AtAllTag") return;

      const currentGroupInfo = useConversationStore.getState().currentGroupInfo;

      if (groupID && currentGroupInfo?.lookMemberInfo === AllowType.NotAllowed) {
        return;
      }

      emit("OPEN_USER_CARD", {
        userID,
        groupID,
        isSelf: userID === useUserStore.getState().selfInfo.userID,
        notAdd:
          Boolean(groupID) &&
          currentGroupInfo?.applyMemberFriend === AllowType.NotAllowed,
      });
    };
  }, []);

  useEffect(() => {
    const initSettingStore = async () => {
      if (!window.electronAPI) return;
      updateAppSettings({
        closeAction:
          (await window.electronAPI?.ipcInvoke("getKeyStore", {
            key: "closeAction",
          })) || "miniSize",
      });
      window.electronAPI?.ipcInvoke("main-win-ready");
    };

    initSettingStore();
  }, []);

  const parentOrigin = import.meta.env.VITE_PARENT_IFRAME_ORIGIN as string;

  useEffect(() => {
    const logoutHandler = ({
      type,
    }: {
      type: "kick" | "expired" | "quit" | "missing";
    }) => {
      window.parent.postMessage(
        {
          eventName: "logout",
          type,
        },
        parentOrigin,
      );
    };

    emitter.on("LOGOUT", logoutHandler);

    return () => emitter.off("LOGOUT", logoutHandler);
  }, []);

  return <Outlet />;
};

import { InfoCircleOutlined } from "@ant-design/icons";
import { SessionType } from "@openim/wasm-client-sdk";
import { useUnmount } from "ahooks";
import { Layout } from "antd";
import { t } from "i18next";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useConversationStore } from "@/store";

import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import useConversationState from "./useConversationState";

export const QueryChat = () => {
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );

  useConversationState();

  useUnmount(() => {
    updateCurrentConversation();
  });

  return (
    <Layout id="chat-container" className="relative overflow-hidden">
      <div className="fixed top-0 h-[65vh] w-full bg-white bg-cover" />
      <div className="fixed bottom-0 h-[35vh] w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,1),rgba(235,255,250,1))] bg-cover" />
      <ChatHeader />
      <PanelGroup direction="vertical">
        <Panel id="chat-main" order={0}>
          <ChatContent />
        </Panel>
        <PanelResizeHandle />
        <Panel
          id="chat-footer"
          order={1}
          defaultSize={20}
          maxSize={60}
          className="min-h-[150px]"
        >
          <ChatFooter />
        </Panel>
      </PanelGroup>
    </Layout>
  );
};

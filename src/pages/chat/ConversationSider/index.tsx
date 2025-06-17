import clsx from "clsx";
import { t } from "i18next";
import { motion } from "motion/react";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import sync from "@/assets/images/common/sync.png";
import sync_error from "@/assets/images/common/sync_error.png";
import SearchIcon from "@/assets/images/searchbar/search.png";
import FlexibleSider from "@/components/FlexibleSider";
import { useConversationStore, useUserStore } from "@/store";

import ConversationItemComp from "./ConversationItem";
import styles from "./index.module.scss";

const ConnectBar = () => {
  const userStore = useUserStore();
  const showLoading =
    userStore.syncState === "loading" || userStore.connectState === "loading";
  const showFailed =
    userStore.syncState === "failed" || userStore.connectState === "failed";

  const loadingTip =
    userStore.syncState === "loading" ? t("connect.syncing") : t("connect.connecting");

  const errorTip =
    userStore.syncState === "failed"
      ? t("connect.syncFailed")
      : t("connect.connectFailed");

  if (userStore.reinstall) {
    return null;
  }

  return (
    <>
      {showLoading && (
        <div className="flex h-6 items-center justify-center bg-[#0089FF] bg-opacity-10">
          <img
            src={sync}
            alt="sync"
            className={clsx("mr-1 h-3 w-3 ", styles.loading)}
          />
          <span className=" text-xs text-[#0089FF]">{loadingTip}</span>
        </div>
      )}
      {showFailed && (
        <div className="flex h-6 items-center justify-center bg-[#FF381F] bg-opacity-15">
          <img src={sync_error} alt="sync" className="mr-1 h-3 w-3" />
          <span className=" text-xs text-[#FF381F]">{errorTip}</span>
        </div>
      )}
    </>
  );
};

const Chat: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M17.6988 1.80273C18.8922 1.80273 20.0368 2.27684 20.8807 3.12075C21.7246 3.96467 22.1988 5.10926 22.1988 6.30274V12.5943C22.1988 15.1107 20.4108 17.0739 17.9496 17.0739C17.7109 17.0739 17.4819 16.9791 17.3132 16.8103C17.1444 16.6415 17.0496 16.4126 17.0496 16.1739C17.0496 15.9352 17.1444 15.7063 17.3132 15.5375C17.4819 15.3688 17.7109 15.2739 17.9496 15.2739C19.3764 15.2739 20.3976 14.1519 20.3976 12.5943V6.30274C20.3976 5.58665 20.1131 4.89989 19.6067 4.39355C19.1004 3.8872 18.4136 3.60273 17.6976 3.60273H8.03516C7.31907 3.60273 6.63232 3.8872 6.12597 4.39355C5.61962 4.89989 5.33516 5.58665 5.33516 6.30274C5.33516 6.42092 5.31188 6.53796 5.26665 6.64715C5.22142 6.75634 5.15513 6.85556 5.07155 6.93913C4.98798 7.0227 4.88876 7.089 4.77957 7.13423C4.67038 7.17946 4.55335 7.20273 4.43516 7.20273C4.31697 7.20273 4.19993 7.17946 4.09074 7.13423C3.98155 7.089 3.88233 7.0227 3.79876 6.93913C3.71519 6.85556 3.64889 6.75634 3.60366 6.64715C3.55844 6.53796 3.53516 6.42092 3.53516 6.30274C3.53516 5.10926 4.00926 3.96467 4.85318 3.12075C5.69709 2.27684 6.84168 1.80273 8.03516 1.80273H17.7H17.6988Z" />
      <path d="M15.2636 5.6875C16.2184 5.6875 17.1341 6.06678 17.8092 6.74192C18.4843 7.41705 18.8636 8.33272 18.8636 9.2875V16.2115C18.8636 17.1663 18.4843 18.082 17.8092 18.7571C17.1341 19.4322 16.2184 19.8115 15.2636 19.8115H11.9996L7.6664 22.0387C7.57489 22.0858 7.47279 22.1087 7.36991 22.1049C7.26704 22.1012 7.16685 22.0711 7.07899 22.0175C6.99112 21.9638 6.91853 21.8885 6.8682 21.7987C6.81787 21.7089 6.79149 21.6076 6.7916 21.5047V19.8127H5.6C4.64522 19.8127 3.72955 19.4334 3.05442 18.7583C2.37928 18.0832 2 17.1675 2 16.2127V9.2875C2 8.33272 2.37928 7.41705 3.05442 6.74192C3.72955 6.06678 4.64522 5.6875 5.6 5.6875H15.2648H15.2636ZM15.2636 7.4875H5.6012C5.12381 7.4875 4.66597 7.67714 4.32841 8.01471C3.99084 8.35227 3.8012 8.81011 3.8012 9.2875V16.2115C3.8012 16.6889 3.99084 17.1467 4.32841 17.4843C4.66597 17.8219 5.12381 18.0115 5.6012 18.0115H6.7928C7.21091 18.0114 7.61601 18.1569 7.93855 18.4229C8.26109 18.689 8.48096 19.059 8.5604 19.4695L8.5724 19.5499L11.1776 18.2107C11.3811 18.1062 11.6027 18.0414 11.8304 18.0199L11.9996 18.0115H15.2636C15.741 18.0115 16.1988 17.8219 16.5364 17.4843C16.874 17.1467 17.0636 16.6889 17.0636 16.2115V9.2875C17.0636 8.81011 16.874 8.35227 16.5364 8.01471C16.1988 7.67714 15.741 7.4875 15.2636 7.4875Z" />
      <path d="M10.4332 9.56836C10.6719 9.56836 10.9008 9.66318 11.0696 9.83196C11.2384 10.0007 11.3332 10.2297 11.3332 10.4684V15.8084C11.3332 16.0471 11.2384 16.276 11.0696 16.4448C10.9008 16.6135 10.6719 16.7084 10.4332 16.7084C10.1945 16.7084 9.96559 16.6135 9.79681 16.4448C9.62802 16.276 9.5332 16.0471 9.5332 15.8084V10.4684C9.5332 10.2297 9.62802 10.0007 9.79681 9.83196C9.96559 9.66318 10.1945 9.56836 10.4332 9.56836Z" />
      <path d="M13.104 12.2402C13.2221 12.2402 13.3392 12.2635 13.4484 12.3087C13.5576 12.354 13.6568 12.4203 13.7403 12.5038C13.8239 12.5874 13.8902 12.6866 13.9354 12.7958C13.9807 12.905 14.004 13.022 14.004 13.1402C14.004 13.2584 13.9807 13.3755 13.9354 13.4846C13.8902 13.5938 13.8239 13.6931 13.7403 13.7766C13.6568 13.8602 13.5576 13.9265 13.4484 13.9717C13.3392 14.017 13.2221 14.0402 13.104 14.0402H7.76035C7.52166 14.0402 7.29274 13.9454 7.12396 13.7766C6.95517 13.6078 6.86035 13.3789 6.86035 13.1402C6.86035 12.9015 6.95517 12.6726 7.12396 12.5038C7.29274 12.3351 7.52166 12.2402 7.76035 12.2402H13.1016H13.104Z" />
    </svg>
  );
};

interface ToolBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: () => void;
  onCreatAgent?: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ onSearch, onCreatAgent, ...divProps }) => {
  return (
    <div className="flex items-center px-8 py-3" {...divProps}>
      <motion.div
        key="searchIcon"
        className="flex h-[38px] w-[48px] cursor-pointer items-center justify-center"
        onClick={onSearch}
      >
        <img width={20} src={SearchIcon} alt="" />
      </motion.div>
      <motion.button
        key="createAgent"
        whileHover={{ scale: 1.1 }}
        className="ml-3 inline-flex items-center rounded-[62px] bg-[#DCFFF4] px-[13px] py-[7px] text-[#17B09E]"
        onClick={onCreatAgent}
      >
        <Chat className="mr-[14px]" /> Create Agent Group
      </motion.button>
    </div>
  );
};

const ConversationSider = () => {
  const { conversationID } = useParams();
  const conversationList = useConversationStore((state) => state.conversationList);
  const getConversationListByReq = useConversationStore(
    (state) => state.getConversationListByReq,
  );
  const virtuoso = useRef<VirtuosoHandle>(null);
  const hasmore = useRef(true);
  const loading = useRef(false);

  const endReached = async () => {
    if (!hasmore.current || loading.current) return;
    loading.current = true;
    hasmore.current = await getConversationListByReq(true);
    loading.current = false;
  };

  return (
    <div>
      <ConnectBar />
      <FlexibleSider
        needHidden={Boolean(conversationID)}
        wrapClassName="right-[1px] flex flex-col"
      >
        <ToolBar />
        <Virtuoso
          className="flex-1 border-t-[1px] border-[#e6e6e663]"
          data={conversationList}
          ref={virtuoso}
          endReached={endReached}
          computeItemKey={(_, item) => item.conversationID}
          itemContent={(_, conversation) => (
            <ConversationItemComp
              isActive={conversationID === conversation.conversationID}
              conversation={conversation}
            />
          )}
        />
      </FlexibleSider>
    </div>
  );
};

export default ConversationSider;

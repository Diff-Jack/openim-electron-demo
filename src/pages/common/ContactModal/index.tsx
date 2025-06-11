import type { TabsProps } from "antd";
import { Flex, Modal, Tabs } from "antd";
import { forwardRef, ForwardRefRenderFunction, memo } from "react";
import { useTranslation } from "react-i18next";

import AddIcon from "@/assets/images/contactModal/add.png";
import CloseIcon from "@/assets/images/contactModal/close.png";
import Searchbar from "@/components/SearchBar";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";

import { MyFriends } from "./myFriends";

const ContactModal: ForwardRefRenderFunction<OverlayVisibleHandle> = (props, ref) => {
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  return (
    <Modal
      title={null}
      footer={null}
      centered
      open={isOverlayOpen}
      closable={false}
      width={531}
      onCancel={closeOverlay}
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      className="contact-modal"
      maskTransitionName=""
    >
      <Contact onClose={closeOverlay} />
    </Modal>
  );
};

export default memo(forwardRef(ContactModal));

interface ContactProps {
  onClose?: () => void;
}

const Contact = ({ onClose }: ContactProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      vertical
      className="relative box-border h-[746px] w-[531px] px-[62px] py-[32px]"
    >
      <div
        className="absolute right-[26px] top-[22px] cursor-pointer"
        onClick={onClose}
      >
        <img width={24} src={CloseIcon} alt="" />
      </div>
      <div className="mb-[26px] text-center text-base font-medium">
        {t("placeholder.myFriend")}
      </div>
      <Flex gap={20} className="mb-[18px] flex items-center">
        <Searchbar placeholder={t("placeholder.searchFriends")} />
        <div className="flex-shrink-0 cursor-pointer">
          <img width="44" src={AddIcon} alt="" />
        </div>
      </Flex>
      <Tabbar />
    </Flex>
  );
};

const Tabbar = () => {
  const { t } = useTranslation();

  const tabs: TabsProps["items"] = [
    {
      key: "friends",
      label: t("placeholder.myFriend"),
      children: <MyFriends />,
    },
    {
      key: "requests",
      label: t("placeholder.requests"),
      children: <div>Content of Tab Pane 1</div>,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="friends"
      tabBarGutter={0}
      centered
      items={tabs}
      className="contact-modal-tabs"
    />
  );
};

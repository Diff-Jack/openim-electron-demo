import { Button, Flex, message, Modal } from "antd";
import { t } from "i18next";
import React, { forwardRef, ForwardRefRenderFunction, memo } from "react";
import { useCopyToClipboard } from "react-use";

import CloseIcon from "@/assets/images/common/close.png";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { useUserStore } from "@/store";

const CopyIdModal: ForwardRefRenderFunction<OverlayVisibleHandle> = (props, ref) => {
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  const selfInfo = useUserStore((state) => state.selfInfo);

  const [_, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(selfInfo.userID);
    message.success(t("copy.success"));
    setTimeout(() => {
      closeOverlay();
    }, 300);
  };

  return (
    <Modal
      title={null}
      footer={null}
      centered
      open={isOverlayOpen}
      closable={false}
      width={393}
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
      <div className="relative box-border px-[24px] pb-[40px] pt-[52px]">
        <div
          className="absolute right-[22px] top-[22px] cursor-pointer"
          onClick={closeOverlay}
        >
          <img width={24} src={CloseIcon} alt="" />
        </div>
        <div className="mb-6 text-center text-xl font-medium">
          {t("placeholder.yourId")}
        </div>
        <div className="mb-6 text-center text-sm leading-[16px] text-[rgba(0,0,0,0.54)]">
          {selfInfo.userID}
        </div>
        <Button
          className="px-6"
          type="primary"
          block
          disabled={!selfInfo.userID}
          size="large"
          onClick={handleCopy}
        >
          <Flex align="center" justify="center">
            <CopyIcon />
            <span className="ml-1">{t("copy.label")}</span>
          </Flex>
        </Button>
      </div>
    </Modal>
  );
};

export default memo(forwardRef(CopyIdModal));

const CopyIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M2.58125 9.14375H2.0125C1.71082 9.14375 1.42149 9.02391 1.20817 8.81058C0.994843 8.59726 0.875 8.30793 0.875 8.00625V2.8875C0.875 2.58582 0.994843 2.29649 1.20817 2.08317C1.42149 1.86984 1.71082 1.75 2.0125 1.75H7.13125C7.43293 1.75 7.72226 1.86984 7.93558 2.08317C8.14891 2.29649 8.26875 2.58582 8.26875 2.8875V3.45625M5.99375 5.73125H11.1125C11.7407 5.73125 12.25 6.24053 12.25 6.86875V11.9875C12.25 12.6157 11.7407 13.125 11.1125 13.125H5.99375C5.36553 13.125 4.85625 12.6157 4.85625 11.9875V6.86875C4.85625 6.24053 5.36553 5.73125 5.99375 5.73125Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

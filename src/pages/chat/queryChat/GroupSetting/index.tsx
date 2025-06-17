import { Drawer } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useRef, useState } from "react";

import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import GroupInfo from "@/pages/chat/queryChat/GroupSetting/GroupInfo";

import GroupMemberList from "./GroupMemberList";

const GroupSetting: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const [isPreviewMembers, setIsPreviewMembers] = useState(false);

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const closePreviewMembers = () => {
    setIsPreviewMembers(false);
  };

  return (
    <Drawer
      // title={
      //   !isPreviewMembers ? (
      //     t("placeholder.setting")
      //   ) : (
      //     <GroupMemberListHeader back2Settings={closePreviewMembers} />
      //   )
      // }
      destroyOnClose
      placement="right"
      rootClassName="chat-drawer"
      onClose={closeOverlay}
      afterOpenChange={(visible) => {
        if (!visible) {
          closePreviewMembers();
        }
      }}
      open={isOverlayOpen}
      maskClassName="opacity-0"
      maskMotion={{
        visible: false,
      }}
      width={393}
      getContainer={"#chat-container"}
    >
      {!isPreviewMembers ? (
        <GroupInfo
          closeOverlay={closeOverlay}
          updateTravel={() => setIsPreviewMembers(true)}
        />
      ) : (
        <GroupMemberList />
      )}
    </Drawer>
  );
};

export default memo(forwardRef(GroupSetting));

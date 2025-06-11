import { GroupItem, WSEvent } from "@openim/wasm-client-sdk/lib/types/entity";
import { Button, InputRef } from "antd";
import { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";

import { message } from "@/AntdGlobalComp";
import { searchBusinessUserInfo } from "@/api/login";
import CloseIcon from "@/assets/images/common/close.png";
import DraggableModalWrap from "@/components/DraggableModalWrap";
import Searchbar from "@/components/SearchBar";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { CardInfo } from "@/pages/common/UserCardModal";
import { useContactStore } from "@/store";
import { feedbackToast } from "@/utils/common";

import { IMSDK } from "../MainContentWrap";

interface ISearchUserOrGroupProps {
  isSearchGroup: boolean;
  openUserCardWithData: (data: CardInfo) => void;
  openGroupCardWithData: (data: GroupItem) => void;
}

const SearchUserOrGroup: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  ISearchUserOrGroupProps
> = ({ isSearchGroup, openUserCardWithData, openGroupCardWithData }, ref) => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<InputRef>(null);
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  useEffect(() => {
    if (isOverlayOpen) {
      setTimeout(() => inputRef.current?.focus());
    }
  }, [isOverlayOpen]);

  const searchData = async () => {
    if (!keyword) return;
    setLoading(true);
    if (isSearchGroup) {
      try {
        const { data } = await IMSDK.getSpecifiedGroupsInfo([keyword]);
        const groupInfo = data[0];
        setLoading(false);
        if (!groupInfo) {
          message.warning(t("empty.noSearchResults"));
          return;
        }
        openGroupCardWithData(groupInfo);
      } catch (error) {
        setLoading(false);
        if ((error as WSEvent).errCode === 1004) {
          message.warning(t("empty.noSearchResults"));
          return;
        }
        feedbackToast({ error });
      }
    } else {
      try {
        const {
          data: { total, users },
        } = await searchBusinessUserInfo(keyword);
        setLoading(false);
        if (
          !total ||
          (users[0].userID !== keyword && users[0].phoneNumber !== keyword)
        ) {
          message.warning(t("empty.noSearchResults"));
          return;
        }
        const friendInfo = useContactStore
          .getState()
          .friendList.find((friend) => friend.userID === users[0].userID);

        openUserCardWithData({
          ...(friendInfo ?? {}),
          ...users[0],
        });
      } catch (error) {
        setLoading(false);
        if ((error as WSEvent).errCode === 1004) {
          message.warning(t("empty.noSearchResults"));
          return;
        }
        feedbackToast({ error });
      }
    }
  };

  return (
    <DraggableModalWrap
      title={null}
      footer={null}
      open={isOverlayOpen}
      closable={false}
      width={393}
      onCancel={closeOverlay}
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      zIndex={1001}
      afterClose={() => {
        setKeyword("");
      }}
      centered
      ignoreClasses=".ignore-drag, .cursor-pointer"
      className="add-model"
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
          {isSearchGroup ? t("placeholder.addGroup") : t("placeholder.addFriends")}
        </div>
        <Searchbar
          className="mb-6"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <Button
          loading={loading}
          className="px-6"
          type="primary"
          block
          disabled={!keyword}
          size="large"
          onClick={searchData}
        >
          {t("confirm")}
        </Button>
      </div>
    </DraggableModalWrap>
  );
};

export default memo(forwardRef(SearchUserOrGroup));

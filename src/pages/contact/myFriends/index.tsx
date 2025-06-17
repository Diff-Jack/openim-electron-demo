import { useRequest } from "ahooks";
import { Empty, Spin } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useContactStore } from "@/store";
import { formatContactsByWorker } from "@/utils/contactsFormat";
import { emit } from "@/utils/events";

import AlphabetIndex from "./AlphabetIndex";
import FriendListItem from "./FriendListItem";

export const MyFriends = () => {
  const { t } = useTranslation();
  const friendList = useContactStore((state) => state.friendList);
  const virtuoso = useRef<GroupedVirtuosoHandle>(null);
  const alphabetRef = useRef<{ updateCurrentLetter: (letter: string) => void }>(null);
  const [selectedId, setSelectedId] = useState<string>();

  const { data: sectionData, cancel } = useRequest(
    () => formatContactsByWorker(friendList),
    {
      refreshDeps: [friendList],
    },
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  const scrollToLetter = useCallback(
    (idx: number) => {
      const prevNum = sectionData?.groupCounts.slice(0, idx).reduce((a, b) => a + b, 0);
      console.log(prevNum);

      virtuoso.current?.scrollToIndex({
        index: prevNum ?? 0,
        // behavior: "smooth",
      });
    },
    [sectionData?.groupCounts],
  );

  const showUserCard = useCallback((userID: string) => {
    setSelectedId(userID);
    emit("OPEN_USER_CARD", {
      userID,
    });
  }, []);

  const determineCurrentGroup = (startIndex: number) => {
    if (!sectionData) return;

    let currentItemIndex = 0;

    for (
      let groupIndex = 0;
      groupIndex < sectionData.groupCounts.length;
      groupIndex++
    ) {
      const groupItemCount = sectionData.groupCounts[groupIndex];

      if (startIndex < currentItemIndex + groupItemCount) {
        alphabetRef.current?.updateCurrentLetter(sectionData.indexList[groupIndex]);
        break;
      }

      currentItemIndex += groupItemCount;
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="mb-5 mt-6 text-center text-base font-extrabold">
        {t("placeholder.myFriend")}
      </div>
      <div className="fixed bottom-0 h-[35vh] w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,1),rgba(235,255,250,1))] bg-cover" />
      {!sectionData ? (
        <Spin />
      ) : !sectionData.groupCounts.length ? (
        <Empty className="mt-[30%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="relative mt-4 flex-1 overflow-auto pl-10 pr-4">
          <AlphabetIndex
            ref={alphabetRef}
            indexList={sectionData.indexList}
            scrollToLetter={scrollToLetter}
          />

          <GroupedVirtuoso
            ref={virtuoso}
            groupCounts={sectionData.groupCounts}
            groupContent={(index) => (
              <div className="bg-white pb-4 text-[15px] leading-[16px] text-[#B0B0B0]">
                {sectionData.indexList[index]}
              </div>
            )}
            itemContent={(index) => {
              const item = sectionData.totalList[index];
              const id = item.userID;
              return (
                <FriendListItem
                  key={id}
                  friend={item}
                  showUserCard={showUserCard}
                  isActive={selectedId === id}
                />
              );
            }}
            rangeChanged={({ startIndex }) => determineCurrentGroup(startIndex)}
            className="no-scrollbar h-full overflow-x-hidden"
          />
        </div>
      )}
    </div>
  );
};

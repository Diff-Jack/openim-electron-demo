import { FriendUserItem } from "@openim/wasm-client-sdk/lib/types/entity";
import clsx from "clsx";

import OIMAvatar from "@/components/OIMAvatar";

const FriendListItem = ({
  friend,
  showUserCard,
  isActive,
}: {
  friend: FriendUserItem;
  showUserCard: (userID: string) => void;
  isActive?: boolean;
}) => {
  return (
    <div
      className={clsx([
        "mb-2 flex cursor-pointer items-center rounded-md pb-2 pl-2 pt-2 transition-colors hover:bg-gradient-to-r hover:from-[#ECFFF9] hover:to-[#F7FFFC]",
        { "bg-gradient-to-r from-[#ECFFF9] to-[#F7FFFC]": isActive },
      ])}
      onClick={() => showUserCard(friend.userID)}
    >
      <OIMAvatar
        size={48}
        src={friend.faceURL}
        text={friend.remark || friend.nickname}
      />
      <div className="ml-6">
        <div className="mb-[6px] truncate text-sm text-[#000000]">
          {friend.nickname}
        </div>
        <div className="text-xs text-[#B0B0B0]">{friend.remark}</div>
      </div>
    </div>
  );
};

export default FriendListItem;

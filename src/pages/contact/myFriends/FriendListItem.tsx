import { FriendUserItem } from "@openim/wasm-client-sdk/lib/types/entity";

import OIMAvatar from "@/components/OIMAvatar";

const FriendListItem = ({
  friend,
  showUserCard,
}: {
  friend: FriendUserItem;
  showUserCard: (userID: string) => void;
}) => {
  return (
    <div
      className="mb-2 flex items-center rounded-md pb-2 pl-2 pt-2 transition-colors hover:bg-[#F3F3F3]"
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

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
      className="flex items-center rounded-md py-4 transition-colors hover:bg-[var(--primary-active)]"
      onClick={() => showUserCard(friend.userID)}
    >
      <OIMAvatar
        size={48}
        src={friend.faceURL}
        text={friend.remark || friend.nickname}
      />
      <div className="ml-3">
        <div className="truncate text-sm text-[#000000]">{friend.nickname}</div>
        <div className="text-xs text-[#B0B0B0]">{friend.remark}</div>
      </div>
    </div>
  );
};

export default FriendListItem;

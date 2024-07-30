"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formateNumber } from "@/lib/utils";

interface Props {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ initialState, userId }: Props) => {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formateNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;

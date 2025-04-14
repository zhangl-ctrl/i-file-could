import { Flex } from "antd";
import BucketItem from "./BucketItem";
import React, { Fragment } from "react";
import noBucketImg from "@/assets/images/空空如也.svg";

const BucketList: React.FC<{
  buckets: any;
  searchKey: string;
  onDelete: (status: boolean) => void;
}> = ({ buckets, onDelete }) => {
  const handleDelateBucket = (status: boolean) => {
    onDelete(status);
  };

  return (
    <Flex wrap gap="large">
      {buckets && buckets.length > 0 ? (
        buckets.map((bucket: any, index: number) => {
          return (
            <Fragment key={index}>
              <BucketItem
                bucket={bucket}
                onDetele={handleDelateBucket}
                key={index}
              />
            </Fragment>
          );
        })
      ) : (
        <div className="flex flex-col justify-center items-center w-[100%]">
          <img src={noBucketImg} className="w-[500px]" alt="空空如也" />
          <div className="text-[18px] text-[#aaa]">暂无存储桶</div>
        </div>
      )}
    </Flex>
  );
};

export default BucketList;

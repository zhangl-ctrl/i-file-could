import { Flex } from "antd";
import BucketItem from "./BucketItem";
import React, { Fragment } from "react";

const BucketList: React.FC<{ buckets: any }> = ({ buckets }) => {
  return (
    <>
      <Flex wrap gap="large">
        {buckets.map((bucket: any, index: number) => {
          return (
            <Fragment key={index}>
              <BucketItem bucket={bucket} />
            </Fragment>
          );
        })}
      </Flex>
    </>
  );
};

export default BucketList;

import { Flex } from "antd";
import BucketItem from "./BucketItem";
import React, { Fragment, useState, useEffect } from "react";

const BucketList: React.FC<{ buckets: any; searchKey: string }> = ({
  buckets,
  searchKey,
}) => {
  const [filterBuckets, setFilterBuckets] = useState(buckets);
  // console.log("searchKey", searchKey);

  // useEffect(() => {
  //   if (searchKey !== "") {
  //     setFilterBuckets((filterBuckets: any) => {
  //       return filterBuckets.filter((bucket: any) => {
  //         return bucket.bucketName === searchKey;
  //       });
  //     });
  //   }
  // }, [searchKey]);

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

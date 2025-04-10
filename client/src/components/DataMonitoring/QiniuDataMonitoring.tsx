import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Segmented, Spin, Divider } from "antd";
import VChart from "@visactor/vchart";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { QINIU_REGION } from "@/common/cloudService";
import formatFileSize from "@/utils/formatFileSize";
import formatDate from "@/utils/formatDate";
import {
  getQiniuBuckets,
  getSpaceOverview,
  getSpaceTendency,
  getTodaySpaceOverView,
} from "@/api/qiniuService";
import dayjs from "dayjs";

const QiniuDataMonitoring: React.FC = () => {
  const [loadding1, setLoadding1] = useState(false);
  const [loadding2, setLoadding2] = useState(false);
  const [loadding3, setLoadding3] = useState(false);
  const [loadding4, setLoadding4] = useState(false);
  const [spaceOverview, setSpaceOverview] = useState<Record<string, number>>();
  const [daysRange, setDaysRange] = useState<number>(7);
  const spaceDistributionCartRef = useRef(null);
  const spaceAmountRef = useRef(null);
  const tendencyRef = useRef(null);
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );

  // 七牛云存储空间分布-----------------------------------------------------------------
  function getSpaceDistributionData(data: any) {
    return {
      type: "pie",
      data: [
        {
          id: nanoid(),
          values: data,
        },
      ],
      outerRadius: 0.8,
      innerRadius: 0.5,
      valueField: "value",
      categoryField: "type",
      title: {
        visible: true,
        text: "七牛云存储空间分布",
      },
      legends: {
        visible: true,
        orient: "right",
      },
      pie: {
        style: {
          cornerRadius: 3,
        },
        state: {
          hover: {
            outerRadius: 0.85,
            lineWidth: 1,
          },
          selected: {
            outerRadius: 0.85,
            lineWidth: 1,
          },
        },
      },
    };
  }
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoadding1(true);
        const res = await getQiniuBuckets(accessKey, secretKey);
        const dataMap = new Map();
        res.data.forEach((item: any) => {
          if (!dataMap.has(item.region)) {
            const spaceInfo = {
              value: 1,
              type: QINIU_REGION[item.region],
            };
            dataMap.set(item.region, spaceInfo);
          } else {
            const spaceInfo = dataMap.get(item.region);
            dataMap.set(item.region, {
              ...spaceInfo,
              value: spaceInfo.value + 1,
            });
          }
        });
        const formatDataArr = [];
        for (const value of dataMap.values()) {
          formatDataArr.push(value);
        }
        const spec = getSpaceDistributionData(formatDataArr);
        if (isMounted) {
          const vchart: VChart | null = new VChart(spec, {
            dom: spaceDistributionCartRef.current,
          });
          vchart.renderSync();
        }
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoadding1(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  // ----------------------------------------------------------------------------------

  // 空间使用量-------------------------------------------------------------------------
  function getSpaceAmountData(data: any) {
    return {
      type: "bar",
      title: {
        visible: true,
        text: "空间用量 TOP5",
      },
      data: [
        {
          id: "barData",
          values: data,
        },
      ],
      xField: "bucket",
      yField: "amount",
      axes: [
        {
          orient: "left",
          label: {
            formatMethod: (val: any) => {
              return val / 1000000 + " MB";
            },
          },
        },
      ],
      tooltip: {
        // 配置 mark 图元的内容
        mark: {
          content: {
            key: "存储量",
            value: (datum: any) => {
              return formatFileSize(datum.amount);
            },
          },
        },
        // 配置 dimension 维度项的内容
        dimension: {
          content: {
            key: () => "存储量",
            value: (datum: any) => formatFileSize(datum.amount),
          },
        },
      },
    };
  }
  useEffect(() => {
    let vchart: VChart | null = null;
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoadding2(true);
        const res = await getSpaceOverview(accessKey, secretKey);
        const data = res.data
          .sort((a: any, b: any) => {
            if (a.storage_size - b.storage_size > 0) {
              return -1;
            } else if (a.storage_size - b.storage_size < 0) {
              return 1;
            } else {
              return 0;
            }
          })
          .slice(0, 5);
        const formatData = data.map((item: any) => {
          return {
            bucket: item.tbl,
            amount: item.storage_size,
          };
        });
        const spec = getSpaceAmountData(formatData);
        if (isMounted) {
          vchart = new VChart(spec, {
            dom: spaceAmountRef.current!,
          });
          vchart.renderSync();
        }
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoadding2(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  // ----------------------------------------------------------------------------------

  // 使用趋势---------------------------------------------------------------------------
  function getSpaceTendencyData(data: any) {
    return {
      type: "area",
      data: {
        values: data,
      },
      xField: "time",
      yField: "data",
    };
  }
  useEffect(() => {
    let vchart: VChart | null = null;
    let isMounted = true;
    const fetchData = async () => {
      const end = dayjs().format("YYYYMMDD") + "235959";
      const begin =
        dayjs()
          .subtract(daysRange - 1, "day")
          .format("YYYYMMDD") + "000000";
      try {
        setLoadding3(true);
        const res = await getSpaceTendency(accessKey, secretKey, begin, end);
        const datas = res.data.datas;
        const times = res.data.times;
        const data = times.map((time: number, index: number) => {
          const formatTime = formatDate(time * 1000, {
            timestamp: false,
            format: "YYYY-MM-DD",
          });
          return {
            time: formatTime,
            data: datas[index],
          };
        });
        const spec = getSpaceTendencyData(data);
        if (isMounted) {
          vchart = new VChart(spec, {
            dom: tendencyRef.current!,
          });
          vchart.renderSync();
        }
      } catch (err: any) {
        console.error("Effor", err.message);
      } finally {
        setLoadding3(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
      if (vchart) {
        vchart.release();
      }
    };
  }, [daysRange]);
  // ----------------------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadding4(true);
        const res = await getTodaySpaceOverView(accessKey, secretKey);
        console.log("res", res);
        if (res.success) {
          setSpaceOverview(res.data);
        }
      } catch (err: any) {
        console.error("Error: ", err.message);
      } finally {
        setLoadding4(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Card className="400px">
        <Row>
          <Col span={11}>
            <Spin spinning={loadding1}>
              <div
                className="w-[100%] h-[300px] box-border"
                ref={spaceDistributionCartRef}
              ></div>
            </Spin>
          </Col>
          <Col span={1}>
            <Divider type="vertical" style={{ height: "300px" }} />
          </Col>
          <Col span={12}>
            <Spin spinning={loadding2}>
              <div
                className="w-[100%] h-[300px] box-border"
                ref={spaceAmountRef}
              ></div>
            </Spin>
          </Col>
        </Row>
        <Row>
          <Col>
            <Segmented<string>
              options={[
                "标准存储",
                "低频存储",
                "智能分层存储",
                "归档直读存储",
                "归档存储",
                "深度归档存储",
              ]}
              onChange={(value) => {
                console.log(value);
              }}
            />
          </Col>
        </Row>
        <Spin spinning={loadding4}>
          {spaceOverview && (
            <Row className="mt-[20px]" gutter={[16, 24]}>
              <Col span={8}>
                <div className="text-[24px]">
                  {formatFileSize(spaceOverview.todaySpaceAmount)}
                </div>
                <div className="text-[14px] mt-[6px] text-[#262626]">
                  今日空间存储量
                </div>
              </Col>
              <Col span={8}>
                <div className="text-[24px]">
                  {spaceOverview.spaceFileAmount}
                </div>
                <div className="text-[14px] mt-[6px]">今日文件数</div>
              </Col>
              <Col span={8}>
                <div className="text-[24px]">
                  {spaceOverview.getRequestAmount +
                    "/" +
                    spaceOverview.putRequestAmount}
                </div>
                <div className="text-[14px] mt-[6px]">
                  本月 API 请求次数 (GET/PUT)
                </div>
              </Col>
              <Col span={8}>
                <div className="text-[24px]">
                  {formatFileSize(spaceOverview.spaceOutFlow)}
                </div>
                <div className="text-[14px] mt-[6px]">本月空间流出流量</div>
              </Col>
              <Col span={8}>
                <div className="text-[24px]">
                  {formatFileSize(spaceOverview.cdnFlow)}
                </div>
                <div className="text-[14px] mt-[6px]">
                  本月空间 CDN 回源流量
                </div>
              </Col>
            </Row>
          )}
        </Spin>
        <Row className="mt-[40px]" justify="space-between">
          <Col>
            <span className="text-[16px]">近 {daysRange} 天存储趋势</span>
          </Col>
          <Col>
            <Segmented<string>
              options={[
                { label: "7 天", value: "7" },
                {
                  label: "15 天",
                  value: "15",
                },
              ]}
              onChange={(value) => {
                setDaysRange(Number(value));
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Spin spinning={loadding3}>
              <div className="w-[100%] h-[450px]" ref={tendencyRef}></div>
            </Spin>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default QiniuDataMonitoring;

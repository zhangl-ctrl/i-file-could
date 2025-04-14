import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Segmented, Spin, Divider } from "antd";
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
import * as echarts from "echarts";

type EChartsOption = echarts.EChartsOption;

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
  function getSpaceDistributionData(data: any): EChartsOption {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "50%",
        left: "left",
        orient: "vertical",
      },
      title: {
        text: "七牛云存储空间分布",
        left: "left",
      },
      series: [
        {
          name: "存储区域",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "1rem",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data,
        },
      ],
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
              name: QINIU_REGION[item.region],
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
        if (isMounted) {
          let option: EChartsOption = getSpaceDistributionData(formatDataArr);
          const chartDom = spaceDistributionCartRef.current!;
          const myChart = echarts.init(chartDom);
          option && myChart.setOption(option);
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
  function getSpaceAmountData(data: Record<string, any>[]): EChartsOption {
    const x: string[] = [];
    const y: number[] = [];
    data.forEach((item: any) => {
      x.push(item.bucket);
      y.push(item.amount);
    });
    return {
      title: {
        text: "空间使用量 TOP5",
        left: "left",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: x,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          position: "left",
          axisLabel: {
            formatter: (value) => {
              return formatFileSize(value);
            },
          },
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: y,
        },
      ],
    };
  }
  useEffect(() => {
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
        if (isMounted) {
          var chartDom = spaceAmountRef.current!;
          var myChart = echarts.init(chartDom);
          var option: EChartsOption = getSpaceAmountData(formatData);
          option && myChart.setOption(option);
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
  function getSpaceTendencyData(
    data: { time: string; data: number }[]
  ): EChartsOption {
    const x: string[] = [];
    const y: number[] = [];
    data.forEach((item: { time: string; data: number }) => {
      x.push(item.time);
      y.push(item.data);
    });

    return {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: x,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value) => {
            const size = formatFileSize(value);
            if (parseInt(size) === 0) {
              return "";
            } else {
              return size;
            }
          },
        },
      },
      series: [
        {
          data: y,
          type: "line",
          areaStyle: {},
        },
      ],
    };
  }
  useEffect(() => {
    let isMounted = true;
    let chartDom = null;
    let myChart: echarts.ECharts | null = null;
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
        if (isMounted) {
          chartDom = tendencyRef.current!;
          myChart = echarts.init(chartDom);
          const option: EChartsOption = getSpaceTendencyData(data);
          option && myChart.setOption(option);
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
      if (myChart) {
        myChart.dispose();
        myChart = null;
      }
    };
  }, [daysRange]);
  // ----------------------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadding4(true);
        const res = await getTodaySpaceOverView(accessKey, secretKey);
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

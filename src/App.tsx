import { useQuery } from "react-query";
import indexerApi from "./services/indexerApi";
import styled from "styled-components";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Table,
  notification,
} from "antd";
const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  margin: 2rem 0;
`;
const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  margin: 2rem 0;
`;

const CenterItemFlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const counterTableColumns = [
  {
    title: "Name",
    dataIndex: "relation_name",
    key: "name",
  },
  {
    title: "Count",
    dataIndex: "counter",
    key: "count",
    render: (text: string) => <span>{Number(text).toLocaleString()}</span>,
  },
];

const rabbitMQTableColumns = [
  {
    title: "Queue Name",
    dataIndex: "queue",
    key: "queue",
  },
  {
    title: "message in queue",
    dataIndex: "messageCount",
    key: "messageCount",
    render: (text: string) => <span>{Number(text).toLocaleString()}</span>,
  },
  {
    title: "consumer count",
    dataIndex: "consumerCount",
    key: "consumerCount",
  },
];

const configTableColumns = [
  {
    title: "Key",
    dataIndex: "key",
    key: "name",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];
function App() {
  const {
    data: counters = [],
    isLoading: isLoadingCounters,
    isError: isErrorCounters,
    refetch: refetchCounters,
  } = useQuery("indexerApi.getCounters", () => indexerApi.getCounters());
  const countersTableData = counters.map((counter: any) => ({
    ...counter,
    key: counter.relation_name,
  }));

  const {
    data: rabbitMQ = [],
    isLoading: isLoadingRabbitMQ,
    isError: isErrorRabbitMQ,
    refetch: refetchRabbitMQ,
  } = useQuery("indexerApi.getRabbitMQ", () => indexerApi.getRabbitMQ());

  const rabbitMQTableData = rabbitMQ.map((queue: any) => ({
    ...queue,
    key: queue.queue,
  }));

  const {
    data: configs = [],
    isLoading: isLoadingConfigs,
    isError: isErrorConfigs,
    refetch: refetchConfigs,
  } = useQuery("indexerApi.getCongfigs", () => indexerApi.getCongfigs());

  const handleUpdateConfig = async (values: any) => {
    try {
      const { blockRange } = values;

      await indexerApi.setConfigs({
        key: import.meta.env.VITE_BLOCK_RANGE_CONFIG || "dev_blocks_range",
        value: blockRange,
      });
      await refetchConfigs();
      notification.success({
        message: "Update config successfully",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Update config failed",
      });
    }
  };
  return (
    <Wrapper>
      <Title>EVM INDEXER MONITOR</Title>
      <SubTitle>PROD</SubTitle>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <SubTitle>Sync Status</SubTitle>
          <CenterItemFlexBox>
            <Button
              type="primary"
              onClick={async () => {
                await refetchCounters();
              }}
            >
              Reload
            </Button>
          </CenterItemFlexBox>
          {isErrorCounters ? (
            <div>error</div>
          ) : (
            <Table
              loading={isLoadingCounters}
              dataSource={countersTableData}
              columns={counterTableColumns}
              pagination={false}
              bordered
            />
          )}
        </Col>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <SubTitle>Worker Status</SubTitle>
          <CenterItemFlexBox>
            <Button
              type="primary"
              onClick={async () => {
                await refetchRabbitMQ();
              }}
            >
              Reload
            </Button>
          </CenterItemFlexBox>
          {isErrorRabbitMQ ? (
            <div>error</div>
          ) : (
            <Table
              loading={isLoadingRabbitMQ}
              dataSource={rabbitMQTableData}
              columns={rabbitMQTableColumns}
              pagination={false}
              bordered
            />
          )}
        </Col>
      </Row>
      <div style={{ margin: "20px 0" }}>
        <SubTitle>Worker Configs</SubTitle>
        {isErrorConfigs ? (
          <div>err</div>
        ) : (
          <Table
            loading={isLoadingConfigs}
            dataSource={configs}
            columns={configTableColumns}
            pagination={false}
            bordered
          />
        )}
      </div>
      <Form onFinish={handleUpdateConfig}>
        <Form.Item
          label="Block Range"
          help="The block range for push event worker if you set this value to 0, this worker will stop."
          name="blockRange"
        >
          <InputNumber
            min={0}
            placeholder="block range for push event worker"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </Wrapper>
  );
}

export default App;

import { useRef, useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Switch,
} from "antd";
import moment from "moment";
import { useRequest } from "ahooks";
import { get } from "lodash";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import MySelect from "components/MySelect";
import DrawerForm from "components/DrawerForm";
import OpenEle from "components/OpenEle";
import UserSelect from "../UserSelect";
import CustomerSelect from "../CustomerSelect";
import { GetConfigAllList } from "services/modules/commercialOpportunityConfiguration";
import { PRIORITY_OPTIONS } from "../../constants";
import styles from "./index.module.less";

const { Option } = Select;
export default (props) => {
  const {
    visible,
    defaultGroupId,
    groupList = [],
    data = {},
    onOk,
    isEdit,
    ...rest
  } = props;
  const formRef = useRef(null);
  const currentGroupIdRef = useRef("");
  const {
    data: stageList = [],
    loading: stageLoading,
    run: runGetStageList,
    params: stageParams = [],
    mutate: mutateStage,
  } = useRequest(GetConfigAllList, {
    manual: true,
    onSuccess: (res = []) => {
      mutateStage(res.sort((a, b) => a.isSystem - b.isSystem));
      if (res[0] && !formRef.current.getFieldValue("stageId")) {
        const firstStageId = res[0].id;
        setCurStageId(firstStageId);
        formRef.current.setFieldsValue({
          stageId: firstStageId,
        });
      }
    },
  });
  const { data: failReasonList = [] } = useRequest(GetConfigAllList, {
    defaultParams: [
      {
        typeCode: "OPPORTUNITY_FAIL_REASON",
      },
    ],
  });
  // 创建人
  const [creator, setCreator] = useState("");
  const [curStageId, setCurStageId] = useState("");
  // 协作人
  const [cooperator, setCooperator] = useState([]);
  const [{ groupId: stageGroupId } = {}] = stageParams;
  const defaultStageId = stageList.length ? stageList[0].id : undefined;

  const getStageListByGroupId = (groupId) => {
    runGetStageList({
      groupId,
      typeCode: "OPPORTUNITY_STAGE",
    });
  };
  useEffect(() => {
    if (visible && isEdit) {
      refillForm(data);
    }
    if (!visible) {
      setCooperator([]);
      setCreator("");
      setCurStageId(defaultStageId);
    }
    const [{ groupId } = {}] = stageParams;
    currentGroupIdRef.current = defaultGroupId;
    if (visible && groupId !== defaultGroupId) {
      getStageListByGroupId(defaultGroupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEdit]);

  const lossStageId = useMemo(() => {
    const item = stageList.find(
      (item) => item.isSystem && item.name === "输单"
    );
    return item ? item.id : "";
  }, [stageList]);

  const refillForm = async (detailData = {}) => {
    const { expectDealDate, cooperatorList = [] } = detailData;
    let cooperatorIds = [];
    const usersId = Array.isArray(cooperatorList)
      ? cooperatorList.map((ele) => {
          cooperatorIds = [
            ...cooperatorIds,
            {
              id: ele.id,
              extId: ele.cooperatorId,
            },
          ];
          return {
            id: ele.id,
            editabled: ele.canUpdate,
            isUser: true,
            isOld: true,
            extId: ele.cooperatorId,
            key: `user_${ele.cooperatorId}`,
            name: get(ele, "cooperatorStaff.name"),
          };
        })
      : [];
    setCurStageId(detailData.stageId);
    setCooperator(cooperatorIds);
    setCreator(detailData.owner);
    const initialValues = {
      expectDealTime: expectDealDate
        ? moment(expectDealDate, "YYYY-MM-DD HH:mm:dd")
        : null,
      expectMoney: detailData.expectMoney,
      stageId: detailData.stageId,
      groupId: detailData.groupId,
      desp: detailData.desp,
      priority: detailData.priority,
      customerInfo: detailData.customer ? [detailData.customer] : [],
      ownerInfo: detailData.ownerStaff
        ? [
            {
              isUser: true,
              key: `user_${detailData.ownerStaff.id}`,
              ...detailData.ownerStaff,
            },
          ]
        : [],
      cooperatorIds: usersId,
      name: detailData.name,
      dealChance: detailData.dealChance,
    };
    if (formRef.current) {
      formRef.current.setFieldsValue(initialValues);
    }
  };

  const onValuesChange = (vals) => {
    const [[key, val]] = Object.entries(vals);
    switch (key) {
      case "ownerInfo":
        setCreator(val.length ? val[0].extId : "");
        if (formRef.current && formRef.current.getFieldValue("customerInfo")) {
          formRef.current.setFieldsValue({
            customerInfo: [],
          });
        }
        break;
      case "cooperatorIds":
        setCooperator(vals.cooperatorIds);
        break;
      case "groupId":
        currentGroupIdRef.current = val;
        if (val) {
          getStageListByGroupId(val);
        }
        setCurStageId("");
        if (formRef.current) {
          formRef.current.setFieldsValue({
            stageId: undefined,
          });
        }
        break;
      case "stageId":
        setCurStageId(val);
        break;
      default:
        break;
    }
  };

  const handleOk = (vals) => {
    if (typeof onOk === "function") {
      onOk(vals);
    }
  };

  const initialValues = {
    expectMoney: "",
    expectDealTime: moment(),
    dealChance: 1,
    stageId: defaultStageId,
    groupId: defaultGroupId,
  };

  const disabledDate = (currentDate) => {
    return currentDate.isBefore(moment(), "days");
  };

  const disabledCooperatorIds = creator ? [`user_${creator}`] : [];
  const disabledCreator = cooperator.map((ele) => `user_${ele.extId}`);
  const currentStageList =
    currentGroupIdRef.current === stageGroupId ? stageList : [];
  const showFailReason = lossStageId && lossStageId === curStageId;
  return (
    <DrawerForm
      visible={visible}
      onOk={handleOk}
      {...rest}
      width={640}
      getForm={(r) => (formRef.current = r)}
      formProps={{
        initialValues,
        onValuesChange,
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 18,
        },
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label="商机名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入商机名称",
              },
            ]}
          >
            <Input
              maxLength={20}
              placeholder={`请输入不超过20个字符`}
              allowClear={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="所有者"
            name="ownerInfo"
            rules={[
              {
                required: true,
                message: "请选择所有者",
              },
            ]}
          >
            <UserSelect
              placeholder="请选择所有者"
              disabledValues={disabledCreator}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="客户"
            name="customerInfo"
            rules={[
              {
                required: true,
                type: "array",
                message: "请选择客户",
              },
            ]}
          >
            <CustomerSelect
              placeholder="请选择客户"
              staffId={creator}
              disabled={!creator}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="商机分组"
            name="groupId"
            rules={[
              {
                required: false,
                message: "请选择商机分组",
              },
            ]}
          >
            <Select
              allowClear={true}
              disabled={isEdit}
              optionFilterProp="label"
              placeholder="请选择"
            >
              {groupList.map((ele) => (
                <Option key={ele.id} value={ele.id}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="商机阶段" name="stageId">
            <Select
              allowClear={true}
              optionFilterProp="label"
              loading={stageLoading}
              placeholder="请选择"
            >
              {currentStageList.map((ele) => (
                <Option key={ele.id} value={ele.id}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {showFailReason ? (
        <Row>
          <Col span={24}>
            <Form.Item
              label="输单原因"
              name="failReasonId"
              rules={[
                {
                  required: true,
                  message: "请选择输单原因",
                },
              ]}
            >
              <Select
                allowClear={true}
                optionFilterProp="label"
                placeholder="请选择"
                loading={stageLoading}
              >
                {failReasonList.map((ele) => (
                  <Option key={ele.id} value={ele.id}>
                    {ele.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col span={24}>
          <Form.Item label="协作人" name="cooperatorIds">
            <MySelect
              type="user"
              title="添加协作人"
              fileldNames={{
                value: "extId",
              }}
              placeholder="请选择协作人"
              onlyChooseUser={true}
              disabledValues={disabledCooperatorIds}
              style={{ width: "100%" }}
            >
              {({ tags, onAddTags, onCloseTag, updateTags }) => {
                return (
                  <div className={styles["cooperator-select"]}>
                    {tags.length ? (
                      <ul className={styles["cooperator-ul"]}>
                        {tags.map((ele) => {
                          const onSwitchChange = (checked) => {
                            updateTags(
                              tags.map((item) => {
                                if (item.extId === ele.extId) {
                                  item.editabled = checked;
                                  return item;
                                } else {
                                  return item;
                                }
                              })
                            );
                          };
                          const onRemove = () => {
                            onCloseTag(ele);
                          };
                          return (
                            <li
                              key={ele.extId}
                              className={styles["cooperator-li"]}
                            >
                              <OpenEle type="userName" openid={ele.name} />
                              <div className={styles["cooperator-extra"]}>
                                <span className={styles["switch-item"]}>
                                  <Switch
                                    checked={ele.editabled}
                                    onChange={onSwitchChange}
                                    className={styles["switch-ele"]}
                                  />
                                  <span className={styles["switch-item-name"]}>
                                    是否可以编辑
                                  </span>
                                </span>
                                <MinusCircleOutlined
                                  onClick={onRemove}
                                  className={styles["cooperator-action"]}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    <Button icon={<PlusOutlined />} onClick={onAddTags}>
                      添加协作人
                    </Button>
                  </div>
                );
              }}
            </MySelect>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="预计金额" name="expectMoney">
            <InputNumber
              placeholder="请输入"
              style={{ width: "100%" }}
              max={Number.MAX_SAFE_INTEGER}
              min={0.01}
              precision={2}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="成单概率" name="dealChance">
            <InputNumber
              placeholder="请输入"
              max={100}
              min={1}
              style={{ width: "100%" }}
              precision={0}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="预计成交日期" name="expectDealTime">
            <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="优先级" name="priority">
            <Select
              allowClear={true}
              optionFilterProp="label"
              placeholder="请选择"
            >
              {PRIORITY_OPTIONS.map((ele) => (
                <Option key={ele.value} value={ele.value}>
                  {ele.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="描述" name="desp">
            <Input.TextArea
              maxLength={200}
              rows={6}
              placeholder="请输入不超过200个字符"
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  );
};

import { post, get } from "../request";
import { handleTimes } from "utils/times";
import { handlePageParams, handleTable } from "../utils";

// 获取客户离职列表
export const GetCustomerResignedInheritance = (pager, formVals = {}) => {
  const { dimissionTime, ...rest } = formVals;
  const [dimissionBeginTime, dimissionEndTime] = handleTimes(dimissionTime, {
    searchTime: true,
  });
  const params = {
    dimissionBeginTime,
    dimissionEndTime,
    ...rest,
    ...handlePageParams(pager),
  };
  return post(
    `/api/customerResignedInheritance/pageCustomerResignedInheritance`,
    params,
    {
      needJson: true,
    }
  ).then((res) => handleTable(res));
};
// 同步客户离职列表
export const AsyncCustomerResignedInheritance = () => {
  return get(`/api/customerResignedInheritance/syncCustomer`);
};
// 客户分配记录
export const GetCustomerTransferHistory = (pager) => {
  const params = {
    ...handlePageParams(pager),
  };
  return post(
    `/api/customerResignedInheritance/transferCustomerPageInfo`,
    params,
    { needJson: true }
  ).then((res) => handleTable(res));
};
// 查询待移交客户信息
export const GetWaitTransferCustomerPage = (pager, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  };
  return post(
    `/api/customerResignedInheritance/waitTransferCustomerPage`,
    params,
    { needJson: true }
  ).then((res) => handleTable(res));
};

// 分配客户
export const TransferCustomer = (params = {}) => {
  return post("/api/customerResignedInheritance/transferCustomer", params, {
    needJson: true,
  });
};

// 查询客户群离职列表
export const GetGroupChatResignedInheritance = (pager, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  };
  return post(`/api/groupChatResignedInheritance/pageList`, params, {
    needJson: true,
  }).then((res) => handleTable(res));;
};
// 同步客户群离职列表
export const AsyncGetGroupChatResignedInheritance = () => {
  return get("/api/groupChatResignedInheritance/sync");
};
// 查询群分配记录
export const GetGroupTransferHistory = (pager, formVals = {}) => {
  const { createTime, creatorIds = [], ...rest } = formVals;
  const [beginTime, endTime] = handleTimes(createTime, { searchTime: true });
  const params = {
    creatorIds,
    beginTime,
    endTime,
    ...rest,
    ...handlePageParams(pager),
  };
  return post(
    "/api/groupChatResignedInheritance/transferPageInfo",
    params,
    { needJson: true }
  ).then((res) => handleTable(res));
};
// 获取待移交群聊
export const GetWaitTransferGroup = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals,
  };
  return post(
    "/api/groupChatResignedInheritance/waitTransferPageList",
    params,
    { needJson: true }
  ).then((res) => handleTable(res));
};
// 分配客户群聊
export const TransferGroup = (params) => {
  return post("/api/groupChatResignedInheritance/transferGroupChat", params, {
    needJson: true,
  });
};

// 查询离职员工列表
export const GetDimmissionInherit = (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals;
  const [resignedBeginTime, resignedEndTime] = handleTimes(createTime, {
    searchTime: true,
  });
  const params = {
    resignedBeginTime,
    resignedEndTime,
    ...rest,
    ...handlePageParams(pager),
  };
  return post(
    "/api/staffResignedInheritance/transferStatisticsPageInfo",
    params,
    { needJson: true }
  ).then((res) => handleTable(res));
};

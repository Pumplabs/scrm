package com.scrm.common.constant;


import com.scrm.common.config.ScrmConfig;
import me.chanjar.weixin.cp.constant.WxCpConsts;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 通用常量信息
 *
 * @author xuxh
 */
public class Constants {

    /**
     * UTF-8 字符集
     */
    public static final String UTF8 = "UTF-8";

    /**
     * GBK 字符集
     */
    public static final String GBK = "GBK";

    /**
     * 系统角色权限字符串：企业管理员
     */
    public static final String SYS_ROLE_KEY_ENTERPRISE_ADMIN = "enterpriseAdmin";

    /**
     * 资源映射路径 前缀
     */
    public static final String RESOURCE_PREFIX = "/profile";

    /**
     * 上传文件的前缀
     */
    public static final String UPLOAD_PREFIX = "/upload/";

    /**
     * 系统corpId的参数名
     */
    public static final String CORP_PARAM_NAME = "extCorpId";

    /**
     * 渠道活码的state前缀
     */
    public static final String CONTACT_WAY_STATE_PRE = "contactWay:";

    /**
     * 企微应用宝的渠道活码的state前缀
     */
    public static final String FISSION_CONTACT_WAY_STATE_PRE = "fission:";

    /**
     * 企微应用宝的渠道活码的state前缀(客服)
     */
    public static final String FISSION_SERVICE_CONTACT_WAY_STATE_PRE = "f_service:";

    /**
     * 群活码的state
     */
    public static final String JOIN_WAY_STATE = "joinWay";

    /**
     * 临时文件类型是图片
     */
    public static final String TEMP_FILE_IMG = "image";

    /**
     * 临时文件类型是视频
     */
    public static final String TEMP_FILE_VIDEO = "video";

    /**
     * 临时文件类型是文件
     */
    public static final String TEMP_FILE_FILE = "file";

    /**
     * 临时文件类型是语音
     */
    public static final String TEMP_FILE_VOICE = "voice";

    /**
     * 默认跟部门id,extId
     */
    public static final Long SYS_ROOT_DEPARTMENT = -1L;

    /**
     * 客户动态是查看素材
     */
    public static final int CUSTOMER_DYNAMIC_TYPE_MEDIA = 1;

    /**
     * 变更类型：修改
     */
    public static final String WX_CHANGE_TYPE_UPDATE = "update";


    /**
     * 变更类型：新增
     */
    public static final String WX_CHANGE_TYPE_CREATE = "create";

    /**
     * 变更详情：成员入群
     */
    public static final String WX_UPDATE_DETAIL_ADD_MEMBER = "add_member";

    /**
     * 变更详情：成员退群
     */
    public static final String WX_UPDATE_DETAIL_DEL_MEMBER = "del_member";

    /**
     * 变更详情：群主变更
     */
    public static final String WX_UPDATE_DETAIL_CHANGE_OWNER = "change_owner";

    /**
     * 变更详情：群名变更
     */
    public static final String WX_UPDATE_DETAIL_CHANGE_NAME = "change_name";

    /**
     * 变更详情：群公告变更
     */
    public static final String WX_UPDATE_DETAIL_CHANGE_NOTICE = "change_notice";


    /**
     * 变更详情：修改客户
     */
    public static final String WX_UPDATE_EDIT_EXTERNAL_CONTACT = "edit_external_contact";


    /**
     * 变更详情：客户接替失败事件
     */
    public static final String WX_STAFF_CUSTOMER_TRANSFER_FAIL = "transfer_fail";


    /**
     * 变更详情
     */
    public static final String WX_UPDATE_DETAIL = "change_detail";

    /**
     * 变更详情: 创建群聊
     */
    public static final String WX_CREATE_GROUP_CHAT = "create_group_chat";

    /**
     * 授权企业的可见员工范围id集合的redis前缀
     */
    public static final String CORP_ACCREDIT_REDIS_PRE = "corpAccreditStaff:";

    /**
     * 授权企业的管理员id集合的redis前缀
     */
    public static final String CORP_ADMIN_REDIS_PRE = "corpAdminStaff:";

    /**
     * 客户打标签的redis前缀
     */
    public static final String EDIT_TAG_REDIS_PRE = "editTag:";

    /**
     * 查询群聊的redis前缀
     */
    public static final String WX_GROUP_CHAT_PRE = "wxGroupChat:";

    /**
     * 客户同步信息列表
     */
    public static final String WX_CUSTOMER_SYNC_INFOS="wxCustomerSyncInfo:";

    /**
     * 客户标签： 新增
     */
    public static final String WX_TAG_CREATE = WxCpConsts.EventType.CHANGE_EXTERNAL_TAG + "_create";

    /**
     * 客户标签： 修改
     */
    public static final String WX_TAG_UPDATE = WxCpConsts.EventType.CHANGE_EXTERNAL_TAG + "_update";

    /**
     * 客户标签： 删除
     */
    public static final String WX_TAG_DELETE = WxCpConsts.EventType.CHANGE_EXTERNAL_TAG + "_delete";

    /**
     * 客户标签： 重排
     */
    public static final String WX_TAG_SHUFFLE = WxCpConsts.EventType.CHANGE_EXTERNAL_TAG + "_shuffle";

    /**
     * 会话存档-消息类型：文本
     */
    public static final String WX_MSG_AUDIT_TYPE_TEXT = "text";

    /**
     * 会话存档-消息类型：图片
     */
    public static final String WX_MSG_AUDIT_TYPE_IMG = "image";

    /**
     * 会话存档-消息类型：表情
     */
    public static final String WX_MSG_AUDIT_TYPE_EMOTION = "emotion";

    /**
     * 会话存档-消息类型：语音
     */
    public static final String WX_MSG_AUDIT_TYPE_VOICE = "voice";

    /**
     * 会话存档-消息类型：链接
     */
    public static final String WX_MSG_AUDIT_TYPE_LINK = "link";

    /**
     * 会话存档-消息类型：文件
     */
    public static final String WX_MSG_AUDIT_TYPE_FILE = "file";

    /**
     * 会话存档-消息类型：撤回
     */
    public static final String WX_MSG_AUDIT_TYPE_REVOKE = "revoke";

    /**
     * 会话存档-消息类型：红包
     */
    public static final String WX_MSG_AUDIT_TYPE_RED_PACKET = "redpacket";

    /**
     * 会话存档-消息类型：红包
     */
    public static final String WX_MSG_AUDIT_TYPE_EXTERNAL_RED_PACKET = "external_redpacket";

    /**
     * 同步客户数据时的锁前缀
     */
    public static final String CUSTOMER_SYNC_LOCK_PRE = "customerSyncLock:";

    /**
     * 企业微信所有回调事件类型列表
     */
    public static final List<String> WX_ALL_EVENT_TYPES = Stream.of(
            WxCpConsts.EventType.SUBSCRIBE,
            WxCpConsts.EventType.UNSUBSCRIBE,
            WxCpConsts.EventType.ENTER_AGENT,
            WxCpConsts.EventType.LOCATION,
            WxCpConsts.EventType.BATCH_JOB_RESULT,
            WxCpConsts.EventType.CHANGE_CONTACT,
            WxCpConsts.EventType.CLICK,
            WxCpConsts.EventType.VIEW,
            WxCpConsts.EventType.SCANCODE_PUSH,
            WxCpConsts.EventType.SCANCODE_WAITMSG,
            WxCpConsts.EventType.PIC_SYSPHOTO,
            WxCpConsts.EventType.PIC_PHOTO_OR_ALBUM,
            WxCpConsts.EventType.PIC_WEIXIN,
            WxCpConsts.EventType.LOCATION_SELECT,
            WxCpConsts.EventType.TASKCARD_CLICK,
            WxCpConsts.EventType.CHANGE_EXTERNAL_CONTACT,
            WxCpConsts.EventType.CHANGE_EXTERNAL_CHAT,
            WxCpConsts.EventType.CHANGE_EXTERNAL_TAG,
            WxCpConsts.EventType.OPEN_APPROVAL_CHANGE,
            WxCpConsts.EventType.SYS_APPROVAL_CHANGE,
            WxCpConsts.EventType.MODIFY_CALENDAR,
            WxCpConsts.EventType.DELETE_CALENDAR,
            WxCpConsts.EventType.ADD_SCHEDULE,
            WxCpConsts.EventType.MODIFY_SCHEDULE,
            "msgaudit_notify",
            WxCpConsts.EventType.DELETE_SCHEDULE).collect(Collectors.toList());

    /**
     * xxl-job定时任务处理类常量
     */

    public static final String WX_MSG_TASK_HANDLER = "wxMsgTaskHandler";

    public static final String SEND_MSG_HANDLER = "sendMsgHandler";

    public static final String CREATE_JOB_HANDLER = "createJobHandler";

    public static final String STOP_JOB_HANDLER = "stopJobHandler";

    public static final String FISSION_TASK_EXPIRE_HANDLER = "fissionTaskExpireJobHandler";

    public static final String FISSION_CONTACT_EXPIRE_HANDLER = "fissionContactExpireJobHandler";

    public static final String FOLLOW_REMIND_HANDLER = "followRemindHandler";

    public static final String CLUE_REMIND_HANDLER = "clueRemindHandler";

    /**
     * 应用内推送要用到的前端页面跳转链接
     */

    /**
     * 客户sop，仅提醒
     */
    public static final String SOP_REMIND = ScrmConfig.getDomainName() + "/sidebar/customerSopRemind?ruleId=%s&executeAt=%s&jobId=%s";

    /**
     * 客户sop,发朋友圈
     */
    public static final String GROUP_SOP_POST = ScrmConfig.getDomainName() + "/sidebar/userMomentsRemind?ruleId=%s&executeAt=%s&jobId=%s";

    /**
     * 群sop,仅提醒
     */
    public static final String GROUP_SOP_REMIND = ScrmConfig.getDomainName() + "/sidebar/groupSopRemind?ruleId=%s&executeAt=%s&jobId=%s";

    /**
     * 客户跟进提醒
     */
    public static final String CUSTOMER_FOLLOW_REMIND = ScrmConfig.getDomainName() + "/sidebar/customerDetail?extCustomerId=%s&staffId=%s";


    /**
     * 下面是客户动态相关的，标签来源
     */
    public static final String DYNAMIC_TAG_TYPE_MEDIA = "media";

    public static final String DYNAMIC_TAG_TYPE_JOIN_TASK = "joinTask";

    public static final String DYNAMIC_TAG_TYPE_FINISH_TASK = "finishTask";

    public static final String DYNAMIC_TAG_TYPE_CONTACT = "contact";

    public static final String DYNAMIC_TAG_TYPE_MANUAL = "manual";


    /**
     * 1:启用 0:禁用
     */
    public static final Integer ENABLE = 1;

    public static final Integer DISABLE = 0;

}

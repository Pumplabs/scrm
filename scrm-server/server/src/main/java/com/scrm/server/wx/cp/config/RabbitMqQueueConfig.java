package com.scrm.server.wx.cp.config;

import com.scrm.common.constant.Constants;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import me.chanjar.weixin.cp.constant.WxCpTpConsts;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/***
 * @author xuxh
 * @date 2022/2/15 15:05
 */
@Configuration
public class RabbitMqQueueConfig {

    /**
     * 修改群信息
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueUpdateDetail() {
        return new Queue(Constants.WX_UPDATE_DETAIL, true);
    }

    /**
     * 修改授权
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueChangeAuth() {
        return new Queue(WxCpTpConsts.InfoType.CHANGE_AUTH, true);
    }

    /**
     * 成员退群
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueUpdateDetailDelMember() {
        return new Queue(Constants.WX_UPDATE_DETAIL_DEL_MEMBER, true);
    }

    /**
     * 成员入群
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueUpdateDetailAddMember() {
        return new Queue(Constants.WX_UPDATE_DETAIL_ADD_MEMBER, true);
    }


    /**
     * 新增群聊
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueCreateGroupChat() {
        return new Queue(Constants.WX_CHANGE_TYPE_CREATE, true);
    }

    /**
     * 解散群聊
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueDismissGroupChat() {
        return new Queue(WxCpConsts.ExternalChatChangeType.DISMISS, true);
    }

    /**
     * 修改用户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueUpdateUser() {
        return new Queue(WxCpConsts.ContactChangeType.UPDATE_USER, true);
    }

    /**
     * 新增用户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueCreateUser() {
        return new Queue(WxCpConsts.ContactChangeType.CREATE_USER, true);
    }

    /**
     * 删除用户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueDeleteUser() {
        return new Queue(WxCpConsts.ContactChangeType.DELETE_USER, true);
    }


    /**
     * 创建部门
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueCreateParty() {
        return new Queue(WxCpConsts.ContactChangeType.CREATE_PARTY, true);
    }

    /**
     * 修改部门
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueUpdateParty() {
        return new Queue(WxCpConsts.ContactChangeType.UPDATE_PARTY, true);
    }


    /**
     * 修改部门
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueDeleteParty() {
        return new Queue(WxCpConsts.ContactChangeType.DELETE_PARTY, true);
    }

    /**
     * 员工删除客户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueStaffDeleteCustomer() {
        return new Queue(WxCpConsts.ExternalContactChangeType.DEL_EXTERNAL_CONTACT, true);
    }

    /**
     * 客户删除员工
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueCustomerDeleteStaff() {
        return new Queue(WxCpConsts.ExternalContactChangeType.DEL_FOLLOW_USER, true);
    }


    /**
     * 添加客户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueCustomerAddCustomer() {
        return new Queue(WxCpConsts.ExternalContactChangeType.ADD_EXTERNAL_CONTACT, true);
    }

    /**
     * 外部联系人免验证添加成员事件
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/2/17 15:26
     */
    @Bean
    public Queue queueAddHalfExternalContact() {
        return new Queue(WxCpConsts.ExternalContactChangeType.ADD_HALF_EXTERNAL_CONTACT, true);
    }


    /**
     * 修改客户
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/4/01 00:19
     */
    @Bean
    public Queue queueEditExternalContact() {
        return new Queue(Constants.WX_UPDATE_EDIT_EXTERNAL_CONTACT, true);
    }

    /**
     * 客户接替失败事件
     *
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/4/01 00:19
     */
    @Bean
    public Queue queueStaffCustomerTransferFail() {
        return new Queue(Constants.WX_STAFF_CUSTOMER_TRANSFER_FAIL, true);
    }


    /**
     * 客户标签： 新增
     *
     * @param
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/5/10 14:35
     */
    @Bean
    public Queue queueCustomerTagCreate() {
        return new Queue(Constants.WX_TAG_CREATE, true);
    }

    /**
     * 客户标签： 修改
     *
     * @param
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/5/10 14:35
     */
    @Bean
    public Queue queueCustomerTagUpdate() {
        return new Queue(Constants.WX_TAG_UPDATE, true);
    }


    /**
     * 客户标签： 删除
     *
     * @param
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/5/10 14:35
     */
    @Bean
    public Queue queueCustomerTagDelete() {
        return new Queue(Constants.WX_TAG_DELETE, true);
    }


    /**
     * 客户标签： 重排
     *
     * @param
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/5/10 14:35
     */
    @Bean
    public Queue queueCustomerTagShuffle() {
        return new Queue(Constants.WX_TAG_SHUFFLE, true);
    }

    /**
     * 客户标签： 重排
     *
     * @param
     * @return org.springframework.amqp.core.Queue
     * @author xuxh
     * @date 2022/5/10 14:35
     */
    @Bean
    public Queue queueUpdateTag() {
        return new Queue(WxCpConsts.ContactChangeType.UPDATE_TAG, true);
    }
}

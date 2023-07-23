/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : localhost:3306
 Source Schema         : scrm

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 23/11/2022 15:06:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for br_async_error_info
-- ----------------------------
DROP TABLE IF EXISTS `br_async_error_info`;
CREATE TABLE `br_async_error_info` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业id',
  `params` text COMMENT '参数',
  `type` varchar(255) NOT NULL COMMENT '类型',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `error_msg` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '错误堆栈信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='异步任务的错误信息记录';

-- ----------------------------
-- Table structure for br_clue
-- ----------------------------
DROP TABLE IF EXISTS `br_clue`;
CREATE TABLE `br_clue` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ID',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户id',
  `status` int NOT NULL COMMENT '状态 1:新建 2:跟进中 3:已关闭 4:已转化',
  `source` varchar(100) NOT NULL COMMENT '客户来源',
  `follow_ext_staff_id` varchar(32) NOT NULL COMMENT '跟进人id',
  `des` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户线索';

-- ----------------------------
-- Table structure for br_common_conf
-- ----------------------------
DROP TABLE IF EXISTS `br_common_conf`;
CREATE TABLE `br_common_conf` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ID',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `color` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '颜色',
  `is_system` tinyint(1) NOT NULL COMMENT '状态 1:系统默认 0:非系统默认',
  `code` int DEFAULT NULL COMMENT '编码',
  `type_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类型编码',
  `group_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '所属分组id',
  `sort` int DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='通用配置';

-- ----------------------------
-- Table structure for br_corp_accredit
-- ----------------------------
DROP TABLE IF EXISTS `br_corp_accredit`;
CREATE TABLE `br_corp_accredit` (
  `id` varchar(32) NOT NULL,
  `corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '授权方企业id（第三方拿到的加密企业id）',
  `permanent_code` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业微信永久授权码,最长为512字节',
  `auth_corp_info` json DEFAULT NULL COMMENT '授权企业信息',
  `auth_info` json DEFAULT NULL COMMENT '授权信息。如果是通讯录应用，且没开启实体应用，是没有该项的。通讯录应用拥有企业通讯录的全部信息读写权限',
  `auth_user_info` json DEFAULT NULL COMMENT '授权用户信息',
  `init_corp_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '未加密的企业id（比较高级的）',
  `address_list_secret` varchar(255) DEFAULT NULL COMMENT '通讯录密钥',
  `customer_contact_secret` varchar(255) DEFAULT NULL COMMENT '客户联系密钥',
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业授权信息';

-- ----------------------------
-- Table structure for br_customer_dynamic
-- ----------------------------
DROP TABLE IF EXISTS `br_customer_dynamic`;
CREATE TABLE `br_customer_dynamic` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `model` int DEFAULT NULL COMMENT '模块',
  `type` int DEFAULT NULL COMMENT '类型',
  `info` json DEFAULT NULL COMMENT '详情',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户ID',
  `ext_staff_id` varchar(32) DEFAULT NULL COMMENT '员工id',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户动态';

-- ----------------------------
-- Table structure for br_customer_follow
-- ----------------------------
DROP TABLE IF EXISTS `br_customer_follow`;
CREATE TABLE `br_customer_follow` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户extId',
  `ext_staff_id` varchar(32) DEFAULT NULL COMMENT '这个客户的负责员工id',
  `content` json NOT NULL COMMENT '跟进内容',
  `share_ext_staff_ids` json DEFAULT NULL COMMENT '分享给的员工的extid',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者extid',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(3) NOT NULL COMMENT '更新时间',
  `deleted_at` datetime(3) DEFAULT NULL,
  `type` int DEFAULT NULL COMMENT '跟进类型 1：客户 2：商机',
  `is_todo` tinyint(1) DEFAULT NULL COMMENT '是否设置待办任务1:是0:否',
  `remind_at` datetime(3) DEFAULT NULL COMMENT '跟进提醒时间',
  `job_id` int DEFAULT NULL COMMENT '定时任务id',
  `is_remind_assist` tinyint(1) DEFAULT NULL COMMENT '是否提醒协作人1:是0:否',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户跟进';

-- ----------------------------
-- Table structure for br_customer_follow_msg
-- ----------------------------
DROP TABLE IF EXISTS `br_customer_follow_msg`;
CREATE TABLE `br_customer_follow_msg` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `follow_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '跟进id',
  `reply_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '回复id',
  `has_reply` tinyint(1) NOT NULL COMMENT '是否是回复，1->回复， 0->跟进',
  `ext_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '员工id',
  `has_read` tinyint(1) NOT NULL COMMENT '是否已读',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户跟进的消息';

-- ----------------------------
-- Table structure for br_customer_follow_reply
-- ----------------------------
DROP TABLE IF EXISTS `br_customer_follow_reply`;
CREATE TABLE `br_customer_follow_reply` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) NOT NULL COMMENT '企业id',
  `follow_id` varchar(32) NOT NULL COMMENT '跟进id',
  `reply_id` varchar(32) DEFAULT NULL COMMENT '回复id',
  `has_reply_follow` tinyint(1) NOT NULL COMMENT '是否回复跟进，1->回复跟进，0->回复回复',
  `content` json NOT NULL COMMENT '回复内容',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '回复人',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户跟进回复表';

-- ----------------------------
-- Table structure for br_field_log
-- ----------------------------
DROP TABLE IF EXISTS `br_field_log`;
CREATE TABLE `br_field_log` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `table_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '数据库表名',
  `method` int DEFAULT NULL COMMENT '操作类型 更新',
  `oper_time` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `oper_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '操作人ID',
  `old_value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '旧值',
  `new_value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新值',
  `field_name` varchar(100) DEFAULT NULL COMMENT '字段名',
  `data_id` varchar(32) DEFAULT NULL COMMENT '数据id',
  `info` json DEFAULT NULL COMMENT '动态详情',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字段变化记录';

-- ----------------------------
-- Table structure for br_follow_task
-- ----------------------------
DROP TABLE IF EXISTS `br_follow_task`;
CREATE TABLE `br_follow_task` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `follow_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '跟进id',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '任务名称',
  `owner` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '负责人id',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '删除时间',
  `finish_at` datetime(3) NOT NULL COMMENT '完成时间',
  `status` tinyint(1) NOT NULL COMMENT '状态 1:已完成 0:未完成 2:已逾期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='待办任务';

-- ----------------------------
-- Table structure for br_friend_welcome
-- ----------------------------
DROP TABLE IF EXISTS `br_friend_welcome`;
CREATE TABLE `br_friend_welcome` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `msg` json DEFAULT NULL COMMENT '消息内容',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `staff_ext_ids` text COMMENT '员工id',
  `department_ext_ids` text COMMENT '部门id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='好友欢迎语';

-- ----------------------------
-- Table structure for br_group_chat_welcome
-- ----------------------------
DROP TABLE IF EXISTS `br_group_chat_welcome`;
CREATE TABLE `br_group_chat_welcome` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `msg` json DEFAULT NULL COMMENT '消息内容',
  `group_chat_ext_ids` json DEFAULT NULL COMMENT '群聊extIds',
  `is_notice_owner` tinyint(1) DEFAULT NULL COMMENT '是否通知群主',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `template_id` varchar(255) DEFAULT NULL COMMENT '欢迎语素材id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='入群欢迎语';

-- ----------------------------
-- Table structure for br_group_sop
-- ----------------------------
DROP TABLE IF EXISTS `br_group_sop`;
CREATE TABLE `br_group_sop` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `term` tinyint(1) NOT NULL COMMENT '触发条件 1:时间 2:添加好友 3:创建群聊',
  `status` tinyint(1) NOT NULL COMMENT '状态 1:已启用 0:已禁用',
  `creator` varchar(32) NOT NULL COMMENT '创建人',
  `editor` varchar(32) DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `has_all_group` tinyint(1) NOT NULL COMMENT '是否全部群聊：1->是，0->不是',
  `group_ids` json DEFAULT NULL COMMENT '选择群聊id集合',
  `start_time` datetime DEFAULT NULL COMMENT '创建开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '创建结束时间',
  `group_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群名关键字',
  `group_tags` json DEFAULT NULL COMMENT '群标签',
  `department_ids` json DEFAULT NULL COMMENT '选群主,部门id集合',
  `leader_ids` json DEFAULT NULL COMMENT '选群主,群主id集合',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='群sop';

-- ----------------------------
-- Table structure for br_group_sop_detail
-- ----------------------------
DROP TABLE IF EXISTS `br_group_sop_detail`;
CREATE TABLE `br_group_sop_detail` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `rule_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则id',
  `ext_corp_id` char(32) NOT NULL COMMENT '外部企业ID',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `send_status` tinyint DEFAULT NULL COMMENT '发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `ext_msg_id` varchar(50) DEFAULT NULL COMMENT '企业群发消息的id，可用于获取群发消息发送结果',
  `ext_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '员工id',
  `ext_chat_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊id',
  `execute_at` timestamp NOT NULL COMMENT '规则执行时间',
  `way` tinyint(1) NOT NULL COMMENT '执行方式，1:仅提醒 2:群发 3:朋友圈',
  `sop_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '所属sop名称',
  `msg` json NOT NULL COMMENT '消息内容',
  `job_id` int DEFAULT NULL COMMENT '所属定时任务id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='群sop-规则执行详情表';

-- ----------------------------
-- Table structure for br_group_sop_rule
-- ----------------------------
DROP TABLE IF EXISTS `br_group_sop_rule`;
CREATE TABLE `br_group_sop_rule` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `sop_id` varchar(32) NOT NULL COMMENT '所属sopid',
  `job_id` json DEFAULT NULL COMMENT '定时任务id',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则名称',
  `execute_at` datetime DEFAULT NULL COMMENT '触发条件为时间，执行时间',
  `period` tinyint(1) DEFAULT NULL COMMENT '重复周期,1:每日 2:每周 3:每两周 4:每月 5:永不 6:自定义',
  `end_at` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '结束重复时间',
  `custom_day` int DEFAULT NULL COMMENT '自定义间隔天数',
  `start_day` int DEFAULT NULL COMMENT '创建群聊天数',
  `start_time` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建群聊触发，具体执行时间',
  `way` tinyint(1) NOT NULL COMMENT '执行方式，1:仅提醒 2:群发 3:朋友圈',
  `creator` varchar(32) NOT NULL COMMENT '创建人',
  `editor` varchar(32) DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `msg` json NOT NULL COMMENT '消息内容',
  `limit_day` int DEFAULT NULL COMMENT '任务截止天数',
  `limit_hour` int DEFAULT NULL COMMENT '任务截止小时',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='群sop规则';

-- ----------------------------
-- Table structure for br_journey
-- ----------------------------
DROP TABLE IF EXISTS `br_journey`;
CREATE TABLE `br_journey` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sort` int DEFAULT NULL COMMENT '排序',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='旅程信息';

-- ----------------------------
-- Table structure for br_journey_stage
-- ----------------------------
DROP TABLE IF EXISTS `br_journey_stage`;
CREATE TABLE `br_journey_stage` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `journey_id` varchar(32) NOT NULL COMMENT '所属旅程id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  `sort` int DEFAULT NULL COMMENT '排序',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '''删除时间''',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='旅程阶段';

-- ----------------------------
-- Table structure for br_journey_stage_customer
-- ----------------------------
DROP TABLE IF EXISTS `br_journey_stage_customer`;
CREATE TABLE `br_journey_stage_customer` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `journey_stage_id` varchar(32) DEFAULT NULL COMMENT '旅程阶段id',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '''删除时间''',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `journey_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '旅程id',
  `customer_ext_id` varchar(50) DEFAULT NULL COMMENT '客戶extId',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='旅程阶段-客户关联';

-- ----------------------------
-- Table structure for br_media_count
-- ----------------------------
DROP TABLE IF EXISTS `br_media_count`;
CREATE TABLE `br_media_count` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型，1->素材，2->话术',
  `type_id` varchar(32) NOT NULL COMMENT '类型的id',
  `send_count` int NOT NULL DEFAULT '0' COMMENT '发送的次数',
  `date` date NOT NULL COMMENT '日期',
  `create_time` datetime(3) NOT NULL COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='素材统计表';

-- ----------------------------
-- Table structure for br_media_count_detail
-- ----------------------------
DROP TABLE IF EXISTS `br_media_count_detail`;
CREATE TABLE `br_media_count_detail` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型，1->素材，2->话术',
  `type_id` varchar(32) NOT NULL COMMENT '类型的id',
  `send_count` int NOT NULL DEFAULT '0' COMMENT '发送的次数',
  `ext_staff_id` varchar(32) NOT NULL COMMENT '发送人',
  `ext_customer_id` varchar(32) NOT NULL COMMENT '客户',
  `create_time` datetime(3) NOT NULL COMMENT '创建时间',
  `update_time` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='素材统计表详情';

-- ----------------------------
-- Table structure for br_media_info
-- ----------------------------
DROP TABLE IF EXISTS `br_media_info`;
CREATE TABLE `br_media_info` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型， 1-> 海报， 2->图片， 3->文本， 4->小程序， 5-> 文章， 6->视频， 7->链接， 8->文件',
  `file_id` varchar(32) DEFAULT NULL COMMENT '文件id',
  `title` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '标题，最长40',
  `description` varchar(150) DEFAULT NULL COMMENT '描述，最长150',
  `content` varchar(500) DEFAULT NULL COMMENT '文本内容，最长500',
  `summary` varchar(35) DEFAULT NULL COMMENT '概要，最长35',
  `video_snapshot_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '视频封面id',
  `link` text COMMENT '链接',
  `rich_text` json DEFAULT NULL COMMENT '富文本文章内容',
  `app_info` json DEFAULT NULL COMMENT '小程序的app的各种信息',
  `wx_tag_list` json DEFAULT NULL COMMENT '客户标签',
  `media_tag_list` json DEFAULT NULL COMMENT '素材标签集合',
  `has_inform` tinyint(1) DEFAULT NULL COMMENT '是否动态通知',
  `has_update` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否被编辑过了，每次编辑删除生成新的id，这个让旧的选了素材的还可以关联上',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者id',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(3) NOT NULL COMMENT '更新时间',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='素材管理';

-- ----------------------------
-- Table structure for br_media_say
-- ----------------------------
DROP TABLE IF EXISTS `br_media_say`;
CREATE TABLE `br_media_say` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) NOT NULL,
  `group_id` varchar(32) NOT NULL COMMENT '分组id',
  `name` varchar(255) DEFAULT NULL COMMENT '话术名',
  `msg` json NOT NULL COMMENT '话术内容',
  `title` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标题（查询字段）',
  `send_num` int DEFAULT NULL COMMENT '发送次数',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者id',
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `has_delete` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='（素材库）企业话术';

-- ----------------------------
-- Table structure for br_media_say_group
-- ----------------------------
DROP TABLE IF EXISTS `br_media_say_group`;
CREATE TABLE `br_media_say_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `has_default` tinyint(1) NOT NULL COMMENT '是否是默认分组',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者外部员工ID',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '组名字',
  `has_person` tinyint(1) NOT NULL COMMENT '是否是个人分组',
  `department_list` json DEFAULT NULL COMMENT '该标签组可用部门列表',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_tag_group_name` (`name`),
  KEY `idx_tag_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_tag_group_ext_creator_id` (`creator_ext_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='（素材库）企业微信话术组管理';

-- ----------------------------
-- Table structure for br_media_say_tag
-- ----------------------------
DROP TABLE IF EXISTS `br_media_say_tag`;
CREATE TABLE `br_media_say_tag` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `say_id` varchar(32) NOT NULL COMMENT '话术id',
  `tag_id` varchar(32) NOT NULL COMMENT '标签id',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_tag_group_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='（素材库）企业微信话术标签关联表管理';

-- ----------------------------
-- Table structure for br_media_tag
-- ----------------------------
DROP TABLE IF EXISTS `br_media_tag`;
CREATE TABLE `br_media_tag` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `creator_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者员工ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名称',
  `order` int NOT NULL COMMENT '排序',
  `group_id` varchar(32) NOT NULL COMMENT '标签组id',
  `created_at` datetime(3) NOT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) NOT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_tag_ext_corp_id` (`ext_corp_id`),
  KEY `idx_tag_ext_creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='（素材库）企业微信标签管理';

-- ----------------------------
-- Table structure for br_media_tag_group
-- ----------------------------
DROP TABLE IF EXISTS `br_media_tag_group`;
CREATE TABLE `br_media_tag_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `creator_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` varchar(191) DEFAULT NULL COMMENT '组名字',
  `department_list` json DEFAULT NULL COMMENT '该标签组可用部门列表',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_tag_group_name` (`name`),
  KEY `idx_tag_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_tag_group_ext_creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='（素材库）企业微信标签组管理';

-- ----------------------------
-- Table structure for br_mp_accredit
-- ----------------------------
DROP TABLE IF EXISTS `br_mp_accredit`;
CREATE TABLE `br_mp_accredit` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `authorizer_app_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '授权企业的appid',
  `authorizer_refresh_token` varchar(255) NOT NULL COMMENT '刷新令牌（在授权的公众号具备API权限时，才有此返回值），刷新令牌主要用于第三方平台获取和刷新已授权用户的 authorizer_access_token。一旦丢失，只能让用户重新授权，才能再次拿到新的刷新令牌。用户重新授权后，之前的刷新令牌会失效',
  `func_info` json NOT NULL COMMENT '授权给开发者的权限集列表',
  `nick_name` varchar(255) DEFAULT NULL COMMENT '昵称',
  `head_img` varchar(255) DEFAULT NULL COMMENT '头像',
  `service_type_info` json DEFAULT NULL COMMENT '公众号类型',
  `verify_type_info` json DEFAULT NULL COMMENT '公众号认证类型',
  `user_name` varchar(255) DEFAULT NULL COMMENT '原始 ID',
  `principal_name` varchar(255) DEFAULT NULL COMMENT '主体名称',
  `alias` varchar(255) DEFAULT NULL COMMENT '公众号所设置的微信号，可能为空',
  `business_info` json DEFAULT NULL COMMENT '用以了解功能的开通状况（0代表未开通，1代表已开通），详见business_info 说明',
  `qrcode_url` varchar(255) DEFAULT NULL COMMENT '二维码图片的 URL，开发者最好自行也进行保存',
  `account_status` tinyint(1) DEFAULT NULL COMMENT '帐号状态，该字段小程序也返回',
  `idc` int DEFAULT NULL COMMENT '不知道啥',
  `signature` varchar(255) DEFAULT NULL COMMENT '帐号介绍',
  `mini_program_info` json DEFAULT NULL COMMENT '小程序配置，根据这个字段判断是否为小程序类型授权',
  `has_program` tinyint(1) DEFAULT NULL COMMENT '是否是小程序',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='微信第三方平台授权信息';

-- ----------------------------
-- Table structure for br_opportunity
-- ----------------------------
DROP TABLE IF EXISTS `br_opportunity`;
CREATE TABLE `br_opportunity` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `group_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所属分组id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `priority` int DEFAULT NULL COMMENT '优先级 1->高，2->中 3->低',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所有者id',
  `stage_id` varchar(255) NOT NULL COMMENT '阶段id',
  `expect_money` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '预计金额',
  `deal_chance` varchar(100) DEFAULT NULL COMMENT '成单概率',
  `expect_deal_date` date DEFAULT NULL COMMENT '预计成交日期',
  `desp` varchar(500) DEFAULT NULL COMMENT '描述',
  `fail_reason_id` varchar(255) DEFAULT NULL COMMENT '失败原因id',
  `fail_reason` varchar(255) DEFAULT NULL COMMENT '失败原因,自定义',
  `customer_ext_id` varchar(255) DEFAULT NULL COMMENT '客户extId',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商机';

-- ----------------------------
-- Table structure for br_opportunity_cooperator
-- ----------------------------
DROP TABLE IF EXISTS `br_opportunity_cooperator`;
CREATE TABLE `br_opportunity_cooperator` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `cooperator_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '协作人id',
  `opportunity_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商机id',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `can_update` tinyint(1) NOT NULL COMMENT '是否可编辑 1->是，0->否',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商机-协作人关联';

-- ----------------------------
-- Table structure for br_opportunity_group
-- ----------------------------
DROP TABLE IF EXISTS `br_opportunity_group`;
CREATE TABLE `br_opportunity_group` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `is_system` tinyint(1) NOT NULL COMMENT '1->系统默认，0->非系统默认',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商机分组';

-- ----------------------------
-- Table structure for br_order
-- ----------------------------
DROP TABLE IF EXISTS `br_order`;
CREATE TABLE `br_order` (
  `id` varchar(32) NOT NULL COMMENT '主键ID',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `customer_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户extId',
  `manager_staff_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '负责员工extId',
  `product_ids` json DEFAULT NULL COMMENT '产品ID列表',
  `discount` varchar(255) DEFAULT NULL COMMENT '折扣',
  `order_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '订单金额（元）',
  `collection_amount` varchar(255) DEFAULT NULL COMMENT '收款金额（元）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '描述',
  `attachments` json DEFAULT NULL COMMENT '附件ID列表',
  `status` int NOT NULL COMMENT '订单状态 1:待审核 2:已确定 3:已完成 4:审核不通过',
  `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '订单编号',
  `opportunity_id` varchar(32) DEFAULT NULL COMMENT '商机ID',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `audit_failed_msg` varchar(1000) DEFAULT NULL COMMENT '审核不通过原因',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='产品订单';

-- ----------------------------
-- Table structure for br_order_product
-- ----------------------------
DROP TABLE IF EXISTS `br_order_product`;
CREATE TABLE `br_order_product` (
  `id` varchar(32) NOT NULL COMMENT '主键ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '产品名称',
  `product_id` varchar(32) DEFAULT NULL COMMENT '产品ID',
  `product_price` varchar(255) DEFAULT NULL COMMENT '产品单价',
  `discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '折扣',
  `product_num` int DEFAULT NULL COMMENT '产品数据',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `order_id` varchar(32) NOT NULL COMMENT '所属订单ID',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单-产品关联';

-- ----------------------------
-- Table structure for br_product_info
-- ----------------------------
DROP TABLE IF EXISTS `br_product_info`;
CREATE TABLE `br_product_info` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品名称',
  `description` json DEFAULT NULL COMMENT '产品描述',
  `status` int NOT NULL COMMENT '产品状态 1:草稿 2:销售中 3:已下架',
  `product_type_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品分类ID',
  `atlas` json DEFAULT NULL COMMENT '产品图册',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `profile` varchar(1000) DEFAULT NULL COMMENT '产品简介',
  `code` varchar(255) DEFAULT NULL COMMENT '产品编码',
  `imbue` json DEFAULT NULL COMMENT '附加属性',
  `views` bigint DEFAULT NULL COMMENT '浏览次数',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='产品信息';

-- ----------------------------
-- Table structure for br_product_type
-- ----------------------------
DROP TABLE IF EXISTS `br_product_type`;
CREATE TABLE `br_product_type` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '编辑员工id',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='产品分类';

-- ----------------------------
-- Table structure for br_report_sale
-- ----------------------------
DROP TABLE IF EXISTS `br_report_sale`;
CREATE TABLE `br_report_sale` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(32) NOT NULL,
  `count_data` json NOT NULL COMMENT '统计数据',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='销售日报';

-- ----------------------------
-- Table structure for br_sale_target
-- ----------------------------
DROP TABLE IF EXISTS `br_sale_target`;
CREATE TABLE `br_sale_target` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `month` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '月份',
  `creator_ext_id` varchar(32) NOT NULL COMMENT '创建者extId',
  `staff_ext_id` varchar(32) NOT NULL COMMENT '员工extId',
  `target` int NOT NULL COMMENT '本月目标(元)',
  `created_at` datetime(3) NOT NULL COMMENT '创建时间',
  `updated_at` datetime(3) NOT NULL COMMENT '更新时间',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='销售目标';

-- ----------------------------
-- Table structure for br_sop
-- ----------------------------
DROP TABLE IF EXISTS `br_sop`;
CREATE TABLE `br_sop` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `term` tinyint(1) NOT NULL COMMENT '触发条件 1:时间 2:添加好友 3:创建群聊',
  `status` tinyint(1) NOT NULL COMMENT '状态 1:已启用 0:已禁用',
  `creator` varchar(32) NOT NULL COMMENT '创建人',
  `editor` varchar(32) DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `has_all_customer` tinyint(1) NOT NULL COMMENT '是否全部客户,1是，0否',
  `choose_tags` json DEFAULT NULL COMMENT '选择的标签数组',
  `staff_ids` json DEFAULT NULL COMMENT '选员工，员工id集合',
  `department_ids` json DEFAULT NULL COMMENT '选员工，部门id集合',
  `customer_ids` json DEFAULT NULL COMMENT '客户id集合',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='sop';

-- ----------------------------
-- Table structure for br_sop_detail
-- ----------------------------
DROP TABLE IF EXISTS `br_sop_detail`;
CREATE TABLE `br_sop_detail` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `rule_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则id',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_staff_id` varchar(32) NOT NULL COMMENT '员工id',
  `send_status` tinyint DEFAULT NULL COMMENT '发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `ext_msg_id` varchar(50) DEFAULT NULL COMMENT '企业群发消息的id，可用于获取群发消息发送结果',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户id',
  `execute_at` timestamp NULL DEFAULT NULL COMMENT '规则执行时间',
  `sop_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '所属sop名称',
  `msg` json NOT NULL COMMENT '消息内容',
  `way` tinyint(1) NOT NULL COMMENT '执行方式，1:仅提醒 2:群发 3:朋友圈',
  `job_id` int DEFAULT NULL COMMENT '所属定时任务id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='群sop-规则执行详情表';

-- ----------------------------
-- Table structure for br_sop_rule
-- ----------------------------
DROP TABLE IF EXISTS `br_sop_rule`;
CREATE TABLE `br_sop_rule` (
  `id` varchar(32) NOT NULL COMMENT '主键id',
  `sop_id` varchar(32) NOT NULL COMMENT '所属sopid',
  `job_id` json DEFAULT NULL COMMENT '定时任务id',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则名称',
  `execute_at` timestamp NULL DEFAULT NULL COMMENT '触发条件为时间，执行时间',
  `period` tinyint(1) DEFAULT NULL COMMENT '重复周期,1:每日 2:每周 3:每两周 4:每月 5:永不 6:自定义',
  `end_at` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '结束重复时间',
  `custom_day` int DEFAULT NULL COMMENT '自定义间隔天数',
  `start_day` int DEFAULT NULL COMMENT '添加好友第几天',
  `start_time` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '添加好友，具体执行时刻',
  `way` tinyint(1) NOT NULL COMMENT '执行方式，1:仅提醒 2:群发 3:朋友圈',
  `creator` varchar(32) NOT NULL COMMENT '创建人',
  `editor` varchar(32) DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `msg` json NOT NULL COMMENT '消息内容',
  `limit_day` int DEFAULT NULL COMMENT '任务截止天数',
  `limit_hour` int DEFAULT NULL COMMENT '任务截止小时',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='sop规则';

-- ----------------------------
-- Table structure for br_todo
-- ----------------------------
DROP TABLE IF EXISTS `br_todo`;
CREATE TABLE `br_todo` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '待办名称',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `business_id` varchar(100) DEFAULT NULL COMMENT '关联业务id',
  `status` tinyint(1) NOT NULL COMMENT '状态 1:已完成 0:未完成 2:已逾期',
  `type` tinyint(1) NOT NULL COMMENT '待办类型 1:sop 2:群sop 3:跟进',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建员工id',
  `owner_ext_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所属客户id',
  `business_id1` varchar(100) DEFAULT NULL COMMENT '关联业务id1',
  `deadline_time` timestamp NULL DEFAULT NULL COMMENT '截止时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='待办';

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `des` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  `creator` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建人',
  `editor` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `parent_id` varchar(100) DEFAULT NULL COMMENT '父id',
  `url` varchar(100) DEFAULT NULL COMMENT '菜单路径',
  `type` int DEFAULT NULL COMMENT '类型1:菜单 2:功能',
  `sort` int DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统菜单表';

-- ----------------------------
-- Table structure for sys_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `model_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '模块名称',
  `method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '方法名称',
  `request_method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '请求方式',
  `operator_type` varchar(255) DEFAULT '0' COMMENT '操作类型',
  `oper_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '操作人员',
  `oper_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '请求URL',
  `oper_ip` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '主机地址',
  `oper_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '操作地点',
  `oper_param` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '请求参数',
  `json_result` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '返回参数',
  `status` int DEFAULT '0' COMMENT '操作状态（0正常 1异常）',
  `error_msg` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '错误消息',
  `oper_time` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `operator_server` int DEFAULT NULL COMMENT '操作服务（1: 后台管理 2:客户端 ）',
  `ext_corp_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `oper_id` varchar(32) DEFAULT NULL COMMENT '操作人ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志记录';

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色ID',
  `role_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色权限字符串',
  `role_sort` int NOT NULL COMMENT '显示顺序',
  `data_scope` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `menu_check_strictly` tinyint(1) DEFAULT '1' COMMENT '菜单树选择项是否关联显示',
  `dept_check_strictly` tinyint(1) DEFAULT '1' COMMENT '部门树选择项是否关联显示',
  `status` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色状态（0正常 1停用）',
  `creator` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT '' COMMENT '创建者',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `editor` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT '' COMMENT '更新者',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '备注',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='角色信息表';

-- ----------------------------
-- Table structure for sys_role_staff
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_staff`;
CREATE TABLE `sys_role_staff` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `role_id` varchar(32) NOT NULL COMMENT '角色ID',
  `ext_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '员工extId',
  `created_at` datetime(3) DEFAULT NULL COMMENT '创建时间',
  `creator` varchar(32) DEFAULT NULL COMMENT '创建人',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色-员工关联';

-- ----------------------------
-- Table structure for sys_service_version
-- ----------------------------
DROP TABLE IF EXISTS `sys_service_version`;
CREATE TABLE `sys_service_version` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ID',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `seat` int DEFAULT NULL COMMENT '基础席位',
  `capacity` varchar(32) DEFAULT NULL COMMENT '存储容量，单位GB',
  `des` varchar(100) DEFAULT NULL COMMENT '描述',
  `creator` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建人',
  `editor` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '更新人',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `menu_ids` json DEFAULT NULL COMMENT '关联菜单id集合',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统版本表';

-- ----------------------------
-- Table structure for sys_subscribe
-- ----------------------------
DROP TABLE IF EXISTS `sys_subscribe`;
CREATE TABLE `sys_subscribe` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '授权方企业id（第三方拿到的加密企业id）',
  `version_id` varchar(32) NOT NULL COMMENT '版本id',
  `seat` int NOT NULL COMMENT '席位',
  `capacity` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '存储容量，单位GB',
  `use_seat` int NOT NULL COMMENT '已用席位',
  `use_capacity` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '已用存储容量，单位GB',
  `validity` timestamp NOT NULL COMMENT '有效期',
  `status` tinyint NOT NULL COMMENT '状态 0-已过期 1-订阅中',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `staff_ids` json DEFAULT NULL COMMENT '配置员工集合',
  `corp_name` varchar(100) DEFAULT NULL COMMENT '企业名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业订阅管理';

-- ----------------------------
-- Table structure for sys_switch
-- ----------------------------
DROP TABLE IF EXISTS `sys_switch`;
CREATE TABLE `sys_switch` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '''ID''',
  `code` varchar(255) NOT NULL COMMENT '类型',
  `status` bit(1) NOT NULL DEFAULT b'0' COMMENT '开关状态 0:关 1:开',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `details` varchar(255) DEFAULT NULL COMMENT '描述',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `editor` varchar(255) DEFAULT NULL COMMENT '编辑人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `username` varchar(100) NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `id` varchar(32) NOT NULL COMMENT 'id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统用户表';

-- ----------------------------
-- Table structure for wx_contact_expiration
-- ----------------------------
DROP TABLE IF EXISTS `wx_contact_expiration`;
CREATE TABLE `wx_contact_expiration` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `config_id` varchar(32) NOT NULL COMMENT '渠道码id',
  `group_id` varchar(32) DEFAULT NULL COMMENT '可选，组id，方便更新时用',
  `expiration_time` datetime NOT NULL COMMENT '过期时间',
  `job_id` int DEFAULT NULL COMMENT 'xxl-job的id',
  `has_delete` tinyint(1) NOT NULL COMMENT '是否已删除成功',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='渠道码，过期时间表';

-- ----------------------------
-- Table structure for wx_contact_way
-- ----------------------------
DROP TABLE IF EXISTS `wx_contact_way`;
CREATE TABLE `wx_contact_way` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` varchar(255) DEFAULT NULL COMMENT '''渠道码名称''',
  `config_id` varchar(191) DEFAULT NULL COMMENT '渠道码配置ID',
  `group_id` varchar(32) DEFAULT NULL COMMENT '活码分组ID',
  `qr_code` longtext COMMENT '联系二维码的URL',
  `remark` longtext COMMENT '渠道码的备注信息',
  `skip_verify` tinyint(1) DEFAULT '1' COMMENT '外部客户添加时是否无需验证，假布尔类型',
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业自定义的state参数',
  `add_customer_count` int DEFAULT '0' COMMENT '扫码添加人次',
  `auto_reply_type` tinyint(1) DEFAULT '1' COMMENT '''欢迎语类型：1，渠道欢迎语；2, 渠道默认欢迎语；3，不送欢迎语；''',
  `reply_info` json DEFAULT NULL COMMENT '欢迎语策略',
  `customer_desc` longtext COMMENT '客户描述',
  `customer_desc_enable` tinyint(1) DEFAULT '0' COMMENT '是否开启客户描述',
  `customer_remark` longtext COMMENT '客户备注',
  `customer_remark_enable` tinyint(1) DEFAULT '0' COMMENT '是否开启客户备注',
  `daily_add_customer_limit_enable` tinyint(1) DEFAULT '0' COMMENT '是否开启员工每日添加上限',
  `daily_add_customer_limit` int DEFAULT NULL COMMENT '员工每日添加上限',
  `auto_tag_enable` tinyint(1) DEFAULT '0' COMMENT '''是否自动打标签''',
  `customer_tag_ext_ids` json DEFAULT NULL COMMENT '''自动打标签绑定的标签ExtID数组''',
  `staff_ids` json DEFAULT NULL COMMENT '员工id',
  `back_out_staff_ids` json DEFAULT NULL COMMENT '备用员工id集合',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_contact_way_auto_reply_type` (`auto_reply_type`),
  KEY `idx_contact_way_ext_corp_id` (`ext_corp_id`),
  KEY `idx_contact_way_ext_creator_id` (`ext_creator_id`),
  KEY `idx_contact_way_name` (`name`),
  KEY `idx_contact_way_config_id` (`config_id`),
  KEY `idx_contact_way_group_id` (`group_id`),
  KEY `idx_contact_way_add_customer_count` (`add_customer_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='渠道活码';

-- ----------------------------
-- Table structure for wx_contact_way_group
-- ----------------------------
DROP TABLE IF EXISTS `wx_contact_way_group`;
CREATE TABLE `wx_contact_way_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` varchar(191) DEFAULT NULL COMMENT '''分组名称''',
  `is_default` tinyint(1) DEFAULT '2' COMMENT '''是否为默认分组，1：是；2：否''',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_contact_way_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_contact_way_group_ext_creator_id` (`ext_creator_id`),
  KEY `idx_contact_way_group_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='渠道活码-分组信息';

-- ----------------------------
-- Table structure for wx_customer
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer`;
CREATE TABLE `wx_customer` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_id` char(32) DEFAULT NULL COMMENT '微信定义的userID',
  `name` varchar(255) DEFAULT NULL COMMENT '名称，微信用户对应微信昵称；企业微信用户，则为联系人或管理员设置的昵称、认证的实名和账号名称',
  `position` longtext COMMENT '职位,客户为企业微信时使用',
  `corp_name` varchar(255) DEFAULT NULL COMMENT '客户的公司名称,仅当客户ID为企业微信ID时存在',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png' COMMENT '头像',
  `type` int DEFAULT NULL COMMENT '类型,1-微信用户, 2-企业微信用户',
  `gender` int DEFAULT NULL COMMENT '性别,0-未知 1-男性 2-女性',
  `unionid` varchar(128) DEFAULT NULL COMMENT '微信开放平台的唯一身份标识(微信unionID)',
  `external_profile` json DEFAULT NULL COMMENT '仅当联系人类型是企业微信用户时有此字段',
  `has_friend` tinyint(1) DEFAULT '1' COMMENT '是否是我们的客户，0->不是，1->是',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `is_deleted_staff` tinyint DEFAULT '0' COMMENT '是否移除员工',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_ext_del` (`ext_corp_id`,`ext_id`,`has_delete`),
  KEY `idx_customer_ext_corp_id` (`ext_corp_id`),
  KEY `idx_customer_ext_creator_id` (`ext_creator_id`),
  KEY `idx_customer_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信客户';

-- ----------------------------
-- Table structure for wx_customer_info
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_info`;
CREATE TABLE `wx_customer_info` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_customer_id` char(32) DEFAULT NULL COMMENT '微信客户ID',
  `ext_staff_id` char(32) DEFAULT NULL COMMENT '微信员工ID',
  `age` int DEFAULT NULL COMMENT '年龄',
  `description` text COMMENT '描述',
  `email` varchar(32) DEFAULT NULL COMMENT '邮箱',
  `phone_number` char(32) DEFAULT NULL COMMENT '电话',
  `qq` varchar(16) DEFAULT NULL COMMENT 'qq',
  `address` varchar(128) DEFAULT NULL COMMENT '地址',
  `birthday` char(10) DEFAULT NULL COMMENT '生日',
  `weibo` varchar(128) DEFAULT NULL COMMENT '微博',
  `remark_field` json DEFAULT NULL COMMENT '自定义字段的值',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `gender` int DEFAULT NULL COMMENT '性别,0-未知 1-男性 2-女性',
  `corp_name` varchar(255) DEFAULT NULL COMMENT '企业',
  `customer_id` varchar(32) DEFAULT NULL COMMENT '客户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_cus_staff` (`ext_corp_id`,`ext_customer_id`,`ext_staff_id`,`has_delete`),
  KEY `idx_customer_info_ext_corp_id` (`ext_corp_id`),
  KEY `idx_customer_info_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信客户详情信息';

-- ----------------------------
-- Table structure for wx_customer_loss_info
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_loss_info`;
CREATE TABLE `wx_customer_loss_info` (
  `id` varchar(32) NOT NULL,
  `customer_id` varchar(32) DEFAULT NULL COMMENT '客户ID',
  `ext_customer_id` varchar(32) DEFAULT NULL COMMENT '客户extId',
  `staff_id` varchar(32) DEFAULT NULL COMMENT '员工ID',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `add_time` datetime DEFAULT NULL COMMENT '添加时间',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `type` int DEFAULT NULL COMMENT '类型 1:客户删除员工 2:员工删除客户',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `tag_ext_ids` json DEFAULT NULL COMMENT '客户标签extId列表',
  `journey_stage_ids` json DEFAULT NULL COMMENT '所属客户旅程阶段ID列表',
  `customer_staff_id` varchar(32) DEFAULT NULL COMMENT '客户员工跟进ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户流失情况信息';

-- ----------------------------
-- Table structure for wx_customer_staff
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_staff`;
CREATE TABLE `wx_customer_staff` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_staff_id` char(32) DEFAULT NULL COMMENT '员工ID',
  `ext_customer_id` char(32) DEFAULT NULL COMMENT '客户ID',
  `remark` varchar(255) DEFAULT NULL COMMENT '员工对客户的备注',
  `description` varchar(255) DEFAULT NULL COMMENT '员工对此客户的描述',
  `create_time` datetime(3) DEFAULT NULL COMMENT '员工添加客户的时间',
  `remark_corp_name` varchar(255) DEFAULT NULL COMMENT '员工对客户备注的企业名称',
  `remark_mobiles` json DEFAULT NULL COMMENT '对此客户备注的手机号码',
  `add_way` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '添加此客户的来源,0-未知来源 1-扫描二维码 2-搜索手机号 3-名片分享 4-群聊 5-手机通讯录 6-微信联系人 7-来自微信的添加好友申请 8-安装第三方应用时自动添加的客服人员 9-搜索邮箱 201-内部成员共享 202-管理员/负责人分配',
  `oper_user_id` varchar(255) DEFAULT NULL COMMENT '发起添加的userid',
  `state` varchar(255) DEFAULT NULL COMMENT '区分客户具体是通过哪个「联系我」添加，由企业通过创建「联系我」方式指定',
  `is_notified` tinyint DEFAULT NULL COMMENT '是否已发送通知 1-是 2-否',
  `signature` char(64) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `customer_id` varchar(32) DEFAULT NULL COMMENT '客户ID',
  `is_deleted_staff` tinyint DEFAULT '0' COMMENT '是否移除员工',
  `remark_pic_mediaid` varchar(255) DEFAULT NULL COMMENT '备注图片的mediaid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ext_staff_id_ext_customer_id` (`ext_staff_id`,`ext_customer_id`,`deleted_at`,`oper_user_id`) USING BTREE,
  KEY `idx_customer_staff_ext_corp_id` (`ext_corp_id`),
  KEY `idx_customer_staff_ext_creator_id` (`ext_creator_id`),
  KEY `idx_customer_staff_ext_staff_id` (`ext_staff_id`),
  KEY `idx_customer_staff_ext_customer_id` (`ext_customer_id`),
  KEY `idx_customer_staff_signature` (`signature`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信客户-员工跟进情况表';

-- ----------------------------
-- Table structure for wx_customer_staff_assist
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_staff_assist`;
CREATE TABLE `wx_customer_staff_assist` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `ext_staff_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '员工extId',
  `ext_customer_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户extId',
  `assist_ext_staff_id` char(32) DEFAULT NULL COMMENT '协助员工extId',
  `created_at` datetime DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户-员工跟进协助人';

-- ----------------------------
-- Table structure for wx_customer_staff_tag
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_staff_tag`;
CREATE TABLE `wx_customer_staff_tag` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `customer_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '员工客户跟踪表ID',
  `ext_tag_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '标签ID',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `ext_customer_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户extId',
  `ext_staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '员工extId',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_cus_tag_del` (`ext_corp_id`,`customer_staff_id`,`ext_tag_id`,`has_delete`),
  KEY `idx_customer_staff_tag_ext_corp_id` (`ext_corp_id`),
  KEY `idx_customer_staff_tag_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户标签';

-- ----------------------------
-- Table structure for wx_customer_tag_add_info
-- ----------------------------
DROP TABLE IF EXISTS `wx_customer_tag_add_info`;
CREATE TABLE `wx_customer_tag_add_info` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `tag_id` varchar(32) DEFAULT NULL COMMENT '标签id',
  `customer_id` varchar(32) DEFAULT NULL COMMENT '客户id',
  `is_successful` tinyint(1) DEFAULT NULL COMMENT '是否成功',
  `fail_type` varchar(255) DEFAULT NULL COMMENT '失败类型',
  `fail_msg` varchar(255) DEFAULT NULL COMMENT '失败原因',
  `fail_log` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '失败日志',
  `param` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '请求参数',
  `created_at` timestamp NOT NULL COMMENT '创建时间',
  `creator` varchar(32) NOT NULL COMMENT '创建员工id',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信客户-批量添加标签明细';

-- ----------------------------
-- Table structure for wx_department
-- ----------------------------
DROP TABLE IF EXISTS `wx_department`;
CREATE TABLE `wx_department` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_id` bigint DEFAULT NULL COMMENT '企微定义的部门ID',
  `name` varchar(255) DEFAULT NULL COMMENT '部门名称',
  `ext_parent_id` bigint unsigned DEFAULT NULL COMMENT '上级部门ID,根部门为1',
  `order` bigint unsigned DEFAULT NULL COMMENT '在父部门中的次序值',
  `welcome_msg_id` bigint DEFAULT NULL COMMENT '部门使用的欢迎语',
  `staff_num` bigint NOT NULL DEFAULT '0' COMMENT '成员数量',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_ext_del` (`ext_corp_id`,`ext_id`,`has_delete`),
  KEY `idx_department_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业部门表';

-- ----------------------------
-- Table structure for wx_dynamic_media
-- ----------------------------
DROP TABLE IF EXISTS `wx_dynamic_media`;
CREATE TABLE `wx_dynamic_media` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户id',
  `ext_staff_id` varchar(32) NOT NULL COMMENT '员工extid',
  `media_info_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '轨迹素材id',
  `time` int NOT NULL COMMENT '查看时长（s）',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户查看素材的动态';

-- ----------------------------
-- Table structure for wx_fission_contact
-- ----------------------------
DROP TABLE IF EXISTS `wx_fission_contact`;
CREATE TABLE `wx_fission_contact` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `task_id` varchar(32) NOT NULL COMMENT '任务id',
  `has_system` tinyint(1) NOT NULL COMMENT '是否是任务默认的海报，1->是，0->不是',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户id',
  `config_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '渠道码配置id',
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '渠道码的state,fission:taskId:1开始',
  `qr_code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '渠道码的二维码',
  `has_new_customer` tinyint(1) NOT NULL COMMENT '是否是本地活动裂变的新客户，1->是，0->不是',
  `poster_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '海报文件id，wx_temp_file的id',
  `the_last_poster_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '生成海报文件时任务的海报的文件id，wx_temp_file的id',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企微应用宝-渠道码';

-- ----------------------------
-- Table structure for wx_fission_customer
-- ----------------------------
DROP TABLE IF EXISTS `wx_fission_customer`;
CREATE TABLE `wx_fission_customer` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `task_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '任务id',
  `ext_invite_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '发出邀请的客户id',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '被邀请的客户id',
  `ext_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '被添加的员工id',
  `has_first` tinyint(1) NOT NULL COMMENT '是否是首次添加，1->是，0->不是',
  `has_deleted` tinyint(1) NOT NULL COMMENT '客户是否已删除员工',
  `price_detail_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '完成的wx_fission_task_customer_detail的id（一开始是领奖的id，后面需求变更）',
  `customer_deleted_at` datetime DEFAULT NULL COMMENT '客户删除员工时间',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企微应用宝-客户信息';

-- ----------------------------
-- Table structure for wx_fission_stage
-- ----------------------------
DROP TABLE IF EXISTS `wx_fission_stage`;
CREATE TABLE `wx_fission_stage` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公司id',
  `task_id` varchar(32) NOT NULL COMMENT '任务id',
  `stage` int NOT NULL COMMENT '阶段，从小到大',
  `num` int NOT NULL COMMENT '任务目标人数',
  `tags` json DEFAULT NULL COMMENT '任务达成标签',
  `ext_staff_ids` json NOT NULL COMMENT '领奖客服id集合',
  `config_id` varchar(32) NOT NULL COMMENT '领奖客服渠道活码id',
  `state` varchar(255) NOT NULL COMMENT '领奖客服渠道活码的state',
  `qr_code` text COMMENT '领奖客服渠道活码的请求路径',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企微应用宝-阶梯任务信息表';

-- ----------------------------
-- Table structure for wx_fission_task
-- ----------------------------
DROP TABLE IF EXISTS `wx_fission_task`;
CREATE TABLE `wx_fission_task` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '企业id',
  `name` varchar(20) NOT NULL COMMENT '活动名称限制字数20个字',
  `msg` json NOT NULL COMMENT '发送的消息',
  `status` tinyint(1) NOT NULL COMMENT '状态，0->未开始，1->进行中，2->已结束',
  `ext_staff_ids` json NOT NULL COMMENT '选择的企业员工',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `code_expired_time` datetime NOT NULL COMMENT '二维码失效时间',
  `code_expired_days` tinyint NOT NULL COMMENT '二维码失效天数',
  `has_check_delete` tinyint(1) NOT NULL COMMENT '删除员工后好友助力是否失效，1->失效，0->不失效',
  `tags` json DEFAULT NULL COMMENT '客户参加这个活动加进来被打上的标签',
  `poster_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '海报文件id，wx_temp_file的id',
  `has_head` tinyint(1) NOT NULL COMMENT '是否有用户头像',
  `has_name` tinyint(1) NOT NULL COMMENT '是否有用户名',
  `poster_size` json DEFAULT NULL COMMENT '海报尺寸',
  `head_pos` json DEFAULT NULL COMMENT '头像的xy坐标,长宽',
  `name_pos` json DEFAULT NULL COMMENT '昵称的xy坐标,长宽',
  `qr_code_pos` json NOT NULL COMMENT '二维码的xy坐标,长宽',
  `name_color` json DEFAULT NULL COMMENT '用户名的颜色rgb',
  `job_id` int DEFAULT NULL COMMENT 'xxl-job的id',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建人',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企微应用宝-裂变任务信息';

-- ----------------------------
-- Table structure for wx_fission_task_customer_detail
-- ----------------------------
DROP TABLE IF EXISTS `wx_fission_task_customer_detail`;
CREATE TABLE `wx_fission_task_customer_detail` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公司id',
  `task_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '任务id',
  `stage` tinyint(1) NOT NULL COMMENT '阶梯',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户id',
  `staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '发奖员工id',
  `has_finish` tinyint(1) NOT NULL COMMENT '是否完成该阶段任务',
  `has_prize` tinyint(1) NOT NULL COMMENT '是否已领奖',
  `prize_at` datetime DEFAULT NULL COMMENT '领奖时间',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企微应用宝-客户完成任务详情';

-- ----------------------------
-- Table structure for wx_group_chat
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat`;
CREATE TABLE `wx_group_chat` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_chat_id` char(32) DEFAULT NULL COMMENT '群聊id',
  `name` varchar(255) DEFAULT NULL COMMENT '群名字',
  `owner` char(64) DEFAULT NULL COMMENT '群主ExtID',
  `create_time` datetime(3) DEFAULT NULL COMMENT '创建时间',
  `notice` text COMMENT '群公告',
  `admin_list` json DEFAULT NULL COMMENT '群管理员列表',
  `status` int unsigned DEFAULT '2' COMMENT '群状态 1-解散 2-未解散',
  `total` int unsigned DEFAULT '0' COMMENT '群人数',
  `today_join_member_num` int unsigned DEFAULT '0' COMMENT '今日进群人数',
  `today_quit_member_num` int unsigned DEFAULT '0' COMMENT '今日退群人数',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `customer_num` int NOT NULL DEFAULT '0' COMMENT '客户总数',
  `owner_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群主昵称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_chat_del` (`ext_corp_id`,`ext_chat_id`,`has_delete`),
  KEY `idx_group_chat_ext_creator_id` (`ext_creator_id`),
  KEY `idx_group_chat_name` (`name`),
  KEY `idx_group_chat_owner` (`owner`),
  KEY `idx_group_chat_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群';

-- ----------------------------
-- Table structure for wx_group_chat_auto_join_code
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_auto_join_code`;
CREATE TABLE `wx_group_chat_auto_join_code` (
  `id` bigint NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `create_type` int DEFAULT NULL COMMENT '拉群方式，1-群二维码，2-企微活码',
  `group_id` bigint DEFAULT NULL,
  `remark` varchar(128) DEFAULT NULL,
  `auto_reply` text,
  `day_add_user_limit_enable` tinyint unsigned DEFAULT NULL,
  `backup_staff_ids` json DEFAULT NULL,
  `config_id` varchar(191) DEFAULT NULL COMMENT '自动拉群码配置ID',
  `qr_code` longtext COMMENT '联系二维码的URL',
  `skip_verify` tinyint unsigned DEFAULT '1' COMMENT '外部客户添加时是否无需验证，假布尔类型',
  `state` longtext COMMENT '企业自定义的state参数',
  `add_customer_count` bigint DEFAULT '0' COMMENT '扫码添加人次',
  `daily_add_customer_limit_enable` tinyint(1) DEFAULT NULL COMMENT '是否开启员工每日添加上限',
  `auto_tag_enable` tinyint(1) DEFAULT NULL COMMENT '''是否自动打标签''',
  `ext_tag_ids` json DEFAULT NULL COMMENT '''自动打标签绑定的标签ID数组''',
  `ext_staff_ids` json DEFAULT NULL COMMENT '''关联的外部员工ID''',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_group_id_remark` (`group_id`,`remark`),
  KEY `idx_group_chat_auto_join_code_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_auto_join_code_ext_creator_id` (`ext_creator_id`),
  KEY `idx_group_chat_auto_join_code_remark` (`remark`),
  KEY `idx_group_chat_auto_join_code_config_id` (`config_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for wx_group_chat_auto_join_code_staff
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_auto_join_code_staff`;
CREATE TABLE `wx_group_chat_auto_join_code_staff` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `group_chat_auto_join_code_id` bigint DEFAULT NULL COMMENT '''自动拉群码id''',
  `daily_add_customer_count` bigint DEFAULT '0' COMMENT '''员工每日添加客户计数''',
  `add_customer_count` bigint DEFAULT '0' COMMENT '''员工累计添加客户计数''',
  `daily_add_customer_limit` bigint DEFAULT NULL COMMENT '''员工每日添加客户上限''',
  `avatar` longtext COMMENT '''员工头像''',
  `staff_id` varchar(32) DEFAULT NULL COMMENT '''员工ID''',
  `ext_staff_id` varchar(191) DEFAULT NULL COMMENT '''外部员工ID''',
  `name` longtext COMMENT '''员工名称''',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_chat_auto_join_code_id` (`group_chat_auto_join_code_id`),
  UNIQUE KEY `staff_id` (`staff_id`),
  KEY `idx_group_chat_auto_join_code_staff_group_chat_auto_join_code_id` (`group_chat_auto_join_code_id`),
  KEY `idx_group_chat_auto_join_code_staff_ext_staff_id` (`ext_staff_id`),
  KEY `idx_group_chat_auto_join_code_staff_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_auto_join_code_staff_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for wx_group_chat_group
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_group`;
CREATE TABLE `wx_group_chat_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '分组名称',
  `is_default` int DEFAULT '2' COMMENT '''是否为默认分组，1：是；2：否''',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_group_chat_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_group_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊分组';

-- ----------------------------
-- Table structure for wx_group_chat_member
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_member`;
CREATE TABLE `wx_group_chat_member` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_chat_id` char(32) DEFAULT NULL COMMENT '群聊id',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群成员id',
  `type` int DEFAULT NULL COMMENT '群成员类型 1 - 企业成员 2 - 外部联系人',
  `join_time` bigint DEFAULT NULL COMMENT '入群时间',
  `join_scene` int DEFAULT NULL COMMENT '入群方式 1 - 由群成员邀请入群（直接邀请入群）2 - 由群成员邀请入群（通过邀请链接入群）3 - 通过扫描群二维码入群',
  `invitor` char(32) DEFAULT NULL COMMENT '邀请者。目前仅当是由本企业内部成员邀请入群时会返回该值',
  `union_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部联系人在微信开放平台的唯一身份标识（微信unionid）',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `name` varchar(255) DEFAULT NULL COMMENT '名字。仅当 need_name = 1 时返回,如果是微信用户，则返回其在微信中设置的名字,如果是企业微信联系人，则返回其设置对外展示的别名或实名',
  `group_nickname` varchar(255) DEFAULT NULL COMMENT '在群里的昵称',
  `quit_time` datetime DEFAULT NULL COMMENT '退群时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_chat_use_del` (`ext_corp_id`,`ext_chat_id`,`user_id`,`has_delete`),
  KEY `idx_group_chat_member_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_member_ext_creator_id` (`ext_creator_id`),
  KEY `idx_group_chat_member_ext_chat_id` (`ext_chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊成员';

-- ----------------------------
-- Table structure for wx_group_chat_qrcode
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_qrcode`;
CREATE TABLE `wx_group_chat_qrcode` (
  `group_chat_auto_join_id` varchar(32) DEFAULT NULL COMMENT '自动拉群码id',
  `order` int unsigned DEFAULT NULL COMMENT '排序',
  `qr_media_id` text COMMENT '群二维码pic media id',
  `qr_url` text COMMENT '群二维码的pic url',
  `user_limit` int unsigned DEFAULT NULL COMMENT '群二维码添加好友数上限',
  `status` int unsigned DEFAULT NULL COMMENT '群二维码状态,1- 使用中 2-已停用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊二维码';

-- ----------------------------
-- Table structure for wx_group_chat_statistics
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_statistics`;
CREATE TABLE `wx_group_chat_statistics` (
  `id` varchar(32) NOT NULL,
  `total` int NOT NULL DEFAULT '0' COMMENT '总人数',
  `customer_num` int NOT NULL DEFAULT '0' COMMENT '客户总数',
  `join_member_num` int NOT NULL DEFAULT '0' COMMENT '入群人数',
  `quit_member_num` int NOT NULL DEFAULT '0' COMMENT '退群人数',
  `active_member_num` int NOT NULL DEFAULT '0' COMMENT '活跃人数',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `ext_chat_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊id',
  `create_date` date NOT NULL COMMENT '创建日期',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信群聊统计信息';

-- ----------------------------
-- Table structure for wx_group_chat_tag
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_tag`;
CREATE TABLE `wx_group_chat_tag` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `group_chat_tag_group_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群聊标签组ID',
  `name` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群聊标签名称',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `order` bigint unsigned DEFAULT NULL COMMENT '标签排序值，值大的在前',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_chat_del` (`ext_corp_id`,`group_chat_tag_group_id`,`has_delete`,`name`) USING BTREE,
  KEY `idx_group_chat_tag_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_tag_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊标签';

-- ----------------------------
-- Table structure for wx_group_chat_tag_group
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_tag_group`;
CREATE TABLE `wx_group_chat_tag_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '名称',
  `order` bigint unsigned DEFAULT NULL COMMENT '标签排序值，值大的在前',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_name` (`ext_corp_id`,`name`,`has_delete`),
  KEY `idx_group_chat_tag_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_tag_group_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊标签组';

-- ----------------------------
-- Table structure for wx_group_chat_tag_map
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_tag_map`;
CREATE TABLE `wx_group_chat_tag_map` (
  `group_chat_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户群聊ID',
  `group_chat_tag_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊标签ID',
  PRIMARY KEY (`group_chat_id`,`group_chat_tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊-标签关联';

-- ----------------------------
-- Table structure for wx_group_chat_transfer_info
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_transfer_info`;
CREATE TABLE `wx_group_chat_transfer_info` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `group_chat_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊extId',
  `takeover_staff_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '接替群主extId',
  `handover_staff_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '原群主extId',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='微信群聊-离职继承详情';

-- ----------------------------
-- Table structure for wx_group_chat_welcome_msg
-- ----------------------------
DROP TABLE IF EXISTS `wx_group_chat_welcome_msg`;
CREATE TABLE `wx_group_chat_welcome_msg` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` char(32) DEFAULT NULL COMMENT '创建者外部员工ID',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '欢迎语',
  `attachment_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '附近类型',
  `attachment` json DEFAULT NULL COMMENT '附件',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_group_chat_welcome_msg_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_welcome_msg_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for wx_msg_group_template
-- ----------------------------
DROP TABLE IF EXISTS `wx_msg_group_template`;
CREATE TABLE `wx_msg_group_template` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者外部员工ID',
  `name` varchar(255) DEFAULT NULL COMMENT '任务名',
  `has_person` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是个人群发',
  `has_schedule` tinyint(1) NOT NULL COMMENT '是否定时发送，1->是，0->不是',
  `send_time` datetime NOT NULL COMMENT '发送时间',
  `msg` json NOT NULL COMMENT '消息内容',
  `has_all_staff` tinyint(1) NOT NULL COMMENT '是否全部群主：1->是，0->不是',
  `ext_staff_ids` json NOT NULL COMMENT '群主id',
  `status` tinyint(1) NOT NULL COMMENT '状态，0->待发送，1->发送成功，2->已取消，-1->发送失败，没有群',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_group_chat_mass_msg_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_mass_msg_ext_creator_id` (`creator_ext_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊-群发消息';

-- ----------------------------
-- Table structure for wx_msg_group_template_detail
-- ----------------------------
DROP TABLE IF EXISTS `wx_msg_group_template_detail`;
CREATE TABLE `wx_msg_group_template_detail` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `msg_template_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者外部员工ID',
  `ext_staff_id` varchar(32) NOT NULL COMMENT '员工id',
  `ext_chat_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊id',
  `send_status` tinyint(1) NOT NULL COMMENT '发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败''',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `ext_msg_id` varchar(50) DEFAULT NULL COMMENT '企业群发消息的id，可用于获取群发消息结果',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_group_chat_mass_msg_ext_corp_id` (`ext_corp_id`),
  KEY `idx_group_chat_mass_msg_ext_creator_id` (`msg_template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群聊-群发消息-详情';

-- ----------------------------
-- Table structure for wx_msg_template
-- ----------------------------
DROP TABLE IF EXISTS `wx_msg_template`;
CREATE TABLE `wx_msg_template` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `creator_ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者外部员工ID',
  `has_schedule` tinyint unsigned NOT NULL COMMENT '是否定时发送，1->是，0->不是（立即发送）',
  `send_time` datetime NOT NULL COMMENT '发送时间',
  `msg` json NOT NULL COMMENT '消息内容',
  `name` varchar(32) DEFAULT NULL COMMENT '群发名称',
  `has_person` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型，0：企业发表 1：个人发表',
  `has_all_staff` tinyint(1) NOT NULL COMMENT '是否全部员工',
  `staff_ids` json DEFAULT NULL COMMENT '选择的员工id集合',
  `has_all_customer` tinyint unsigned NOT NULL COMMENT '是否全部客户,1是，0否',
  `sex` tinyint(1) DEFAULT NULL COMMENT '筛选条件的性别，性别,0-未知 1-男性 2-女性',
  `chat_ids` json DEFAULT NULL COMMENT '筛选条件的群聊id',
  `add_start_time` datetime DEFAULT NULL COMMENT '筛选条件的添加开始时间',
  `add_end_time` datetime DEFAULT NULL COMMENT '筛选条件的添加结束时间',
  `choose_tag_type` tinyint(1) DEFAULT NULL COMMENT '筛选条件的选择标签，1->满足其一，2->全部满足，3->无任何标签',
  `choose_tags` json DEFAULT NULL COMMENT '选择的标签数组',
  `exclude_tags` json DEFAULT NULL COMMENT '排除在外的标签',
  `has_distinct` tinyint(1) DEFAULT NULL COMMENT '是否开启客户去重，1->开启，0->关闭',
  `status` tinyint(1) NOT NULL COMMENT '状态，0->待发送，1->发送成功，2->已取消，-1->创建失败，',
  `fail_msg` varchar(255) DEFAULT NULL COMMENT '失败的失败原因',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_mass_msg_ext_corp_id` (`ext_corp_id`),
  KEY `idx_mass_msg_ext_creator_id` (`creator_ext_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群发';

-- ----------------------------
-- Table structure for wx_msg_template_detail
-- ----------------------------
DROP TABLE IF EXISTS `wx_msg_template_detail`;
CREATE TABLE `wx_msg_template_detail` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `msg_template_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '微信群发id',
  `ext_staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '员工id',
  `ext_customer_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户id',
  `send_status` tinyint DEFAULT '2' COMMENT '发送状态：-1->失败，0->未发送 1->已发送 2->因客户不是好友导致发送失败 3->因客户已经收到其他群发消息导致发送失败',
  `fail_msg` varchar(255) DEFAULT NULL COMMENT '发送失败时的发送失败原因',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `ext_msg_id` varchar(50) DEFAULT NULL COMMENT '企业群发消息的id，可用于获取群发消息发送结果',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  PRIMARY KEY (`id`),
  KEY `idx_mass_msg_staff_mass_msg_id` (`msg_template_id`),
  KEY `idx_mass_msg_staff_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='客户群发，员工与客户关联表';

-- ----------------------------
-- Table structure for wx_resigned_staff_customer
-- ----------------------------
DROP TABLE IF EXISTS `wx_resigned_staff_customer`;
CREATE TABLE `wx_resigned_staff_customer` (
  `id` varchar(32) NOT NULL COMMENT '主键',
  `is_hand_over` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否移交',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `status` int NOT NULL COMMENT '接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录\r\n接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录',
  `takeover_time` datetime DEFAULT NULL COMMENT '接替客户的时间，如果是等待接替状态，则为未来的自动接替时间',
  `customer_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户ID',
  `takeover_staff_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '接替成员ID',
  `handover_staff_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '原添加成员ID',
  `dimission_time` timestamp NOT NULL COMMENT '成员离职时间',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '操作人用户ID',
  `create_time` timestamp NOT NULL COMMENT '创建时间',
  `allocate_time` timestamp NULL DEFAULT NULL COMMENT '分配时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `wx_resigned_staff_customer_index1` (`ext_corp_id`,`customer_ext_id`,`handover_staff_ext_id`,`dimission_time`) USING BTREE COMMENT '唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='离职员工-客户关联';

-- ----------------------------
-- Table structure for wx_resigned_staff_group_chat
-- ----------------------------
DROP TABLE IF EXISTS `wx_resigned_staff_group_chat`;
CREATE TABLE `wx_resigned_staff_group_chat` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业id',
  `handover_staff_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '原群主成员extId',
  `group_chat_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户群extId',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '操作人用户ID',
  `create_time` timestamp NOT NULL COMMENT '创建时间',
  `handover_staff_name` varchar(255) DEFAULT NULL COMMENT '原群主昵称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `wx_resigned_staff_group_chat_index1` (`ext_corp_id`,`handover_staff_ext_id`,`group_chat_ext_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='离职员工-群聊关联';

-- ----------------------------
-- Table structure for wx_staff
-- ----------------------------
DROP TABLE IF EXISTS `wx_staff`;
CREATE TABLE `wx_staff` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_id` char(32) DEFAULT NULL COMMENT '外部员工ID',
  `role_id` bigint DEFAULT NULL COMMENT '角色ID',
  `role_type` varchar(191) DEFAULT 'staff' COMMENT '''角色类型''',
  `name` varchar(255) DEFAULT NULL COMMENT '员工名',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `alias` varchar(255) DEFAULT NULL COMMENT '别名',
  `avatar_url` varchar(128) DEFAULT NULL COMMENT '头像地址',
  `email` varchar(128) DEFAULT NULL,
  `gender` tinyint DEFAULT NULL COMMENT '0表示未定义，1表示男性，2表示女性',
  `status` tinyint DEFAULT NULL COMMENT '激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号',
  `qr_code_url` varchar(255) DEFAULT NULL COMMENT '二维码',
  `telephone` char(32) DEFAULT NULL COMMENT '电话',
  `enable` tinyint unsigned DEFAULT NULL,
  `signature` char(128) DEFAULT NULL COMMENT '微信返回的内容签名',
  `external_position` longtext,
  `external_profile` longtext,
  `extattr` longtext,
  `customer_count` bigint DEFAULT NULL,
  `dept_ids` json DEFAULT NULL,
  `welcome_msg_id` bigint DEFAULT NULL,
  `is_authorized` tinyint unsigned DEFAULT NULL,
  `enable_msg_arch` tinyint unsigned DEFAULT '2',
  `is_admin` tinyint(1) DEFAULT '0' COMMENT '是否是管理员',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_ext_del` (`ext_corp_id`,`ext_id`,`has_delete`),
  KEY `idx_staff_role_type` (`role_type`),
  KEY `idx_staff_mobile` (`mobile`),
  KEY `idx_staff_welcome_msg_id` (`welcome_msg_id`),
  KEY `idx_staff_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='成员表';

-- ----------------------------
-- Table structure for wx_staff_20221107
-- ----------------------------
DROP TABLE IF EXISTS `wx_staff_20221107`;
CREATE TABLE `wx_staff_20221107` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_id` char(32) DEFAULT NULL COMMENT '外部员工ID',
  `role_id` bigint DEFAULT NULL COMMENT '角色ID',
  `role_type` varchar(191) DEFAULT 'staff' COMMENT '''角色类型''',
  `name` varchar(255) DEFAULT NULL COMMENT '员工名',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `alias` varchar(255) DEFAULT NULL COMMENT '别名',
  `avatar_url` varchar(128) DEFAULT NULL COMMENT '头像地址',
  `email` varchar(128) DEFAULT NULL,
  `gender` tinyint DEFAULT NULL COMMENT '0表示未定义，1表示男性，2表示女性',
  `status` tinyint DEFAULT NULL COMMENT '激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号',
  `qr_code_url` varchar(255) DEFAULT NULL COMMENT '二维码',
  `telephone` char(11) DEFAULT NULL COMMENT '电话',
  `enable` tinyint unsigned DEFAULT NULL,
  `signature` char(128) DEFAULT NULL COMMENT '微信返回的内容签名',
  `external_position` longtext,
  `external_profile` longtext,
  `extattr` longtext,
  `customer_count` bigint DEFAULT NULL,
  `dept_ids` json DEFAULT NULL,
  `welcome_msg_id` bigint DEFAULT NULL,
  `is_authorized` tinyint unsigned DEFAULT NULL,
  `enable_msg_arch` tinyint unsigned DEFAULT '2',
  `is_admin` tinyint(1) DEFAULT '0' COMMENT '是否是管理员',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_ext_del` (`ext_corp_id`,`ext_id`,`has_delete`),
  KEY `idx_staff_role_type` (`role_type`),
  KEY `idx_staff_mobile` (`mobile`),
  KEY `idx_staff_welcome_msg_id` (`welcome_msg_id`),
  KEY `idx_staff_ext_corp_id` (`ext_corp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='成员表';

-- ----------------------------
-- Table structure for wx_staff_department
-- ----------------------------
DROP TABLE IF EXISTS `wx_staff_department`;
CREATE TABLE `wx_staff_department` (
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业id',
  `ext_staff_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业成员id',
  `ext_department_id` int unsigned DEFAULT NULL COMMENT '企业部门id',
  `staff_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '成员id',
  `department_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '部门id',
  `is_leader` tinyint unsigned DEFAULT NULL COMMENT '是否是所在部门的领导 1表示为部门负责人，0表示非部门负责人',
  `order` int unsigned DEFAULT NULL COMMENT '所在部门的排序',
  PRIMARY KEY (`staff_id`,`department_id`),
  KEY `idx_staff_department_ext_corp_id` (`ext_corp_id`),
  KEY `idx_staff_department_ext_staff_id` (`ext_staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='成员-部门关联表';

-- ----------------------------
-- Table structure for wx_staff_resigned_transfer_statistics
-- ----------------------------
DROP TABLE IF EXISTS `wx_staff_resigned_transfer_statistics`;
CREATE TABLE `wx_staff_resigned_transfer_statistics` (
  `staff_id` varchar(32) NOT NULL COMMENT '员工主键',
  `resigned_time` datetime NOT NULL COMMENT '离职时间',
  `transfer_customer_num` int NOT NULL DEFAULT '0' COMMENT '已交接员工数量',
  `transfer_group_chat_num` int NOT NULL DEFAULT '0' COMMENT '已交接群聊数量',
  `wait_transfer_customer_num` int DEFAULT NULL COMMENT '待交接员工数量',
  `wait_transfer_group_chat_num` int DEFAULT NULL COMMENT '待交接群聊数量',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业id',
  `ext_staff_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '企业成员id',
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='员工离职继承统计';

-- ----------------------------
-- Table structure for wx_staff_transfer_info
-- ----------------------------
DROP TABLE IF EXISTS `wx_staff_transfer_info`;
CREATE TABLE `wx_staff_transfer_info` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '''ID''',
  `ext_corp_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `status` int NOT NULL COMMENT '接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录\r\n接替状态， 1-接替完毕 2-等待接替 3-客户拒绝 4-接替成员客户达到上限 5-无接替记录',
  `takeover_time` datetime DEFAULT NULL COMMENT '接替客户的时间，如果是等待接替状态，则为未来的自动接替时间',
  `customer_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户extId',
  `takeover_staff_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '接替成员extId',
  `handover_staff_ext_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '原添加成员extId',
  `create_time` timestamp NOT NULL COMMENT '创建时间',
  `creator` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '操作人用户ID',
  `type` int DEFAULT NULL COMMENT '类型：1:在职转接 2:离职继承',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='员工转接记录';

-- ----------------------------
-- Table structure for wx_tag
-- ----------------------------
DROP TABLE IF EXISTS `wx_tag`;
CREATE TABLE `wx_tag` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部企业ID',
  `ext_creator_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建者外部员工ID',
  `ext_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部标签ID',
  `ext_group_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '外部标签组ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '标签名称',
  `group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '标签组名称',
  `order` bigint unsigned DEFAULT NULL COMMENT '标签排序值，值大的在前',
  `type` int DEFAULT NULL COMMENT '所打标签类型, 1-企微后台设置, 2-第三方设置',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `group_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '标签组ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_corp_ext_del` (`ext_corp_id`,`ext_id`,`has_delete`),
  KEY `idx_tag_ext_corp_id` (`ext_corp_id`),
  KEY `idx_tag_ext_creator_id` (`ext_creator_id`),
  KEY `idx_tag_ext_group_id` (`ext_group_id`),
  KEY `idx_tag_order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信标签管理';

-- ----------------------------
-- Table structure for wx_tag_group
-- ----------------------------
DROP TABLE IF EXISTS `wx_tag_group`;
CREATE TABLE `wx_tag_group` (
  `id` varchar(32) NOT NULL COMMENT '''ID''',
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '外部企业ID',
  `ext_creator_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '创建者外部员工ID',
  `name` varchar(191) DEFAULT NULL COMMENT '组名字',
  `department_list` json DEFAULT NULL COMMENT '该标签组可用部门列表,默认0全部可用',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''创建时间''',
  `updated_at` datetime(3) DEFAULT NULL COMMENT '''更新时间''',
  `deleted_at` datetime(3) DEFAULT NULL COMMENT '''删除时间''',
  `has_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除，0->未删除，null->删除',
  `ext_id` varchar(32) DEFAULT NULL COMMENT '外部标签分组ID',
  `order` bigint DEFAULT NULL COMMENT '排序',
  `type` int DEFAULT NULL COMMENT '所打标签类型, 1-企微后台设置, 2-第三方设置',
  PRIMARY KEY (`id`),
  KEY `idx_tag_group_name` (`name`),
  KEY `idx_tag_group_ext_corp_id` (`ext_corp_id`),
  KEY `idx_tag_group_ext_creator_id` (`ext_creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='企业微信标签组管理';

-- ----------------------------
-- Table structure for wx_temp_file
-- ----------------------------
DROP TABLE IF EXISTS `wx_temp_file`;
CREATE TABLE `wx_temp_file` (
  `id` varchar(32) NOT NULL,
  `ext_corp_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公司id',
  `file_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文件路径，cos的key',
  `preview_path_list` json DEFAULT NULL COMMENT '文件预览路径',
  `file_name` varchar(255) NOT NULL COMMENT '初始文件名',
  `has_upload_to_wx` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否上传到wx，1->是，0->否',
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '类型： 图片（image）、语音（voice）、视频（video），普通文件(file)',
  `media_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'wx的id',
  `wx_created_at` datetime DEFAULT NULL COMMENT '最近一次传到wx的时间',
  `size` int DEFAULT NULL COMMENT '文件大小',
  `creator_ext_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='微信临时素材表';

SET FOREIGN_KEY_CHECKS = 1;

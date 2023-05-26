package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.WxTempFile;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/16 1:34
 * @description：微信发消息给客户的附件
 **/
@Data
@ApiModel("微信发消息给客户的附件")
public class WxMsgAttachmentDTO {

    @ApiModelProperty("图片->image  链接->link  小程序->miniprogram  轨迹素材->myLink  视频->video")
    private String type;

    @ApiModelProperty("标题")
    private String name;

    @ApiModelProperty("封面")
    private WxTempFile file;

    @ApiModelProperty("素材的id")
    private String mediaInfoId;

    @ApiModelProperty("链接地址")
    private String href;

    @ApiModelProperty("链接描述")
    private String info;

    @ApiModelProperty("小程序appID")
    private String appId;

    @ApiModelProperty("小程序路径")
    private String pathName;

    //图片
    public static final String PIC = "image";

    //链接
    public static final String LINK = "link";

    //小程序
    public static final String MINI = "miniprogram";

    //我们系统的轨迹素材
    public static final String MY_LINK = "myLink";

    //前端使用的视频类型
    public static final String VIDEO = "video";

    //前端使用的普通文件
    public static final String FILE = "file";
}

package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.entity.MediaTag;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2022-03-13
 */
@Data
@ApiModel(value = "（素材库）企业微信标签管理分页请求参数")
@Accessors(chain = true)
public class MediaTagPageDTO extends Page<MediaTag>{


}


package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.dto.CosFileTempSecretDTO;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/7/12 11:11
 * @description：文件预览VO
 **/
@Data
@Accessors(chain = true)
@ApiModel("文件预览VO")
public class WxFilePreviewVO extends CosFileTempSecretDTO {
    
    private List<String> previewPathList;
}

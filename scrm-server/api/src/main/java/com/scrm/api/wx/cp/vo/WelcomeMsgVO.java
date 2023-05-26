package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.dto.WxMsgDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.function.BiFunction;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/2 11:23
 * @description：欢迎语VO
 **/
@Data
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class WelcomeMsgVO {

    private Integer order;

    private BiFunction<String, String, Boolean> condition;

    private BiFunction<String, String, WxMsgDTO> msgDTO;
}

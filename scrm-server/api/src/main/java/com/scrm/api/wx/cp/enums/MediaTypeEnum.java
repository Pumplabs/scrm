package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/14 18:09
 * @description：素材库的素材类型
 **/
@Getter
@AllArgsConstructor
public enum MediaTypeEnum {

    POSTER(MediaTypeEnum.TYPE_COMMON, 1, "海报"),
    PIC(MediaTypeEnum.TYPE_COMMON, 2, "图片"),
    TEXT(MediaTypeEnum.TYPE_COMMON, 3, "文本"),
    APP(MediaTypeEnum.TYPE_COMMON, 4, "小程序"),
    ARTICLE(MediaTypeEnum.TYPE_PATH, 5, "文章"),
    VIDEO(MediaTypeEnum.TYPE_PATH, 6, "视频"),
    LINK(MediaTypeEnum.TYPE_PATH, 7, "链接"),
    FILE(MediaTypeEnum.TYPE_PATH, 8, "文件");

    private Integer type;

    private Integer code;

    private String name;

    // 普通素材
    public static final int TYPE_COMMON = 1;

    // 轨迹素材
    public static final int TYPE_PATH = 2;

    public static String getNameByCode(Integer code){
        for (MediaTypeEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.name;
            }
        }
        return null;
    }
}

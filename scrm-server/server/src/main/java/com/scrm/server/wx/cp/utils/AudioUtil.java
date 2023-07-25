/*
 * This file is part of the zyan/wework-msgaudit.
 *
 * (c) 读心印 <aa24615@qq.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */


package com.scrm.server.wx.cp.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AudioUtil {

    public static void toMp3(String sourcePath, String targetPath) {
        ExecUtils.exec(String.format("ffmpeg -i %s %s", sourcePath, targetPath));
    }

}

package com.scrm.common.util;

import com.scrm.common.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import java.io.*;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/26 15:28
 * @description：文件工具类
 **/
@Slf4j
public class FileUtils {

    /**
     * 创建文件，如果文件夹不存在，会把文件夹也创建了，如果文件不存在，会创建文件
     * @param path
     * @return
     */
    public synchronized static File createFile(String path){
        File file = new File(path);
        if (!file.getParentFile().exists() && !file.getParentFile().mkdirs()) {
            throw new BaseException("创建文件夹失败");
        }
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                log.error("创建文件失败，", e);
                throw new BaseException("创建文件失败");
            }
        }
        return file;
    }

    /**
     * 复制文件
     * @param source
     * @return
     */
    public synchronized static void copyFile(File source, File target){
        try (
                InputStream in = new FileInputStream(source);
                OutputStream out = new FileOutputStream(target);
                ){
            IOUtils.copy(in, out);
        }catch (IOException e){
            log.error("复制文件失败，", e);
            throw new BaseException("文件操作失败！");
        }
    }
}

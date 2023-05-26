package com.scrm.common.util;

import com.scrm.common.exception.BaseException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/9 19:50
 * @description：自己实现的文件上传类
 **/
@Data
@Slf4j
public class DataUploadMultipartFile implements MultipartFile {

    private String name;
    private String originalFilename;
    private String contentType;
    private byte[] content;

    public DataUploadMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
        this.name = name;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.content = content;
    }

    public DataUploadMultipartFile(String name, String originalFilename, String contentType, File file) throws IOException {
        this.name = name;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        try(InputStream in = new FileInputStream(file)){
            this.content = IOUtils.toByteArray(in);
        }catch (Exception e){
            log.error("生成MultipartFile文件失败。。。", e);
            throw new BaseException("生成MultipartFile文件失败");
        }

    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return originalFilename;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return content == null || content.length == 0;
    }

    @Override
    public long getSize() {
        return content.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return content;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(content);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        new FileOutputStream(dest).write(content);
    }

}

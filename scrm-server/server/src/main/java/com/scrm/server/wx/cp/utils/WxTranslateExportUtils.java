package com.scrm.server.wx.cp.utils;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import com.alibaba.fastjson.JSON;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.config.WxCpTpConfiguration;
import com.scrm.server.wx.cp.feign.CpTpFeign;
import com.scrm.server.wx.cp.feign.dto.TpIdGetResultRes;
import com.scrm.server.wx.cp.feign.dto.TpIdTranslateParams;
import com.scrm.server.wx.cp.feign.dto.TpIdTranslateRes;
import com.scrm.server.wx.cp.feign.dto.TpUploadFileRes;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpServiceImpl;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/9 20:15
 * @description：企微的导出翻译工具类
 **/
@Slf4j
public class WxTranslateExportUtils {

    /**
     * wx翻译通讯录的导出
     * @param filename
     * @param title
     * @param sheetName
     * @param clazz
     * @param data
     * @param <T>
     * @return
     */
    public static <T> String translate(String filename, String title, String sheetName, Class<T> clazz, List<T> data) {

        if (ListUtils.isEmpty(data)) {
            data = new ArrayList<>(1);
            //不知为什么，用一个空数据，后面ExcelExportUtil.exportExcel(params, clazz, data)会报空指针
            try {
                data.add(clazz.newInstance());
            } catch (InstantiationException | IllegalAccessException e) {
                log.error("通讯录导出转译通过反射实例化对象出错，[{}], ", clazz, e);
            }
        }

        ExportParams params = EasyPoiUtils.checkData(filename, title, sheetName);

        File tmpFile = FileUtils.createFile(ScrmConfig.getUploadPath() + filename + ".xls");
        try (Workbook workbook = ExcelExportUtil.exportExcel(params, clazz, data);
             OutputStream out = new FileOutputStream(tmpFile)) {

            workbook.write(out);
            MultipartFile multipartFile = new DataUploadMultipartFile(tmpFile.getName(),tmpFile.getName(),"MultipartFile",tmpFile);

            CpTpFeign cpTpFeign = SpringUtils.getBeanNew(CpTpFeign.class);
            WxCpTpConfiguration wxCpTpConfiguration = SpringUtils.getBeanNew(WxCpTpConfiguration.class);

            WxCpTpService tpService = new WxCpTpServiceImpl();
            tpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());

            //上传临时文件到企微
            TpUploadFileRes uploadRes = cpTpFeign.upload(multipartFile, tpService.getSuiteAccessToken(), "file");

            log.info("wx翻译通讯录的第一步结果是[{}]", JSON.toJSONString(uploadRes));

            uploadRes.checkNoZero();

            //开启id转译
            TpIdTranslateParams tpIdTranslateParams = new TpIdTranslateParams();
            tpIdTranslateParams.setAuth_corpid(JwtUtil.getExtCorpId())
                    .setMedia_id_list(Collections.singletonList(uploadRes.getMedia_id()));
            TpIdTranslateRes tpIdTranslateRes = cpTpFeign.idTranslate(tpIdTranslateParams, tpService.getSuiteAccessToken());

            log.info("wx翻译通讯录的第二步结果是[{}]", JSON.toJSONString(tpIdTranslateRes));

            tpIdTranslateRes.checkNoZero();

            //轮询拿结果，等10s
            long start = System.currentTimeMillis();
            while ((System.currentTimeMillis() - start) <= 10000){

                TpIdGetResultRes result = cpTpFeign.getResult(tpService.getSuiteAccessToken(), tpIdTranslateRes.getJobid());
                log.info("wx翻译通讯录的第三步结果是[{}]", JSON.toJSONString(result));
                result.checkNoZero();

                if (result.getStatus() == 3) {
                    return result.getResult().getJSONObject("contact_id_translate").getString("url");
                }else{
                    //未完成，继续等
                    Thread.sleep(200);
                }

            }
            throw new BaseException("导出文件翻译超时");
        } catch (Exception e) {
            log.error("wx翻译通讯录导出异常，参数=[{}], [{}], [{}], [{}], [{}], [{}]", filename, title, sheetName, clazz, JSON.toJSONString(data), JSON.toJSONString(params), e);
            throw new BaseException("导出文件异常");
        }
    }
}

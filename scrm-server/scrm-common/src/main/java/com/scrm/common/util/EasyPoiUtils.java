package com.scrm.common.util;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import com.scrm.common.exception.BaseException;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * excel工具类
 * @author xuxh
 * @date 2021-04-20
 */
public class EasyPoiUtils {


    public static <T> void export(String filename, String title, String sheetName, Class<T> clazz, List<T> data) {

        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        HttpServletResponse response = servletRequestAttributes.getResponse();

        ExportParams params = checkData(filename, title, sheetName);
        try (Workbook workbook = ExcelExportUtil.exportExcel(params, clazz, data)) {
            response(filename, workbook, response, request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException("导出文件异常");
        }
    }
    
    /**
     * 导入
     *
     * @param file 文件
     * @param titleRows  标题行号
     * @param headerRows 表头行号
     * @param pojoClass  映射类
     * @param <T>        封装实体类
     * @return 封装实体类列表
     * @author xuxh
     */
    public static <T> List<T> importExcel(MultipartFile file, Integer titleRows, Integer headerRows, Class<T> pojoClass) {
        if (file == null) {
            throw new BaseException("导入文件不能为空");
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        List<T> list;
        try {
            list = ExcelImportUtil.importExcel(file.getInputStream(), pojoClass, params);
        } catch (NoSuchElementException e) {
            throw new BaseException("excel文件不能为空");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException("导入文件异常：" + e.getMessage());
        }
        return list;
    }

    /**
     * 导出
     *
     * @param filename  必填，导出文件名，例如输入 a，导出a.xls
     * @param title     非必填，导出excel标题
     * @param sheetName 非必填，导出文件sheet名
     * @param clazz     必填，对应导出VO类
     * @param data      必填，导出数据
     * @param response  必填
     * @param request   必填，解决乱码
     */
    public static <T> void export(String filename, String title, String sheetName, Class<T> clazz, List<T> data, HttpServletResponse response, HttpServletRequest request) {
        ExportParams params = checkData(filename, title, sheetName);
        try (Workbook workbook = ExcelExportUtil.exportExcel(params, clazz, data)) {
            response(filename, workbook, response, request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException("导出文件异常");
        }
    }

    /**
     * 响应
     *
     * @param filename 文件名称
     * @param workbook Workbook
     * @param response response
     * @param request  request
     * @author xuxh
     * @date 2021/7/9 10:00
     */
    public static void response(String filename, Workbook workbook, HttpServletResponse response, HttpServletRequest request) {
        //解决火狐乱码,这里将编译异常转换成运行时异常，方便全局异常处理捕捉
        try (OutputStream out = response.getOutputStream()) {
            String userAgent = request.getHeader("User-Agent");
            if (userAgent.toLowerCase().contains("firefox")) {
                filename += ".xls";
                byte[] bytes = userAgent.contains("MSIE") ? filename.getBytes() : filename.getBytes("UTF-8");
                // 各浏览器基本都支持ISO编码
                filename = new String(bytes, "ISO-8859-1");
                // 文件名外的双引号处理firefox的空格截断问题
                response.setHeader("Content-disposition", String.format("attachment; filename*=utf-8'zh_cn'%s", filename));
                response.setHeader("Access-Control-Expose-Headers" , "Content-disposition");
            } else {
                response.setContentType("application/vnd.ms-excel;charset=utf-8");
                response.setHeader("Content-Disposition",
                        "attachment; filename=" + URLEncoder.encode(filename + ".xls", "UTF-8"));
                response.setHeader("Access-Control-Expose-Headers" , "Content-Disposition");
            }
            workbook.write(out);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BaseException("导出文件异常");
        }
    }


    /**
     * 校验文件 并设置标题和sheet名称
     * @author xuxh
     * @date 2021/7/9 10:02
     * @param filename 文件名称
     * @param title 标题
     * @param sheetName  sheet名称
     * @return cn.afterturn.easypoi.excel.entity.ExportParams
     */
    public static ExportParams checkData(String filename, String title, String sheetName) {
        if (StringUtils.isBlank(filename)) {
            throw new BaseException("导出文件名不能为空");
        }
        ExportParams params = new ExportParams();
        if (StringUtils.isNotBlank(title)) {
            params.setTitle(title);
        }
        if (StringUtils.isNotBlank(sheetName)) {
            params.setSheetName(sheetName);
        }
        return params;
    }


}
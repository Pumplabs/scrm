package com.scrm.common.util;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import cn.afterturn.easypoi.excel.entity.result.ExcelImportResult;
import com.google.common.base.Joiner;
import com.scrm.common.exception.BaseException;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.lang.reflect.Field;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * excel工具类
 *
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
     * @param file       文件
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
        params.setNeedVerify(true);
        ExcelImportResult<T> importResult;
        try {
            importResult = ExcelImportUtil.importExcelMore(file.getInputStream(), pojoClass, params);
            if (ListUtils.isEmpty(importResult.getFailList()) && ListUtils.isEmpty(importResult.getList())) {
                throw new BaseException("导入文件为空，请修改后重新导入");
            } else {
                List<T> failList = importResult.getFailList();
                List<String> listString = new ArrayList<>();
                if (ListUtils.isNotEmpty(failList)) {
                    //未通过校验
                    for (T entity : failList) {
                        int rowNum = (int) getFieldValue("rowNum", entity, entity.getClass());
                        String errorMsg = (String) getFieldValue("errorMsg", entity, entity.getClass());
                        String msg = "第" + (rowNum - headerRows) + "行：" + errorMsg + "\n";
                        listString.add(msg);
                    }
                    throw new BaseException(Joiner.on("").join(listString));
                }
            }
        } catch (NoSuchElementException e) {
            throw new BaseException("excel文件不能为空");
        } catch (Exception e) {
            throw new BaseException(e.getMessage() + "请修改后重新导入");
        }
        return importResult.getList();
    }

    public static Object getFieldValue(String filedName, Object o, Class clazz) {
        Field field = ReflectionUtils.findField(clazz, filedName);
        field.setAccessible(true);
        return ReflectionUtils.getField(field, o);
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
     * 模板导出
     */
    public static void exportModel(String filename, String templateUrl) {
        InputStream in = null;
        OutputStream out = null;
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        HttpServletResponse response = servletRequestAttributes.getResponse();
        try {
            ClassPathResource resource = new ClassPathResource(templateUrl);
            // class路径要放入模板文件地址
            in = resource.getInputStream();
            responseDeal(filename, request, response);
            out = response.getOutputStream();
            byte[] buffer = new byte[1024];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
        } catch (FileNotFoundException fe) {
            throw new BaseException("没有找到excel模板文件!");
        } catch (IOException e) {
            throw new BaseException("IO流异常!");
        } finally {
            // 关闭流
            try {
                if (in != null) {
                    in.close();
                }
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
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
            responseDeal(filename, request, response);
            workbook.write(out);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BaseException("导出文件异常");
        }
    }

    private static void responseDeal(String filename, HttpServletRequest request, HttpServletResponse response) throws IOException{
        String userAgent = request.getHeader("User-Agent");
        if (userAgent.toLowerCase().contains("firefox")) {
            filename += ".xls";
            byte[] bytes = userAgent.contains("MSIE") ? filename.getBytes() : filename.getBytes("UTF-8");
            // 各浏览器基本都支持ISO编码
            filename = new String(bytes, "ISO-8859-1");
            // 文件名外的双引号处理firefox的空格截断问题
            response.setHeader("Content-disposition", String.format("attachment; filename*=utf-8'zh_cn'%s", filename));
            response.setHeader("Access-Control-Expose-Headers", "Content-disposition");
        } else {
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-Disposition",
                    "attachment; filename=" + URLEncoder.encode(filename + ".xls", "UTF-8"));
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        }
    }


    /**
     * 校验文件 并设置标题和sheet名称
     *
     * @param filename  文件名称
     * @param title     标题
     * @param sheetName sheet名称
     * @return cn.afterturn.easypoi.excel.entity.ExportParams
     * @author xuxh
     * @date 2021/7/9 10:02
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
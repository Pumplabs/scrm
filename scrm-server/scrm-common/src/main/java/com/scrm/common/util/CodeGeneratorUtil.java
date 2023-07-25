package com.scrm.common.util;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.OracleTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;

/**
 * 默认模板代码生成
 *
 * @author xuxh
 * @date 2021/8/26 18:34
 */
public class CodeGeneratorUtil {


    //jdbc连接URL
    private static String url = "jdbc:mysql://121.37.15.30:3306/scrm_test?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8";

    //数据库账号
    private static String userName = "root";

    //数据库密码
    private static String password = "scrm1561";

    //jdbc驱动类
    private static String driverName = "com.mysql.cj.jdbc.Driver";

    //作者
    private static String author = "ouyang";

    //包路径
    private static String packageName = "com.scrm.server.wx.cp";

    //代码输出目标目录
    //private static String distPath = System.getProperty("user.dir") + "/scrm-server/server/src/main/java";
    private static String distPath = System.getProperty("user.dir") + "\\scrm-server\\server\\src\\main\\java";
    //数据库表名，如有多个使用英文字符逗号","进行分割 区分大小写
    private static String tableName = "br_customer_customized_field";

    //模板类型 default:默认 tree:树形
    private static String type = "default";


    public static void main(String[] args) {
        String templateName = StringUtils.isBlank(type) ? "src/main/resource/defaultTemplate" : type + "Template";
        generator(templateName, url, userName, password, driverName, author, packageName, distPath, File.separator + packageName.replaceAll("\\.", Matcher.quoteReplacement(File.separator)) + File.separator, tableName.split(","));
    }

    public static void generator(String templateName, String url, String userName, String password, String driverName, String author, String packageName, String distPath, String packagePath, String... tableName) {
        System.out.println("模板类型：" + templateName);
        System.out.println("目标路径：" + distPath);

        AutoGenerator mpg = new AutoGenerator();
        final GlobalConfig gc = new GlobalConfig();
        gc.setOutputDir(distPath);
        gc.setFileOverride(true);
        gc.setActiveRecord(true);
        gc.setEnableCache(false);
        gc.setBaseResultMap(true);
        gc.setBaseColumnList(true);
        gc.setDateType(DateType.ONLY_DATE);
        if (author == null || author.equals("")) {
            author = "未知";
        }

        gc.setAuthor(author);
        mpg.setGlobalConfig(gc);
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(getDbType(driverName));
        dsc.setTypeConvert(new OracleTypeConvert() {
            @Override
            public IColumnType processTypeConvert(GlobalConfig globalConfig, String fieldType) {
                //转换类型
                if ( fieldType.toLowerCase().contains( "tinyint" ) ) {
                    return DbColumnType.BOOLEAN;
                }
                if ( fieldType.toLowerCase().contains( "int" ) ) {
                    return DbColumnType.INTEGER;
                }
                if ( fieldType.toLowerCase().contains( "bigint" ) ) {
                    return DbColumnType.LONG;
                }
                if ( fieldType.toLowerCase().contains( "datetime" ) ) {
                    return DbColumnType.DATE;
                }
                return (DbColumnType) super.processTypeConvert(globalConfig, fieldType);
            }
        });
        dsc.setDriverName(driverName);
        dsc.setUsername(userName);
        dsc.setPassword(password);
        dsc.setUrl(url);
        mpg.setDataSource(dsc);



        StrategyConfig strategy = new StrategyConfig();
        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setInclude(tableName);
        mpg.setStrategy(strategy);
        PackageConfig pc = new PackageConfig();
        pc.setParent(packageName);
        pc.setController("web");
//        pc.setEntity("entity");
//        pc.setMapper("mapper");

        //controller不同包
//        HashMap<String, String> pathMap = new HashMap<>();
//        pathMap.put(ConstVal.CONTROLLER_PATH, distPath.replace("\\scrm-server\\", "\\scrm-web\\") + "\\com\\scrm\\web");
//        pathMap.put(ConstVal.ENTITY_PATH, distPath  + packagePath + "entity");
//        pathMap.put(ConstVal.MAPPER_PATH, distPath  + packagePath + "mapper");
//        pathMap.put(ConstVal.SERVICE_IMPL_PATH, distPath  + packagePath + "service\\impl");
//        pathMap.put(ConstVal.SERVICE_PATH, distPath  + packagePath + "service");
//        pathMap.put(ConstVal.XML_PATH, distPath  + packagePath + "mapper\\xml");
//
//        System.out.println(pathMap);

//        pc.setPathInfo(pathMap);
        mpg.setPackageInfo(pc);

        TemplateConfig tc = new TemplateConfig();
        tc.setController("/" + templateName + "/controller.java.vm");
        tc.setService("/" + templateName + "/service.java.vm");
        tc.setServiceImpl("/" + templateName + "/serviceImpl.java.vm");
        tc.setEntity("/" + templateName + "/entity.java.vm");
        tc.setMapper("/" + templateName + "/mapper.java.vm");

        mpg.setTemplate(tc);

        InjectionConfig cfg = new InjectionConfig() {
            public void initMap() {
                Map<String, Object> map = new HashMap<>();
                map.put("abc", this.getConfig().getGlobalConfig().getAuthor() + "-mp");
                this.setMap(map);
            }
        };
        mpg.setCfg(cfg);
        mpg.execute();

        for (TableInfo tableInfo : Optional.ofNullable(mpg.getConfig().getTableInfoList()).orElse(new ArrayList<>())) {
            String entityName = tableInfo.getEntityName();
            try {

                Map<String, String> map = new HashMap<>();
                String path = (distPath + packagePath).replaceAll("////", "/");
                String dtoBasePath = path + "/dto/" + entityName;
                map.put(templateName + "/entitySaveDTO.java.vm", dtoBasePath + "SaveDTO.java");
                map.put(templateName + "/entityPageDTO.java.vm", dtoBasePath + "PageDTO.java");
                map.put(templateName + "/entityUpdateDTO.java.vm", dtoBasePath + "UpdateDTO.java");
                map.put(templateName + "/entityVO.java.vm", path + "/vo/" + entityName + "VO.java");

                if ("defaultTemplate".equals(templateName)) {
                    map.put(templateName + "/entityQueryDTO.java.vm", dtoBasePath + "QueryDTO.java");
                } else if ("treeTemplate".equals(templateName)) {
                    map.put(templateName + "/entityTreeQueryDTO.java.vm", dtoBasePath + "TreeQueryDTO.java");
                    map.put(templateName + "/entityTreeVO.java.vm", path + "/vo/" + entityName + "TreeVO.java");
                }

                String finalAuthor = author;
                map.forEach((key, value) -> {
                    try {
                        buildTemplate(finalAuthor, packageName, tableInfo, key, value);
                    } catch (IOException e) {
                        e.printStackTrace();
                        System.err.println("代码生成异常！！");
                    }
                });

            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("代码生成异常！！");
            }

        }

        System.err.println("代码生成成功！！");
    }

    private static void buildTemplate(String author, String packageStr, TableInfo tableInfo, String templatePath, String destPath) throws IOException {

        destPath = destPath.replaceAll("\\\\", "/");
        File file = new File(destPath);
        if (file.exists()) {
            file.delete();
        }
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdir();
        }


        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dataStr = dateFormat.format(new Date());

        // 初始化模板引擎
        VelocityEngine velocityEngine = new VelocityEngine();
        velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        velocityEngine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        velocityEngine.init();


        // 设置变量
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("author", author);
        velocityContext.put("date", dataStr);
        velocityContext.put("package", packageStr);
        velocityContext.put("entity", tableInfo.getEntityName());
        velocityContext.put("table", tableInfo);


        // 获取模板文件
        Template template = velocityEngine.getTemplate(templatePath);

        // 输出渲染后的结果
        StringWriter stringWriter = new StringWriter();
        template.merge(velocityContext, stringWriter);


        try (BufferedWriter writer = new BufferedWriter(new FileWriter(destPath))) {
            writer.write(stringWriter.toString());
        }

    }

    private static DbType getDbType(String driverClassName) {
        if (driverClassName.contains("oracle")) {
            return DbType.ORACLE;
        } else if (driverClassName.contains("mysql")) {
            return DbType.MYSQL;
        } else if (driverClassName.contains("postgresql")) {
            return DbType.POSTGRE_SQL;
        } else {
            return driverClassName.contains("db2") ? DbType.DB2 : null;
        }
    }


}

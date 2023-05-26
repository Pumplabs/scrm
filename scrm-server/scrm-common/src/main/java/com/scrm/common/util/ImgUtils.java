package com.scrm.common.util;

import com.scrm.common.exception.BaseException;
import lombok.extern.slf4j.Slf4j;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.RenderedImage;
import java.awt.image.WritableRaster;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/18 19:27
 * @description：图片工具类
 **/
@Slf4j
public class ImgUtils {



    /**
     * 测试写字到图片上
     */
    public void addFont(File source, File target, int x, int y, String font, Color color){

        try (
                InputStream in = new FileInputStream(source);
                OutputStream out = new FileOutputStream(target);
                ){
            BufferedImage bufferImage1 = getBufferedImage(in);

            Graphics title = bufferImage1.createGraphics();

            title.fillRect(0, 0, 0, 0);

            title.setColor(color);
            //设置字体
            Font titleFont = new Font("宋体", Font.BOLD, 28);
            title.setFont(titleFont);
            title.drawString(font, x, y);

            // 输出水印图片
            imageIOWrite(bufferImage1, getImageType(source), out);
        } catch (IOException e) {
            log.error("生成图片失败，", e);
            throw new BaseException("生成图片失败");
        }
    }

    /**
     * @return 读取到的缓存图像
     * @throws IOException 路径错误或者不存在该文件时抛出IO异常
     */
    public static BufferedImage getBufferedImage(InputStream in)
            throws IOException {
        return imageIORead(in);
    }

    /**
     * 调整图片大小
     * @param fileName  文件名
     * @param in        文件输入流
     * @param out       返回的文件输出流
     * @param width     宽度
     * @param height    高度
     */
    public void reSize(File source, File targetFile, int width, int height){
        String type = getImageType(source);
        if (type == null) {
            return;
        }
        if (width < 0 || height < 0) {
            return;
        }

        BufferedImage srcImage = null;
        try {
            srcImage = imageIORead(source);
        } catch (IOException e) {
            log.error("图片读取失败，", e);
            throw new BaseException("生成图片失败");
        }
        if (srcImage != null) {
            // targetW，targetH分别表示目标长和宽
            BufferedImage target = null;
            double sx = (double) width / srcImage.getWidth();
            double sy = (double) height / srcImage.getHeight();

            ColorModel cm = srcImage.getColorModel();
            WritableRaster raster = cm.createCompatibleWritableRaster(width, height);
            boolean alphaPremultiplied = cm.isAlphaPremultiplied();

            target = new BufferedImage(cm, raster, alphaPremultiplied, null);
            Graphics2D g = target.createGraphics();
            // smoother than exlax:
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.drawRenderedImage(srcImage, AffineTransform.getScaleInstance(sx, sy));
            g.dispose();
            // 将转换后的图片保存
            try (
                    OutputStream out = new FileOutputStream(targetFile)
                    ){
                imageIOWrite(target, type, out);
            } catch (IOException e) {
                log.error("图片写入失败，", e);
                throw new BaseException("生成图片失败");
            }
        }
    }


    /**
     * Java 测试图片叠加方法
     */
    public void overlyingImage(File sourceFile, File overlayFile, File outFile, int x, int y) {

        try (
                InputStream source = new FileInputStream(sourceFile);
                InputStream overlay = new FileInputStream(overlayFile);
                OutputStream out = new FileOutputStream(outFile);
                ){
            BufferedImage bufferImage1 = getBufferedImage(source);
            BufferedImage bufferImage2 = getBufferedImage(overlay);

            // 构建叠加层
            BufferedImage buffImg = overlyingImage(bufferImage1, bufferImage2, x, y, 1.0f);
            // 输出水印图片
            imageIOWrite(buffImg, getImageType(sourceFile), out);
        } catch (IOException e) {
            log.error("生成图片失败,", e);
            throw new BaseException("生成图片失败");
        }

    }

    /**
     * 防止并发问题
     * @param file
     * @return
     * @throws IOException
     */
    private synchronized static BufferedImage imageIORead(File file) throws IOException {
        return ImageIO.read(file);
    }

    /**
     * 防止并发问题
     * @param in
     * @return
     * @throws IOException
     */
    private synchronized static BufferedImage imageIORead(InputStream in) throws IOException {
        return ImageIO.read(in);
    }

    /**
     * 防止并发问题
     * @return
     * @throws IOException
     */
    private synchronized static void imageIOWrite(RenderedImage im,
                                                           String formatName,
                                                           OutputStream output) throws IOException {
        ImageIO.write(im, formatName, output);
    }

    /**
     * 获取文件后缀不带.
     *
     * @param file 文件后缀名
     * @return
     */
    private static String getImageType(File file) {
        if (file != null && file.exists() && file.isFile()) {
            String fileName = file.getName();
            int index = fileName.lastIndexOf(".");
            if (index != -1 && index < fileName.length() - 1) {
                return fileName.substring(index + 1);
            }
        }
        return null;
    }

 

    /**
     *
     * @Title: 构造图片
     * @Description: 生成水印并返回java.awt.image.BufferedImage
     * @param buffImg 源文件(BufferedImage)
     * @param waterImg 水印文件(BufferedImage)
     * @param x 距离右下角的X偏移量
     * @param y  距离右下角的Y偏移量
     * @param alpha  透明度, 选择值从0.0~1.0: 完全透明~完全不透明
     * @return BufferedImage
     * @throws IOException
     */
    public static BufferedImage overlyingImage(BufferedImage buffImg, BufferedImage waterImg, int x, int y, float alpha) throws IOException {

        int buffImgWidth = buffImg.getWidth();// 获取层图的宽度
        int buffImgHeight = buffImg.getHeight();// 获取层图的高度

        // 创建Graphics2D对象，用在底图对象上绘图
        Graphics2D g2d = buffImg.createGraphics();
        int waterImgWidth = waterImg.getWidth();// 获取层图的宽度
        int waterImgHeight = waterImg.getHeight();// 获取层图的高度
        // 在图形和图像中实现混合和透明效果
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
        // 绘制
//        g2d.drawImage(waterImg, buffImgWidth - waterImgWidth, buffImgHeight - waterImgHeight, waterImgWidth, waterImgHeight, null);
        g2d.drawImage(waterImg, x, y, waterImgWidth, waterImgHeight, null);
        g2d.dispose();// 释放图形上下文使用的系统资源
        return buffImg;
    }

    /**
     * @param fileUrl 文件绝对路径或相对路径
     * @return 读取到的缓存图像
     * @throws IOException 路径错误或者不存在该文件时抛出IO异常
     */
    public static BufferedImage getBufferedImage(String fileUrl)
            throws IOException {
        File f = new File(fileUrl);
        return ImageIO.read(f);
    }

    /**
     * 远程图片转BufferedImage
     * @param destUrl    远程图片地址
     * @return
     */
    public static BufferedImage getBufferedImageDestUrl(String destUrl) {
        HttpURLConnection conn = null;
        BufferedImage image = null;
        try {
            URL url = new URL(destUrl);
            conn = (HttpURLConnection) url.openConnection();
            if (conn.getResponseCode() == 200) {
                image = ImageIO.read(conn.getInputStream());
                return image;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            conn.disconnect();
        }
        return image;
    }
}

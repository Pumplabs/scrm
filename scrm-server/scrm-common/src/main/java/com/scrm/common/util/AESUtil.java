package com.scrm.common.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class AESUtil {
    private static final String KEY = "f4k9f5w7f8g4er26";  // 密匙，必须16位
    private static final String OFFSET = "5e8y6w45ju8w9jq8"; // 偏移量
    private static final String ENCODING = "UTF-8"; // 编码
    private static final String ALGORITHM = "AES"; //算法
    private static final String CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding"; // 默认的加密算法，CBC模式

    /**
     * AES加密
     */
    public static String AESencrypt(String data) {
        try {
            if(StringUtils.isBlank(data)){
                return "";
            }
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            SecretKeySpec skeySpec = new SecretKeySpec(KEY.getBytes("ASCII"), ALGORITHM);
            IvParameterSpec iv = new IvParameterSpec(OFFSET.getBytes());//CBC模式偏移量IV
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(data.getBytes(ENCODING));
            return new Base64().encodeToString(encrypted);//加密后再使用BASE64做转码
        } catch (Exception e) {
            return data;
        }
    }

    /**
     * AES解密
     */
    public static String AESdecrypt(String data) {
        try {
            if(StringUtils.isBlank(data)){
                return "";
            }
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            SecretKeySpec skeySpec = new SecretKeySpec(KEY.getBytes("ASCII"), ALGORITHM);
            IvParameterSpec iv = new IvParameterSpec(OFFSET.getBytes()); //CBC模式偏移量IV
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            byte[] buffer = new Base64().decode(data);//先用base64解码
            byte[] encrypted = cipher.doFinal(buffer);
            return new String(encrypted, ENCODING);
        } catch (Exception e) {
            return data;
        }
    }


}

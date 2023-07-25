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
import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class RSAEncrypt {
    private static Map<Integer, String> keyMap = new HashMap<Integer, String>();  //用于封装随机产生的公钥与私钥
//    public static void main(String[] args) throws Exception {
//        //生成公钥和私钥
//        genKeyPair();
//        //加密字符串
//        String message = "df723820";
//        System.out.println("随机生成的公钥为:" + keyMap.get(0));
//        System.out.println("随机生成的私钥为:" + keyMap.get(1));
//        String messageEn = encrypt(message,keyMap.get(0));
//        System.out.println(message + "\t加密后的字符串为:" + messageEn);
//        String messageDe = decrypt(messageEn,keyMap.get(1));
//        System.out.println("还原后的字符串为:" + messageDe);
//    }

    /**
     * 随机生成密钥对
     * @throws NoSuchAlgorithmException
     */
    public static void genKeyPair() throws NoSuchAlgorithmException {
        // KeyPairGenerator类用于生成公钥和私钥对，基于RSA算法生成对象
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
        // 初始化密钥对生成器，密钥大小为96-1024位
        keyPairGen.initialize(1024,new SecureRandom());
        // 生成一个密钥对，保存在keyPair中
        KeyPair keyPair = keyPairGen.generateKeyPair();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();   // 得到私钥
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();  // 得到公钥
        String publicKeyString = new String(Base64.encodeBase64(publicKey.getEncoded()));
        // 得到私钥字符串
        String privateKeyString = new String(Base64.encodeBase64((privateKey.getEncoded())));
        // 将公钥和私钥保存到Map
        keyMap.put(0,publicKeyString);  //0表示公钥
        keyMap.put(1,privateKeyString);  //1表示私钥
    }
    /**
     * RSA公钥加密
     *
     * @param str
     *            加密字符串
     * @param publicKey
     *            公钥
     * @return 密文
     * @throws Exception
     *             加密过程中的异常信息
     */
    public static String encrypt( String str, String publicKey ) throws Exception{
        //base64编码的公钥
        byte[] decoded = Base64.decodeBase64(publicKey);
        RSAPublicKey pubKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
        //RSA加密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, pubKey);
        String outStr = Base64.encodeBase64String(cipher.doFinal(str.getBytes("UTF-8")));
        return outStr;
    }

    /**
     * RSA私钥解密
     *
     * @param str
     *            加密字符串
     * @param privateKey
     *            私钥
     * @return 铭文
     * @throws Exception
     *             解密过程中的异常信息
     */
    public static String decrypt(String str, String privateKey) throws Exception{
        //去头尾
        privateKey = privateKey.replaceAll("-----BEGIN PRIVATE KEY-----","").replaceAll("-----END PRIVATE KEY-----","");
        //64位解码加密后的字符串
        byte[] inputByte = Base64.decodeBase64(str.getBytes("UTF-8"));
        //base64编码的私钥
        byte[] decoded = Base64.decodeBase64(privateKey);
        RSAPrivateKey priKey = (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
        //RSA解密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, priKey);
        String outStr = new String(cipher.doFinal(inputByte));
        return outStr;
    }


    public static void main(String[] args) throws Exception {

        String str = "ufF29lJyUa9NWuMZ7/YZAQEfD/AtA/cdDHlVWxw4wpCVmCKRjZ/tPyeu7o5yDscgu4pEn1RlAzNlU+d/RS3Fbn4CCmMpJEwnamKJ8eh86KkSJRajbtah2OIzfBx/F/Rcytx6yfBi5b7+/Pe45p9s3h4izA9PrkSqnZzZzG2zlNKuiLBtgfE8XmN6JqTNBJT8Kn+9YXDQs8KG7cQUWTBDyAlSy7He9iAdAUrYDEMHZ0D1MTn0trrwh2egYAk+vsVkD2U5yTaUf/jhIxCRGUO4+X9dSeFovFCx0PEsXZ1EY7fVF2ZrWUN4JMMiV4Su+nKib4yHITKzON74Dj0dzaUYdw==\n";

        String p = "-----BEGIN PRIVATE KEY-----\n" +
                "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+Rcz7Xn2zMYAH\n" +
                "QdPpHauNSitl+pfBnMooIAkSeU0akDp4GVwpO0QpQi8XjUThar9WrIS7ez2vbuH7\n" +
                "Lq3aVq7nHyx7/CQqaqEy7ulRUyXHG1LF4Toof5Gv0xp9qdSMD9WYtwiybxOoY0bO\n" +
                "PJ+135GltN9twjh3W/CR/wxhg9N0SNzimKei49O3y5SNU4MHqSM6wOCc7rmj9lGb\n" +
                "3YuXgQMwA17lJ29zY9uvlnLF4+B6FpOtCfr/gPQ+7pbXnClKB9Z2wU01QNeNBCDU\n" +
                "VpsnBsDhLlrVKft9BR3ulRLUPD93KMqBJXB8xlGJgWn5KlFOIXXob3c2yLpGcFrr\n" +
                "8nyhM6+LAgMBAAECggEADrGLO9o3MNBgx66ws67j4ZxZr51jfMMj5Wdb6/5MEwIS\n" +
                "UdX7hP+bquf+hP4W1KWOsx3NfkDtKZARiXk4WcUZ6qVApS56iIAFhM5oXCxknXSh\n" +
                "tsBG4nu/f2l5AT1NOae7Yfi4hjcHuJg6DpEl8ECcmcRXAL3f6G/EKzIb/afVe4RG\n" +
                "uIvfUL4DlFNu+08nuGFVggOYSZeWG1JxKA2NBQ0e6fR836yj+EXwdY9f1nlIl0v8\n" +
                "L317XZBCIARQ/czrZBSzZNU/FuUwNnE3nDoLdare5DQNsiigsJxxTg4TuhEV9n6D\n" +
                "7dwr8AiHfdwEeY/+tk2f+MnVsT7TSv/em6coGiFeOQKBgQDxjfuIZuxIINIOTL5k\n" +
                "x8WfdTR2NG6Od7Jat6yLU8YUlg1ocxmurpzypj8aZXTD7mqn9kBo/MvZsiimCupz\n" +
                "IWNDbtX6viHeSkn7bKj8gMCoh6UDqTpBjEqZtw+1A7EGz05026a1G1KqMlABMxa4\n" +
                "5FIvOiO9gU9XyNUZ5IFlVwfZVQKBgQDJprr5EEwahRFVWgTNvr90bW2Let5ehOjX\n" +
                "Jp8dxkcMZBHXrtQOUQxF4aRc4uGTympxLZ+YBxObuYRImwa7UXVoNffE+lGm+yFv\n" +
                "B/4p3kCamNGHAyZ29N6jDBn9cmsmd5KWK9aN2IASDQNCwbPg7yEOAdFkRTRcyJzX\n" +
                "iY2H7F3lXwKBgDNT/kz/wdmZz8jmGdcEdEPr/dfYUF3JpYaNXQbGKGMbd4HoY16x\n" +
                "D/ynwuTzBhrUQKmsNAebIB4EM4sE6sjIIXWkyadcW4oGsy3P6yCso0Osfy4F+bEQ\n" +
                "BJIhSh8mx6kwx/Ug742wXqJ3ynRWzM9BBQ2wBwQvxBJdRJsZ6T0Ff095AoGBAKl1\n" +
                "71zNYFdNCnMC0lSg/z31lACKQgOGiDH+p+sarKxyEDiEGHrri3fSlxDkLZPIoEj6\n" +
                "gUr+b3EHp25osXCLlTH9YHntrt633rHzMpm2x+3jjPl8IUAIqmy1B8Zg+ED8bXi7\n" +
                "4HOVxJLm0p2wMN1PuCSQTIqKSeXLRVswonrenU3bAoGBAO3hycp8TydPtAHj8zIJ\n" +
                "4W+8fIiRC5SM4Q9JACiuKTHsu5OZEquMiTOtPdZph08mUPCsSapYy0zOH2foreL4\n" +
                "B2i4MfOodmHbQ72Ce6iNMaxHSsLOFplcTBacMr91ktepHyCWauW6gZp816kTVOgh\n" +
                "YTiFbsnc8W6t1aN/7HYmUSzV\n" +
                "-----END PRIVATE KEY-----";

        System.out.println(decrypt(str, p));

    }
}


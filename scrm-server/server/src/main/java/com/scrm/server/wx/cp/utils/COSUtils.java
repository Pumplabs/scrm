package com.scrm.server.wx.cp.utils;

import com.alibaba.fastjson.JSONObject;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.AnonymousCOSCredentials;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.exception.CosClientException;
import com.qcloud.cos.exception.CosServiceException;
import com.qcloud.cos.http.HttpProtocol;
import com.qcloud.cos.model.*;
import com.qcloud.cos.model.ciModel.common.MediaOutputObject;
import com.qcloud.cos.model.ciModel.job.*;
import com.qcloud.cos.model.ciModel.snapshot.SnapshotRequest;
import com.qcloud.cos.region.Region;
import com.scrm.api.wx.cp.dto.CosFileTempSecretDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DelayUtils;
import com.scrm.common.util.ListUtils;
import com.tencent.cloud.CosStsClient;
import com.tencent.cloud.Response;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.OutputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/12 15:41
 * @description：腾讯云的对象存储工具类
 **/
@Slf4j
@Component
public class COSUtils {

    @Value("${tq.cos.secretId}")
    private String secretId;

    @Value("${tq.cos.secretKey}")
    private String secretKey;

    @Value("${tq.cos.bucket}")
    private String bucket;

    @Value("${tq.cos.region}")
    private String region;

    @Value("${tq.cos.queueId}")
    private String queueId;
    
    private String PREVIEW_PRE = "preview/";

    private String PREVIEW_FIRST_SUB = "/@";

    private String PREVIEW_SECOND_SUB = "#";

    private String PREVIEW_THIRD_SUB = ".jpg";
    
    public CosFileTempSecretDTO getTempSecret(List<String> keys){
        TreeMap<String, Object> config = new TreeMap<String, Object>();

        int expiredSeconds = 1800;

        try {
            //这里的 SecretId 和 SecretKey 代表了用于申请临时密钥的永久身份（主账号、子账号等），子账号需要具有操作存储桶的权限。
            // 替换为您的云 api 密钥 SecretId
            config.put("secretId", secretId);
            // 替换为您的云 api 密钥 SecretKey
            config.put("secretKey", secretKey);

            // 设置域名:
            // 如果您使用了腾讯云 cvm，可以设置内部域名
            //config.put("host", "sts.internal.tencentcloudapi.com");

            // 临时密钥有效时长，单位是秒，默认 1800 秒，目前主账号最长 2 小时（即 7200 秒），子账号最长 36 小时（即 129600）秒
            config.put("durationSeconds", expiredSeconds);

            // 换成您的 bucket
            config.put("bucket", bucket);
            // 换成 bucket 所在地区
            config.put("region", region);

            String[] keyArray = new String[keys.size()];

            for (int i = 0; i < keys.size(); i++) {
                keyArray[i] = keys.get(i);
            }

            // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径
            // 列举几种典型的前缀授权场景：
            // 1、允许访问所有对象："*"
            // 2、允许访问指定的对象："a/a1.txt", "b/b1.txt"
            // 3、允许访问指定前缀的对象："a*", "a/*", "b/*"
            // 如果填写了“*”，将允许用户访问所有资源；除非业务需要，否则请按照最小权限原则授予用户相应的访问权限范围。
            config.put("allowPrefixes", keyArray);

            // 密钥的权限列表。必须在这里指定本次临时密钥所需要的权限。
            // 简单上传、表单上传和分块上传需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
            String[] allowActions = new String[] {
                    // 下载
                    "name/cos:GetObject"
            };
            config.put("allowActions", allowActions);

//            HttpsUtils.getTrust();
            Response response = CosStsClient.getCredential(config);

            Calendar time = Calendar.getInstance();
            long startTime = time.getTimeInMillis() / 1000;
            time.add(Calendar.SECOND, expiredSeconds);
            return new CosFileTempSecretDTO()
                    .setBucket(bucket)
                    .setRegion(region)
                    .setSessionToken(response.credentials.sessionToken)
                    .setTmpSecretId(response.credentials.tmpSecretId)
                    .setTmpSecretKey(response.credentials.tmpSecretKey)
                    .setStartTime(startTime)
                    .setExpiredTime(time.getTimeInMillis() / 1000);
        } catch (Exception e) {
            log.error("", e);
            throw new BaseException("no valid secret !");
        }
    }
    /**
     *
     * @param file 上传的文件
     * @param key 指定文件上传到 COS 上的路径，即对象键。例如对象键为folder/picture.jpg，则表示将文件 picture.jpg 上传到 folder 路径下
     * @return
     */
    public void upload(File file, String key){

        //存储桶没了，建一个
        if (!checkBucket()) {
            createBucket();
        }

        COSClient cosClient = getCosClient(region);

        PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, key, file);

        cosClient.putObject(putObjectRequest);

        cosClient.shutdown();
    }

    public String getObjectUrl(String key){

        // 不需要验证身份信息
        COSCredentials cred = new AnonymousCOSCredentials();

        // ClientConfig 中包含了后续请求 COS 的客户端设置：
        ClientConfig clientConfig = new ClientConfig();

        // 设置 bucket 的地域
        // COS_REGION 请参照 https://cloud.tencent.com/document/product/436/6224
        clientConfig.setRegion(new Region(region));

        // 设置生成的 url 的请求协议, http 或者 https
        // 5.6.53 及更低的版本，建议设置使用 https 协议
        // 5.6.54 及更高版本，默认使用了 https
        clientConfig.setHttpProtocol(HttpProtocol.https);

        // 生成cos客户端
        COSClient cosClient = new COSClient(cred, clientConfig);

        URL url = cosClient.getObjectUrl(bucket, key);

        return url.toString();
    }

    public void deleteFile(List<String> keys){

        if (ListUtils.isEmpty(keys)) {
            return;
        }

        //开始删除
        COSClient cosClient = getCosClient(region);

        try {

            //最多支持一次一千条,所以写了个递归
            deleteFile(cosClient, keys);

        }catch (Exception e){
            log.error("删除文件失败,", e);
        }finally {
            cosClient.shutdown();
        }
    }

    /**
     * 一次只能删一千条，所以写了个递归
     * @param cosClient
     * @param keys
     */
    private void deleteFile(COSClient cosClient, List<String> keys) {

        if (keys.size() > 1000) {
            deleteFile(cosClient, keys.subList(0, 1000));
            deleteFile(cosClient, keys.subList(1000, keys.size()));
            return;
        }

        DeleteObjectsRequest deleteObjectsRequest = new DeleteObjectsRequest(bucket);
        // 设置要删除的key列表, 最多一次删除1000个
        List<DeleteObjectsRequest.KeyVersion> keyList = keys.stream()
                .map(DeleteObjectsRequest.KeyVersion::new).collect(Collectors.toList());
        // 传入要删除的文件名
        deleteObjectsRequest.setKeys(keyList);

        DeleteObjectsResult deleteObjectsResult = cosClient.deleteObjects(deleteObjectsRequest);

    }

    /**
     * 下载文件
     * @param targetFile 下载文件到目标文件
     * @param key  文件在cos的key
     */
    public void download(File targetFile, String key){
        COSClient cosClient = getCosClient(region);

        GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, key);
        COSObjectInputStream cosObjectInput = null;

        // 处理下载到的流
        // 这里是直接读取，按实际情况来处理
        byte[] bytes = null;

        try{
            COSObject cosObject = cosClient.getObject(getObjectRequest);
            cosObjectInput = cosObject.getObjectContent();

            Files.copy(cosObjectInput, targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        } catch (Exception e) {
            log.error("文件下载失败，", e);
        }finally {

            try {
                if (cosObjectInput != null) {
                    cosObjectInput.close();
                }
                // 在流没有处理完之前，不能关闭 cosClient
                // 确认本进程不再使用 cosClient 实例之后，关闭之
                cosClient.shutdown();
            }catch (Exception e){
                log.error("下载文件，关闭流失败，", e);
            }

        }

    }

    /**
     * 下载文件
     * @param out 下载文件到目标文件
     * @param key  文件在cos的key
     */
    public void download(OutputStream out, String key){
        COSClient cosClient = getCosClient(region);

        GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, key);
        COSObjectInputStream cosObjectInput = null;

        // 处理下载到的流
        // 这里是直接读取，按实际情况来处理
        try{
            COSObject cosObject = cosClient.getObject(getObjectRequest);
            cosObjectInput = cosObject.getObjectContent();

            IOUtils.copy(cosObjectInput, out);

        } catch (Exception e) {
            log.error("文件下载失败，", e);
        }finally {

            try {
                if (cosObjectInput != null) {
                    cosObjectInput.close();
                }
                // 在流没有处理完之前，不能关闭 cosClient
                // 确认本进程不再使用 cosClient 实例之后，关闭之
                cosClient.shutdown();
            }catch (Exception e){
                log.error("下载文件，关闭流失败，", e);
            }

        }

    }

    private void createBucket() {

        COSClient cosClient = getCosClient(region);

        CreateBucketRequest createBucketRequest = new CreateBucketRequest(bucket);
// 设置 bucket 的权限为 Private(私有读写)、其他可选有 PublicRead（公有读私有写）、PublicReadWrite（公有读写）
        createBucketRequest.setCannedAcl(CannedAccessControlList.Private);
        try{
            cosClient.createBucket(createBucketRequest);
        } catch (CosClientException e) {
            log.error("创建存储桶失败，" , e);
            throw new BaseException("创建存储桶失败！");
        } finally {
            cosClient.shutdown();
        }

    }

    private COSClient getCosClient(String regionStr){

        COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);

        // 2 设置 bucket 的地域, COS 地域的简称请参照 https://cloud.tencent.com/document/product/436/6224
        // clientConfig 中包含了设置 region, https(默认 http), 超时, 代理等 set 方法, 使用可参见源码或者常见问题 Java SDK 部分。
        Region region = new Region(regionStr);
        ClientConfig clientConfig = new ClientConfig(region);
//        TODO 上线后换https，本地调试有证书问题，PKIX path building failed
        clientConfig.setHttpProtocol(HttpProtocol.https);

        return new COSClient(cred, clientConfig);

    }

    /**
     * 检查存储桶是否存在和是否有权限, TODO 这里还有问题，还要调
     * @return
     */
    private boolean checkBucket(){
//        COSClient cosClient = getCosClient("");
//        boolean res = cosClient.doesBucketExist(bucket);
//        cosClient.shutdown();
//        return res;
        return true;
    }

   

    /**
     * 文件预览
     * @param key
     * @return
     */
    public List<String> getPreviewPathList(String key) {
        //1.创建任务请求对象
        DocJobRequest request = new DocJobRequest();
        //2.添加请求参数 参数详情请见api接口文档
        request.setBucketName(bucket);
        DocJobObject docJobObject = request.getDocJobObject();
        docJobObject.setTag("DocProcess");
        docJobObject.getInput().setObject(key);
        docJobObject.setQueueId(queueId);
        DocProcessObject docProcessObject = docJobObject.getOperation().getDocProcessObject();
        docProcessObject.setQuality("100");
        docProcessObject.setZoom("100");
        docProcessObject.setTgtType("jpg");
        docProcessObject.setSheetId("0");
        MediaOutputObject output = docJobObject.getOperation().getOutput();
        output.setRegion(region);
        output.setBucket(bucket);
        output.setObject(PREVIEW_PRE + key + PREVIEW_FIRST_SUB + "${SheetID}" + PREVIEW_SECOND_SUB + "${Number}" + PREVIEW_THIRD_SUB);
        //3.调用接口,获取任务响应对象
        COSClient client = getCosClient(region);
        
        try {
            DocJobResponse docProcessJobs = client.createDocProcessJobs(request);
            String jobId = docProcessJobs.getJobsDetail().getJobId();
            //2.添加请求参数 参数详情请见api接口文档
            request.setJobId(jobId);
            //等10s
            long start = System.currentTimeMillis();
            while (System.currentTimeMillis() - start <= 10 * 1000){
                DelayUtils.delayMillisecond(100);
                DocJobResponse docJobResponse = client.describeDocProcessJob(request);
                DocJobDetail jobsDetail = docJobResponse.getJobsDetail();
                
                if (jobsDetail.getState().equals("Failed")) {
                    log.error("文档预览转码失败，[{}]", JSONObject.toJSONString(jobsDetail));
                    throw new BaseException("文档预览转码失败！");
                }
                //转码成功
                if (jobsDetail.getState().equals("Success")) {
                    List<String> result = getKeysByPre(client, PREVIEW_PRE + key + "/", null);
                    result.sort((o1, o2) -> {

                        String newO1 = o1.replace(key, "");
                        String newO2 = o2.replace(key, "");

                        int o1First = newO1.indexOf(PREVIEW_FIRST_SUB);
                        int o1Second = newO1.indexOf(PREVIEW_SECOND_SUB);
                        int o2First = newO2.indexOf(PREVIEW_FIRST_SUB);
                        int o2Second = newO2.indexOf(PREVIEW_SECOND_SUB);

                        //拿到${SheetID}
                        String o1FirstCompare = newO1.substring(o1First + PREVIEW_FIRST_SUB.length(), o1Second);
                        String o2FirstCompare = newO2.substring(o2First + PREVIEW_FIRST_SUB.length(), o2Second);

                        //${SheetID}不同就比${SheetID}
                        if (!o1FirstCompare.equals(o2FirstCompare)) {
                            return Integer.valueOf(o1FirstCompare).compareTo(Integer.valueOf(o2FirstCompare));
                        }

                        //${SheetID}一样，拿${Number}
                        int o1Third = newO1.indexOf(PREVIEW_THIRD_SUB);
                        int o2Third = newO2.indexOf(PREVIEW_THIRD_SUB);

                        //比${Number}
                        String o1SecondCompare = newO1.substring(o1Second + PREVIEW_SECOND_SUB.length(), o1Third);
                        String o2SecondCompare = newO2.substring(o2Second + PREVIEW_SECOND_SUB.length(), o2Third);
                        return Integer.valueOf(o1SecondCompare).compareTo(Integer.valueOf(o2SecondCompare));
                    });
                    return result;
                }
            }
            throw new BaseException("文档预览转码超时！");
        }catch (BaseException e){
            throw e;
        }catch (Exception e){
            log.error("文档预览转码异常", e);
            throw new BaseException("文档转码异常");
        }finally {
            client.shutdown();
        }
        
    }

    /**
     * 根据前缀找出对应的对象
     * @param client
     * @param pre
     * @param nextMarker
     * @return
     */
    private List<String> getKeysByPre(COSClient client, String pre, String nextMarker) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
        // 设置 bucket 名称
        listObjectsRequest.setBucketName(bucket);
        // 设置列出的对象名以 prefix 为前缀
        listObjectsRequest.setPrefix(pre);
        // 设置最大列出多少个对象, 一次 listobject 最大支持1000
        listObjectsRequest.setMaxKeys(1000);
        //起点
        listObjectsRequest.setMarker(nextMarker);

        // 保存列出的结果
        ObjectListing objectListing = client.listObjects(listObjectsRequest);
        
        List<String> result = new ArrayList<>();
        //结果
        objectListing.getObjectSummaries().forEach(e -> result.add(e.getKey()));

        if (objectListing.isTruncated()) {
            // 下一次开始的位置
            nextMarker = objectListing.getNextMarker();
            result.addAll(getKeysByPre(client, pre, nextMarker));
        }
        return result;
    }
    
    public void snapshot(String in, String out, Integer seconds){

        //1.创建截图请求对象
        SnapshotRequest request = new SnapshotRequest();
        //2.添加请求参数 参数详情请见api接口文档
        request.setBucketName(bucket);
        request.getInput().setObject(in);
        request.getOutput().setBucket(bucket);
        request.getOutput().setRegion(region);
        request.getOutput().setObject(out);
        request.setTime(seconds.toString());
        //3.调用接口,获取截图响应对象
        COSClient client = getCosClient(region);
        try {
            client.generateSnapshot(request);
        }catch (Exception e){
            log.error("[{}], [{}], [{}],视频截帧异常，", in, out, seconds, e);   
        }finally {
            client.shutdown();
        }
        
        
    }
}

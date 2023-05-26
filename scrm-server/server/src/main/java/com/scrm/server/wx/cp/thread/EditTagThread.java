package com.scrm.server.wx.cp.thread;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.dto.WxCustomerTagSaveOrUpdateDTO;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.WxErrorEnum;
import com.scrm.common.util.DelayUtils;
import com.scrm.common.util.SpringUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.entity.BrAsyncErrorInfo;
import com.scrm.server.wx.cp.service.IBrAsyncErrorInfoService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import lombok.Data;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/28 16:07
 * @description：打标签的线程
 **/
@Data
@Slf4j
@Accessors(chain = true)
public class EditTagThread extends Thread implements Comparable<EditTagThread> {

    private WxCustomerTagSaveOrUpdateDTO tagSaveOrUpdateDTO;

    private Boolean hasPriority;

    private Long createTime;

    private String threadId;

    private String status;

    private String failMsg;
    
    private Boolean hasFirst = true;

    @Override
    @Transactional
    public void run() {
        log.info("开始异步打标签[{}]", JSON.toJSONString(this));
        
        IWxCustomerService wxCustomerService = SpringUtils.getBeanNew(IWxCustomerService.class);
        

        try {
//            WxCpConfiguration.getExtCorpIdThread().set(tagSaveOrUpdateDTO.getExtCorpId());
            wxCustomerService.editTag(tagSaveOrUpdateDTO);
        } catch (WxErrorException e){
            if (hasFirst && Objects.equals(WxErrorEnum.CODE_45033.getCode(), e.getError().getErrorCode())) {
                log.error("频率超过限制，1min后重试...");
                DelayUtils.delaySeconds(60);
                EditTagThread newEditTagThread = new EditTagThread();
                BeanUtils.copyProperties(this, newEditTagThread);
                newEditTagThread.setHasFirst(false);
                ExecutorList.tagExecutorService.submit(newEditTagThread);
            }else{
                handleException(e);
            }
        }catch (Exception e) {
            handleException(e);
        }
    }
    
    private void handleException(Exception e){

        RedissonClient redissonClient = SpringUtils.getBeanNew(RedissonClient.class);
        IBrAsyncErrorInfoService asyncErrorInfoService = SpringUtils.getBeanNew(IBrAsyncErrorInfoService.class);
        
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw, true));
        String detailMsg = sw.toString();

        log.error("[{}]异步打标签失败, [{}]", JSON.toJSONString(tagSaveOrUpdateDTO), detailMsg);

        BrAsyncErrorInfo errorInfo = new BrAsyncErrorInfo()
                .setId(UUID.get32UUID())
                .setCreatedAt(new Date())
                .setExtCorpId(tagSaveOrUpdateDTO.getExtCorpId())
                .setType(BrAsyncErrorInfo.TYPE_EDIT_TAG)
                .setParams(JSON.toJSONString(tagSaveOrUpdateDTO))
                .setErrorMsg(detailMsg);
        asyncErrorInfoService.save(errorInfo);
        failMsg = e.getMessage();

        RBucket<String> bucket = redissonClient.getBucket(Constants.EDIT_TAG_REDIS_PRE + threadId);
        if (bucket != null) {
            String str = bucket.get();
            EditTagThread editTagThread = JSON.parseObject(str, EditTagThread.class);
            editTagThread.setStatus(FAIL);
            editTagThread.setFailMsg(failMsg);
            bucket.set(JSON.toJSONString(editTagThread), 1, TimeUnit.DAYS);
        }
    }

    @Override
    public int compareTo(EditTagThread o) {
        if (!Objects.equals(this.hasPriority, o.getHasPriority())) {
            if (this.hasPriority != null && this.hasPriority) {
                return -1;
            }else if (o.hasPriority != null && o.hasPriority){
                return 1;
            }
        }
        return (int) (this.createTime - o.getCreateTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EditTagThread that = (EditTagThread) o;
        return hasPriority.equals(that.hasPriority) &&
                createTime.equals(that.createTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hasPriority, createTime);
    }

    public static final String WAIT = "wait";

    public static final String SUCCESS = "success";

    public static final String FAIL = "fail";


}

package com.scrm.server.wx.cp.utils;

import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class ReportUtil {

    public static List<DailyTotalVO> composeResultToEchart(Integer days,List<DailyTotalVO> list){
        List<DailyTotalVO> totalList = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            DailyTotalVO dailyTotalVO = new DailyTotalVO();
            String dateStr = DateUtils.dateToSimpleStr(DateUtils.getDate(-i));
            dailyTotalVO.setDay(dateStr);
            log.info("dateStr {}",dateStr);
            for (DailyTotalVO o : list) {
                log.info("{},{}",o.getDay(),dateStr);
                if (o.getDay().equals(dateStr)) {
                    dailyTotalVO.setSaveTotal(o.getSaveTotal());
                    break;
                }
            }
            if(dailyTotalVO.getSaveTotal()==null){
                dailyTotalVO.setSaveTotal(0l);
            }
            totalList.add(dailyTotalVO);
        }
        return totalList;
    }
}

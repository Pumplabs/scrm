package com.scrm.api.wx.cp.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;


@Data
public class BrCorpSeeDTO {

    private Set<String> staffExtIds = new HashSet<>();

    private Set<Integer> deptExtIds = new HashSet<>();
}

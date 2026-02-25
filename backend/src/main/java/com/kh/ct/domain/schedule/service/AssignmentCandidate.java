package com.kh.ct.domain.schedule.service;

import lombok.Builder;
import lombok.Getter;

/**
 * PriorityQueue에서 사용할 배정 후보자
 * assignScore가 높은 순으로 정렬
 */
@Getter
@Builder
public class AssignmentCandidate implements Comparable<AssignmentCandidate> {
    private String empId;
    private EmployeeState employeeState;
    private double assignScore; // healthScore - penalties
    
    @Override
    public int compareTo(AssignmentCandidate other) {
        // 점수가 높은 순으로 정렬 (내림차순)
        return Double.compare(other.assignScore, this.assignScore);
    }
    
    /**
     * 점수 계산: healthScore - penalties
     */
    public static double calculateScore(EmployeeState state, double penalties) {
        int healthScore = state.getHealthScore() != null ? state.getHealthScore() : 50; // 기본값 50
        return healthScore - penalties;
    }
}

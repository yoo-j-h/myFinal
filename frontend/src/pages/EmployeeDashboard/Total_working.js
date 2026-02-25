// src/constants/attendanceConfig.js

export const ATTENDANCE_CONFIG = {
  PRESENT: { 
    label: '정상 출근', 
    color: '#27AE60', 
    description: '정해진 시간 내 출근하여 근무 중입니다.' 
  },
  LATE: { 
    label: '지각', 
    color: '#E74C3C', 
    description: '출근 시간이 기준보다 늦었습니다.' 
  },
  EARLY_LEAVE: { 
    label: '조퇴', 
    color: '#F39C12', 
    description: '근무 종료 시간 전 퇴근하였습니다.' 
  },
  HALF_DAY: { 
    label: '반차', 
    color: '#4A90E2', 
    description: '오전 또는 오후 반차를 사용하였습니다.' 
  },
  VACATION: { 
    label: '휴가', 
    color: '#9B59B6', 
    description: '연차/월차 등의 휴가 사용 중입니다.' 
  },
  ABSENT: { 
    label: '결근', 
    color: '#C0392B', 
    description: '출근 기록이 확인되지 않습니다.' 
  },
  DEFAULT: { 
    label: '출근 정보 없음', 
    color: '#95A5A6', 
    description: '오늘의 출결 데이터가 존재하지 않습니다.' 
  }
};

/**
 * 상태 키를 받아 해당 설정 객체를 반환하는 헬퍼 함수
 * 존재하지 않는 키일 경우 DEFAULT를 반환합니다.
 */
export const getAttendanceStatus = (status) => {
  return ATTENDANCE_CONFIG[status] || ATTENDANCE_CONFIG.DEFAULT;
};
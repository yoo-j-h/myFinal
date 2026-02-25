/**
 * 페이지 경로(Path)와 한글 타이틀 매핑
 * 
 * Usage:
 * - Header 컴포넌트에서 현재 경로를 기반으로 페이지 타이틀을 표시
 * - Breadcrumb(홈 > 페이지명) 자동 생성
 * 
 * Pattern Matching:
 * - Exact Match: 정확히 일치하는 경로
 * - StartsWith: 서브 경로를 포함하는 패턴
 */

export const PAGE_TITLES = {
    // ==================== 대시보드 ====================
    '/': '홈',
    '/dashboard': '대시보드',
    '/dashboard/admin': '관리자 대시보드',

    // ==================== 슈퍼 관리자 ====================
    '/super-admin-dashboard': '슈퍼 관리자 대시보드',
    '/super-admin/tenants': '항공사 관리',
    '/super-admin/registrations': '항공사 가입 신청 관리',
    '/super-admin/airline-approval': '항공사 승인 관리',

    // ==================== 게시판 ====================
    '/board': '게시판',
    '/qna': 'Q&A',

    // ==================== 인사 관리 ====================
    '/employee-list': '직원 목록',
    '/employee-schedule': '직원 스케줄',
    '/dept-manage': '부서 관리',

    // ==================== 일정 관리 ====================
    '/flightschedule': '비행 일정 관리',
    '/crew': '승무원 상세',

    // ==================== 근태 관리 ====================
    '/my-attendance': '내 근태 현황',
    '/admin-attendance': '관리자 근태 현황',
    '/staff-schedule-assignment': '직원 일정 배정',
    '/vacation': '휴가 신청',
    '/leave-apply': '휴가 신청',
    '/employee/leave-apply': '휴가 신청',
    '/protest-apply': '근태 정정 신청',
    '/my-application-history': '내 신청 현황',
    '/approval': '휴가 승인',
    '/protest-approval': '근태 정정 승인',

    // ==================== 건강 관리 ====================
    '/health-dashboard': '건강 대시보드',
    '/stress': '스트레스 설문',
    '/employeehealthmanagement': '직원 건강 관리',
    '/healthinfosubmission': '건강 정보 제출',
    '/healthsubmissionhistory': '건강 정보 제출 이력',
    '/healthprogrammanagement': '건강 프로그램 관리',
    '/healthprogramapply': '건강 프로그램 신청',

    // ==================== 시스템 관리 ====================
    '/common-code': '공통 코드 관리',
    '/settings': '설정',

    // ==================== 인증/계정 (Layout 없음) ====================
    '/login': '로그인',
    '/register': '회원가입',
    '/find-employee-id': '사원번호 찾기',
    '/find-password': '비밀번호 찾기',
    '/work-login': '근무 로그인',
    '/service-registration': '서비스 가입 신청',
    '/account-activation': '계정 활성화',
};

/**
 * 동적 경로 패턴 매핑 (파라미터가 포함된 경로)
 * 우선순위: DYNAMIC_PATTERNS > PAGE_TITLES
 */
export const DYNAMIC_PATTERNS = [
    { pattern: /^\/board\/detail\/\d+$/, title: '게시글 상세' },
    { pattern: /^\/board\/edit\/\d+$/, title: '게시글 수정' },
    { pattern: /^\/qna\/\d+$/, title: 'Q&A 상세' },
    { pattern: /^\/employee-list\/detail/, title: '직원 상세' },
    { pattern: /^\/dept-manage\/detail/, title: '부서 상세' },
    { pattern: /^\/flightschedule\/.+/, title: '비행 일정 상세' },
    { pattern: /^\/crew\/.+/, title: '승무원 상세' },
    { pattern: /^\/employeehealthdetail\/.+/, title: '직원 건강 상세' },
    { pattern: /^\/super-admin\/tenants\/.+/, title: '항공사 상세' },
];

/**
 * 경로에서 페이지 타이틀 추출
 * @param {string} pathname - 현재 경로
 * @returns {string} 페이지 타이틀
 */
export const getPageTitle = (pathname) => {
    // 경로 정규화 (끝의 슬래시 제거)
    const normalizedPath = pathname.endsWith('/') && pathname !== '/'
        ? pathname.slice(0, -1)
        : pathname;

    // 1. 정확한 매칭 우선
    if (PAGE_TITLES[normalizedPath]) {
        return PAGE_TITLES[normalizedPath];
    }

    // 2. 동적 패턴 매칭
    for (const { pattern, title } of DYNAMIC_PATTERNS) {
        if (pattern.test(normalizedPath)) {
            return title;
        }
    }

    // 3. StartsWith 방식 매칭 (서브 경로 포함)
    const matchedKey = Object.keys(PAGE_TITLES).find(key =>
        normalizedPath.startsWith(key) && key !== '/'
    );

    if (matchedKey) {
        return PAGE_TITLES[matchedKey];
    }

    // 4. 기본값
    return '페이지';
};

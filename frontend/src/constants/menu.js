import {
    Plane, Home, Users, Network, Clock, Calendar,
    ClipboardCheck, Activity, Leaf,
    Megaphone, FileText, Settings, List, Smile,
    Sun, Moon, Building2, UserCheck
} from 'lucide-react';

// =================================================================
// [1] 직원용 메뉴 구조 정의
// =================================================================
export const USER_MENU = [
    {
        category: "메인",
        items: [
            { label: "대시보드", icon: Home, id: "/dashboard" }
        ]
    },
    {
        category: "근태 관리",
        items: [
            { label: "내 근태 현황", icon: Calendar, id: "/my-attendance" },
            { label: "근태 정정 간편 신청", icon: FileText, id: "/protest-apply" },
            { label: "휴가 신청", icon: Plane, id: "/vacation" },
            { label: "내 신청 현황", icon: ClipboardCheck, id: "/my-application-history" }
        ]
    },
    {
        category: "일정 관리",
        items: [
            { label: "비행편 크루 관리", icon: Plane, id: "/flightschedule" }
        ]
    },
    {
        category: "건강 관리",
        items: [
            {
                label: "건강 현황",
                icon: Activity,
                id: "/health-dashboard",
                subItems: [
                    { label: "건강 정보 제출", id: "/healthinfosubmission" },
                    { label: "건강 정보 제출 이력", id: "/healthsubmissionhistory" },
                ],
            },
            { label: "스트레스 설문", icon: Smile, id: "/stress" },
            { label: "건강 프로그램 신청", icon: Leaf, id: "/healthprogramapply" },
            { label: "건강 프로그램 신청 내역", icon: List, id: "/health-program-history" }
        ]
    },
    {
        category: "기타",
        items: [
            { label: "게시판", icon: Megaphone, id: "/board" },
            { label: "Q&A", icon: FileText, id: "/qna" },
            { label: "설정", icon: Settings, id: "/settings" }
        ]
    }
];

// =================================================================
// [2] 관리자용 메뉴 구조 정의
// =================================================================
export const ADMIN_MENU = [
    {
        category: "메인",
        items: [
            { label: "대시보드", icon: Home, id: "/dashboard/admin" }
        ]
    },
    {
        category: "관리 목록",
        items: [
            {
                label: "직원 관리",
                icon: Users,
                id: "/employee-list",
                subItems: [
                    { label: "직원 목록", id: "/employee-list" },
                    { label: "직원 스케줄", id: "/employee-schedule" }
                ]
            },
            { label: "부서 관리", icon: Network, id: "/dept-manage" }
        ]
    },
    {
        category: "근태 관리",
        items: [
            { label: "직원 근태 현황", icon: Clock, id: "/admin-attendance" },
            { label: "휴가 승인 관리", icon: ClipboardCheck, id: "/approval" },
            { label: "근태 정정 승인", icon: FileText, id: "/protest-approval" }
        ]
    },
    {
        category: "일정 관리",
        items: [
            { label: "비행편 크루 관리", icon: Plane, id: "/flightschedule" },
            { label: "직원 일정 배정", icon: Calendar, id: "/staff-schedule-assignment" }
        ]
    },
    {
        category: "건강 관리",
        items: [
            { label: "직원 건강 관리", icon: Activity, id: "/employeehealthmanagement" },
            { label: "건강 프로그램 관리", icon: Leaf, id: "/healthprogrammanagement" }
        ]
    },
    {
        category: "시스템 관리",
        items: [
            { label: "공통 코드 관리", icon: List, id: "/common-code" }
        ]
    },
    {
        category: "기타",
        items: [
            { label: "게시판", icon: Megaphone, id: "/board" },
            { label: "Q&A", icon: FileText, id: "/qna" },
            { label: "설정", icon: Settings, id: "/settings" }
        ]
    }
];

// =================================================================
// [3] 슈퍼 관리자용 메뉴 구조 정의
// =================================================================
export const SUPER_ADMIN_MENU = [
    {
        category: "메인",
        items: [
            { label: "슈퍼 관리자 대시보드", icon: Home, id: "/super-admin-dashboard" }
        ]
    },
    {
        category: "테넌트 관리",
        items: [
            { label: "테넌트 목록", icon: Building2, id: "/super-admin/tenants" }
        ]
    },
    // {
    //     category: "승인 관리",
    //     items: [
    //         { label: "가입 신청 관리", icon: UserCheck, id: "/super-admin/registrations" },
    //         { label: "항공사 승인 관리", icon: ClipboardCheck, id: "/super-admin/airline-approval" }
    //     ]
    // },
    {
        category: "시스템 관리",
        items: [
            { label: "공통 코드 관리", icon: List, id: "/common-code" }
        ]
    },
    {
        category: "기타",
        items: [
            { label: "설정", icon: Settings, id: "/settings" }
        ]
    }
];

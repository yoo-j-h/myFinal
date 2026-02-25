import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { AirlineThemeProvider, useAirlineTheme } from './context/AirlineThemeContext';

// 페이지 컴포넌트 Import
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/login/login';
import Register from './pages/Register/Register';
import SelectId from './pages/SelectId/SelectId';
import SelectPwd from './pages/SelectPwd/SelectPwd';
import WorkLogin from './pages/WorkLogin/WorkLogin';
import Board from './pages/board/board';
import BoardDetail from './pages/boardDetail/boardDetail';
import BoardEdit from './pages/boardEdit/boardEdit';
import QnA from './pages/QnA/QnA';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import EmployeeManagement from './pages/EmployeeManagement/EmployeeManagement';
import EmployeeDetail from './pages/EmployeeDetail/EmployeeDetail';
import DepartmentManagement from './pages/DepartmentManagement/DepartmentManagement';
import DepartmentDetail from './pages/DepartmentDetail/DepartmentDetail';
import LeaveApply from './pages/EmployeeSchedule/LeaveApply';
import EmployeeSchedule from './pages/EmployeeSchedule/EmployeeSchedule';
import LeaveApproval from './pages/AdminAttendance/LeaveApproval';
import ProtestApproval from './pages/AdminAttendance/ProtestApproval';
import Dashboard from './pages/HealthDashboard/HealthDashboard';
import Stress from './pages/StressSurvey/StressSurvey';
import EmployeeHealthManagement from './pages/EmployeeHealthManagement/EmployeeHealthManagement';
import EmployeeHealthDetail from './pages/EmployeeHealthDetail/EmployeeHealthDetail';
import HealthInfoSubmission from './pages/HealthInfoSubmission/HealthInfoSubmission';
import HealthSubmissionHistory from './pages/HealthSubmissionHistory/HealthSubmissionHistory';
import HealthProgramManagement from './pages/HealthProgramManagement/HealthProgramManagement';
import HealthProgramApply from './pages/HealthProgramApply/HealthProgramApply.jsx';
import HealthProgramHistory from './pages/HealthProgramHistory/HealthProgramHistory.jsx';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound/NotFound';
import CommonCodeManagement from './pages/CommonCodeManagement/CommonCodeManagement';
import FlightSchedule from './pages/FlightSchedule/FlightSchedule.jsx';
import FlightScheduleDetail from './pages/FlightSchedule/FlightScheduleDetail.jsx';
import CrewMemberDetail from './pages/FlightSchedule/CrewMemberDetail.jsx';
import AdmDashboard from './pages/AdmDashboard/AdmDashboard.jsx';
import AirlineApprovalManagement from './pages/AirlineApprovalManagement/AirlineApprovalManagement.jsx';
import AccountActivation from './pages/AccountActivation/AccountActivation.jsx';
import ServiceRegistration from './pages/ServiceRegistration/ServiceRegistration.jsx';
import AdminAttendance from './pages/AdminAttendance/AdminAttendance.jsx';
import StaffScheduleAssignment from './pages/StaffScheduleAssignment/StaffScheduleAssignment.jsx';
import EmployeeAttendance from './pages/EmployeeAttendance/EmployeeAttendance.jsx';
import ProtestApply from './pages/ProtestApply/ProtestApply.jsx';
import MyApplicationHistory from './pages/MyApplicationHistory/MyApplicationHistory';
import TenantManagement from './pages/SuperAdmin/Tenant/TenantManagement.jsx';
import TenantDetail from './pages/SuperAdmin/Tenant/TenantDetail.jsx';
import CompanyRegistrationManagement from './pages/SuperAdmin/CompanyRegistrationManagement/CompanyRegistrationManagement.jsx';
import QnADetail from './pages/QnADetail/QnADetail.jsx';

// 레이아웃 컴포넌트 Import
import MainLayout from './layout/MainLayout';
import FindPassword from "./pages/SelectPwd/SelectPwd.jsx";
import ResetPassword from "./pages/SelectPwd/ResetPassword.jsx";
import ErrorBoundary from './components/ErrorBoundary';

// SuperAdminDashboard는 CompanyRegistrationManagement를 사용
const SuperAdminDashboard = CompanyRegistrationManagement;

// ThemeProvider 래퍼 컴포넌트
const ThemedApp = () => {
  const { theme } = useAirlineTheme();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>

        <Routes>
          {/* 1. 사이드바가 없는 페이지 (퍼블릭) */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-employee-id" element={<SelectId />} />
          <Route path="/work-login" element={<WorkLogin />} />

          {/* 항공사 가입 신청 및 계정 활성화 */}
          <Route path="/service-registration" element={<ServiceRegistration />} />
          <Route path="/account-activation" element={<AccountActivation />} />

          {/* 2. 사이드바/헤더/푸터가 있는 페이지 (MainLayout) */}
          <Route element={<MainLayout />}>
            {/* 기본 리다이렉트 */}
            <Route path="/dashboard" element={<EmployeeDashboard />} />

            {/* 관리자/슈퍼관리자 대시보드 */}
            <Route path="/dashboard/admin" element={<AdmDashboard />} />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />

            {/* [슈퍼 관리자 전용] */}
            <Route path="/super-admin/tenants" element={<TenantManagement />} />
            <Route path="/super-admin/tenants/:tenantId" element={<TenantDetail />} />
            <Route path="/super-admin/registrations" element={<CompanyRegistrationManagement />} />
            <Route path="/super-admin/airline-approval" element={<AirlineApprovalManagement />} />

            {/* [게시판] */}
            <Route path="/board" element={<Board />} />
            <Route path="/board/detail/:boardId" element={<BoardDetail />} />
            <Route path="/board/edit/:boardId" element={<BoardEdit />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/qna/:id" element={<QnADetail />} />
            {/* [인사 관리] */}
            <Route path="/employee-list" element={<EmployeeManagement />} />
            <Route path="/employee-list/detail" element={<EmployeeDetail />} />
            <Route path="/admin-attendance" element={<AdminAttendance />} />
            <Route path="/dept-manage" element={<DepartmentManagement />} />
            <Route path="/dept-manage/detail" element={<DepartmentDetail />} />

            {/* [일정 관리] */}
            <Route path="/flightschedule" element={<FlightSchedule />} />
            <Route path="/flightschedule/:flightId" element={<FlightScheduleDetail />} />
            <Route path="/crew/:crewId" element={<CrewMemberDetail />} />

            {/* [근태 관리] */}
            <Route path="/my-attendance" element={<EmployeeAttendance />} />
            <Route path="/employee-schedule" element={<EmployeeSchedule />} />
            <Route path="/admin-attendance" element={<AdminAttendance />} />
            <Route path="/staff-schedule-assignment" element={<StaffScheduleAssignment />} />
            <Route path="/vacation" element={<LeaveApply />} />
            <Route path="/leave-apply" element={<LeaveApply />} />
            <Route path="/employee/leave-apply" element={<LeaveApply />} />
            <Route path="/protest-apply" element={<ProtestApply />} />
            <Route path="/my-application-history" element={<MyApplicationHistory />} />
            <Route path="/approval" element={<LeaveApproval />} />
            <Route path="/protest-approval" element={<ProtestApproval />} />
            {/* [건강 관리] */}
            <Route path="/health-dashboard" element={<Dashboard />} />
            <Route path="/stress" element={<Stress />} />
            <Route path="/employeehealthmanagement" element={<EmployeeHealthManagement />} />
            <Route path="/employeehealthdetail/:empId" element={<EmployeeHealthDetail />} />
            <Route path="/healthinfosubmission" element={<HealthInfoSubmission />} />
            <Route path="/healthsubmissionhistory" element={<HealthSubmissionHistory />} />
            <Route path="/healthprogrammanagement" element={<HealthProgramManagement />} />
            <Route path="/healthprogramapply" element={<HealthProgramApply />} />
            <Route path="/health-program-history" element={<HealthProgramHistory />} />


            {/* [시스템 관리] */}
            <Route path="/common-code" element={<CommonCodeManagement />} />

            {/* [기타] */}
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AirlineThemeProvider>
        <ThemedApp />
      </AirlineThemeProvider>
    </BrowserRouter>
  );
}

export default App;
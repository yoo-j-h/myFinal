import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './EmployeeDetail.styled'; // 스타일 파일 import

const MOCK_EMPLOYEE_DATA = {
  basicInfo: {
    name: "김민수",
    id: "EMP-2024-0547",
    birth: "1985-05-12",
    dept: "객실 승무부",
    rank: "선임 승무원",
    hireDate: "2015-03-15",
    email: "minsu.kim@koreanair.com",
    phone: "010-1234-5678",
    address: "서울특별시 강서구 하늘길 260"
  },
  healthStatus: "정상",
  historyList: [
    {
      id: 1,
      type: "비행 이력",
      date: "2025-01-10",
      dept: "객실 승무부",
      rank: "선임 승무원",
      startDate: "2026-01-10",
      workDays: "362일",
      description: "비행 중 안전을 책임지는 항공기 안전요원 업무 수행"
    },
    {
      id: 2,
      type: "정비 이력",
      date: "2025-01-10",
      dept: "객실 승무부",
      rank: "선임 승무원",
      startDate: "2026-01-10",
      workDays: "362일",
      description: "비행 중 안전을 책임지는 항공기 안전요원 업무 수행"
    }
  ]
};

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { basicInfo, healthStatus, historyList } = MOCK_EMPLOYEE_DATA;

  return (
    <S.MainContainer>
      {/* 1. Page Header & Breadcrumb */}
      <S.PageHeader>
        <S.Breadcrumb>
          <span onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>홈</span> &gt; 
          <span onClick={() => navigate('/employee-list')} style={{cursor:'pointer'}}>직원 목록</span> &gt; 
          <span className="current">직원 상세 페이지</span>
        </S.Breadcrumb>
        <S.TitleGroup>
          <h2>직원 상세 정보</h2>
          <S.ActionButton $primary>정보 수정</S.ActionButton>
        </S.TitleGroup>
      </S.PageHeader>

      {/* 2. Main Profile Card */}
      <S.ProfileCard>
        <S.AvatarGroup>
          <div className="avatar-circle">{basicInfo.name.charAt(0)}</div>
          <div className="name-box">
            <h3>{basicInfo.name}</h3>
            <span className="rank">{basicInfo.rank}</span>
          </div>
        </S.AvatarGroup>

        <S.InfoGrid>
          <S.InfoItem>
            <label>사번</label>
            <p>{basicInfo.id}</p>
          </S.InfoItem>
          <S.InfoItem>
            <label>생년월일</label>
            <p>{basicInfo.birth}</p>
          </S.InfoItem>
          <S.InfoItem>
            <label>부서</label>
            <p>{basicInfo.dept}</p>
          </S.InfoItem>
          <S.InfoItem>
            <label>이메일</label>
            <p>{basicInfo.email}</p>
          </S.InfoItem>
          <S.InfoItem>
            <label>연락처</label>
            <p>{basicInfo.phone}</p>
          </S.InfoItem>
          <S.InfoItem>
            <label>입사일</label>
            <p>{basicInfo.hireDate}</p>
          </S.InfoItem>
          <S.InfoItem className="full-width">
            <label>주소</label>
            <p>{basicInfo.address}</p>
          </S.InfoItem>
        </S.InfoGrid>

        <S.StatusBadge $status="normal">
          <span className="label">건강 상태</span>
          <span className="value">{healthStatus}</span>
        </S.StatusBadge>
      </S.ProfileCard>

      {/* 3. Tab Navigation */}
      <S.TabNavigation>
        <button className="active">정보</button>
      </S.TabNavigation>

      {/* 4. History Section */}
      <S.HistorySection>
        {historyList.map((item) => (
          <S.HistoryCard key={item.id}>
            <div className="card-header">
              <div className="title-row">
                <span className="icon-placeholder">🔄</span> 
                <h4>{item.type}</h4>
              </div>
              <span className="date">{item.date}</span>
            </div>

            <div className="card-content">
              <div className="meta-grid">
                <S.InfoItem>
                  <label>부서</label>
                  <p>{item.dept}</p>
                </S.InfoItem>
                <S.InfoItem>
                  <label>직급</label>
                  <p>{item.rank}</p>
                </S.InfoItem>
                <S.InfoItem>
                  <label>입사일</label>
                  <p>{item.startDate}</p>
                </S.InfoItem>
                <S.InfoItem>
                  <label>근무일</label>
                  <p className="highlight">{item.workDays}</p>
                </S.InfoItem>
              </div>
              
              <div className="description-box">
                <label>업무</label>
                <p>{item.description}</p>
              </div>
            </div>
          </S.HistoryCard>
        ))}
      </S.HistorySection>

    </S.MainContainer>
  );
};

export default EmployeeDetail;
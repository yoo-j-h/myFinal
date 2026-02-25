import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MainContainer,
  BackButton,
  BannerSection,
  ContentWrapper,
  InfoCard,
  CardHeader,
  ActionGroup,
  StatsGrid,
  StatItem,
  TabNavigation,
  TabItem,
  TableSection,
  SectionHeader,
  TeamTable,
  TableHeader,
  TableRow,
  StatusBadge
} from './DepartmentDetail.styled';

const MOCK_DATA = {
  deptInfo: {
    name: "운항본부",
    engName: "Flight Operations Division",
    manager: "박지훈 전무",
    totalMembers: 320,
    location: "본사 A동 5층",
    phone: "02-1234-5678"
  },
  subTeams: [
    { id: 1, name: "운항기획팀", leader: "김영원 부장", count: 42, task: "운항 스케줄 관리 및 승무원 배치" },
    { id: 2, name: "운항기술팀", leader: "이민호 차장", count: 28, task: "운항 매뉴얼 관리 및 기술 지원" },
    { id: 3, name: "운항훈련팀", leader: "최수진 부장", count: 65, task: "조종사 시뮬레이터 훈련 및 교육" },
    { id: 4, name: "B777 비행대", leader: "성재용 기장", count: 110, task: "B777 기종 운항 승무원 관리" },
    { id: 5, name: "A380 비행대", leader: "강하늘 기장", count: 75, task: "A380 기종 운항 승무원 관리" },
  ]
};

// ❌ 기존: export const DepartmentDetail = () => { ... } 
// ✅ 수정: const DepartmentDetail = () => { ... } 로 변경하고 맨 밑에서 export default
const DepartmentDetail = () => {
  const navigate = useNavigate();
  const { deptInfo, subTeams } = MOCK_DATA;
  const [activeTab, setActiveTab] = useState('teams');

  return (
    <MainContainer>
      <BackButton onClick={() => navigate('/dept-manage')}>
        ← 부서 목록으로 돌아가기
      </BackButton>
      
      <BannerSection />

      <ContentWrapper>
        <InfoCard>
          <CardHeader>
            <div className="title-group">
              <div className="dept-icon" />
              <div>
                <h1>{deptInfo.name}</h1>
                <span className="eng-name">{deptInfo.engName}</span>
              </div>
            </div>
            <ActionGroup>
              <button className="secondary">정보 수정</button>
              <button className="primary">+ 팀원 배정</button>
            </ActionGroup>
          </CardHeader>

          <StatsGrid>
            <StatItem>
              <span className="label">본부장</span>
              <strong className="value">{deptInfo.manager}</strong>
            </StatItem>
            <StatItem>
              <span className="label">총 인원</span>
              <strong className="value">{deptInfo.totalMembers}명</strong>
            </StatItem>
            <StatItem>
              <span className="label">위치</span>
              <strong className="value">{deptInfo.location}</strong>
            </StatItem>
            <StatItem>
              <span className="label">대표 번호</span>
              <strong className="value">{deptInfo.phone}</strong>
            </StatItem>
          </StatsGrid>
        </InfoCard>

        <TabNavigation>
          <TabItem 
            $isActive={activeTab === 'teams'} 
            onClick={() => setActiveTab('teams')}
          >
            하위 조직 (Teams)
          </TabItem>
          <TabItem 
            $isActive={activeTab === 'members'} 
            onClick={() => setActiveTab('members')}
          >
            구성원 목록
          </TabItem>
          <TabItem 
            $isActive={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')}
          >
            예산 현황
          </TabItem>
        </TabNavigation>

        <TableSection>
          <SectionHeader>
            <h3>소속 팀 목록 ({subTeams.length}개)</h3>
            <button className="add-btn">+ 팀 추가</button>
          </SectionHeader>

          <TeamTable>
            <TableHeader>
              <div className="col-id">No</div>
              <div className="col-name">팀 명</div>
              <div className="col-leader">팀장</div>
              <div className="col-count">인원</div>
              <div className="col-task">주요 업무</div>
              <div className="col-action">관리</div>
            </TableHeader>
            
            {subTeams.map((team, index) => (
              <TableRow key={team.id}>
                <div className="col-id">{index + 1}</div>
                <div className="col-name">{team.name}</div>
                <div className="col-leader">{team.leader}</div>
                <div className="col-count">
                  <StatusBadge>{team.count}명</StatusBadge>
                </div>
                <div className="col-task">{team.task}</div>
                <div className="col-action">
                  <span className="link">상세</span>
                </div>
              </TableRow>
            ))}
          </TeamTable>
        </TableSection>

      </ContentWrapper>
    </MainContainer>
  );
};

export default DepartmentDetail; 
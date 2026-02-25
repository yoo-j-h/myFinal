import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import { 
  MainContainer, 
  PageHeader, 
  Breadcrumb, 
  TitleSection, 
  ActionBar, 
  SearchInputWrapper, 
  CreateButton,
  GridContainer,
  DepartmentCard,
  CardHeader,
  CardDescription,
  ManagerSection,
  StatsFooter
} from './DepartmentManagement.styled';

// TODO: Zustand Store에서 가져올 데이터 예시
const MOCK_DEPARTMENTS = [
  {
    id: 1,
    name: "운항본부",
    type: "OPERATIONS",
    description: "안전 운항을 위한 조종사 관리 및 운항 스케줄을 총괄합니다.",
    manager: { name: "박지훈 전무", role: "본부장" },
    stats: { totalMembers: 320, totalTeams: 5 }
  },
  {
    id: 2,
    name: "객실승무본부",
    type: "CABIN",
    description: "기내 안전 및 고객 서비스를 책임지는 핵심 본부입니다.",
    manager: { name: "이승준 상무", role: "본부장" },
    stats: { totalMembers: 540, totalTeams: 8 }
  },
  {
    id: 3,
    name: "정비본부",
    type: "MAINTENANCE",
    description: "항공기 정비, 부품 관리 및 기술 지원을 담당합니다.",
    manager: { name: "최민수 상무", role: "본부장" },
    stats: { totalMembers: 210, totalTeams: 4 }
  }
];

const getDepartmentIcon = (type) => {
  switch (type) {
    case 'CABIN': return '✈️';
    case 'MAINTENANCE': return '🔧';
    default: return '🟦';
  }
};

const DepartmentManagement = () => {
  const navigate = useNavigate(); // ✅ 훅 사용
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ 상세 페이지 이동 핸들러
  const handleCardClick = (id) => {
    navigate('/dept-manage/detail'); 
    // 실제 구현 시: navigate(`/dept-manage/detail/${id}`);
  };

  return (
    <MainContainer>
      <PageHeader>
        <TitleSection>
          <h2>부서 관리</h2>
          <p>조직 구조를 한눈에 파악하고 새로운 부서를 생성하거나 관리하세요.</p>
        </TitleSection>
      </PageHeader>

      <ActionBar>
        <SearchInputWrapper>
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="부서명 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>
        <CreateButton>+ 부서 생성</CreateButton>
      </ActionBar>

      <GridContainer>
        {MOCK_DEPARTMENTS.map((dept) => (
          <DepartmentCard 
            key={dept.id} 
            $type={dept.type}
            onClick={() => handleCardClick(dept.id)} // ✅ 클릭 이벤트 연결
          >
            <CardHeader>
              <div className="icon-box">{getDepartmentIcon(dept.type)}</div>
              <h3>{dept.name}</h3>
            </CardHeader>

            <CardDescription>{dept.description}</CardDescription>

            <ManagerSection>
              <div className="avatar">{dept.manager.name.charAt(0)}</div>
              <div className="info">
                <span className="role">{dept.manager.role}</span>
                <span className="name">{dept.manager.name}</span>
              </div>
            </ManagerSection>

            <StatsFooter>
              <div className="stat-item">
                <span className="icon">👥</span>
                <span>{dept.stats.totalMembers}명</span>
              </div>
              <div className="stat-item">
                <span className="icon">🏢</span>
                <span>총 {dept.stats.totalTeams}개 팀</span>
              </div>
            </StatsFooter>
          </DepartmentCard>
        ))}
      </GridContainer>
    </MainContainer>
  );
};

export default DepartmentManagement;
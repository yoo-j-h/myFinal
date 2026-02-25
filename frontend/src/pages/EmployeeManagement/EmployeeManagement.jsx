import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import * as S from './EmployeeManagement.styled';
import { Search, Plus, MoreHorizontal, Phone } from 'lucide-react';

const EmployeeManagement = () => {
  const navigate = useNavigate(); // ✅ 훅 사용
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('전체');

  // 부서 목록
  const departments = ['전체', '인사팀', '운항팀', '객실승무팀', '정비팀', 'IT지원팀'];

  // 직원 목록 데이터 (임시)
  const employees = [
    {
      id: '2024001',
      name: '김민수',
      position: '대리',
      department: '인사팀',
      email: 'ms.kim@skyhr.com',
      phone: '010-1234-5678',
      status: '재직',
      joinDate: '2024-01-15',
      profileColor: '#4A90E2'
    },
    {
      id: '2023045',
      name: '이영희',
      position: '과장',
      department: '객실승무팀',
      email: 'yh.lee@skyhr.com',
      phone: '010-2345-6789',
      status: '휴직',
      joinDate: '2023-03-01',
      profileColor: '#F57C00'
    },
    {
      id: '2022102',
      name: '박상수',
      position: '사원',
      department: '운항팀',
      email: 'ss.park@skyhr.com',
      phone: '010-3456-7890',
      status: '재직',
      joinDate: '2022-11-20',
      profileColor: '#27AE60'
    },
    {
      id: '2021056',
      name: '최지영',
      position: '팀장',
      department: 'IT지원팀',
      email: 'jy.choi@skyhr.com',
      phone: '010-4567-8901',
      status: '재직',
      joinDate: '2021-05-10',
      profileColor: '#8E44AD'
    },
    {
      id: '2024022',
      name: '정우성',
      position: '사원',
      department: '정비팀',
      email: 'ws.jung@skyhr.com',
      phone: '010-5678-9012',
      status: '퇴직',
      joinDate: '2024-02-01',
      profileColor: '#E74C3C'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  // ✅ 직원 클릭 시 상세 페이지로 이동
  const handleRowClick = (id) => {
    navigate('/employee-list/detail');
    // 실제로는 navigate(`/employee-list/detail/${id}`) 처럼 ID를 함께 넘겨야 합니다.
  };

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        <S.PageHeader>
          <S.HeaderLeft>
            <S.PageTitle>직원 관리</S.PageTitle>
            <S.EmployeeCount>총 {employees.length}명</S.EmployeeCount>
          </S.HeaderLeft>
          <S.AddButton>
            <Plus size={20} />
            직원 등록
          </S.AddButton>
        </S.PageHeader>

        {/* 검색 및 필터 영역 */}
        <S.FilterSection>
          <S.SearchForm onSubmit={handleSearch}>
            <Search size={20} color="#999" />
            <S.SearchInput
              placeholder="이름, 사번, 부서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </S.SearchForm>

          <S.FilterGroup>
            {departments.map(dept => (
              <S.FilterButton
                key={dept}
                $active={selectedDept === dept}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </S.FilterButton>
            ))}
          </S.FilterGroup>
        </S.FilterSection>

        {/* 직원 목록 테이블 */}
        <S.TableContainer>
          <S.Table>
            <thead>
              <tr>
                <S.Th>프로필</S.Th>
                <S.Th>사번</S.Th>
                <S.Th>이름</S.Th>
                <S.Th>부서</S.Th>
                <S.Th>직급</S.Th>
                <S.Th>연락처</S.Th>
                <S.Th>상태</S.Th>
                <S.Th>입사일</S.Th>
                <S.Th width="50px"></S.Th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <S.Tr
                  key={emp.id}
                  onClick={() => handleRowClick(emp.id)} // ✅ 클릭 이벤트 추가
                  style={{ cursor: 'pointer' }} // 커서 모양 변경
                >
                  <S.Td>
                    <S.ProfileImage color={emp.profileColor}>
                      {emp.name.charAt(0)}
                    </S.ProfileImage>
                  </S.Td>
                  <S.Td>{emp.id}</S.Td>
                  <S.Td>
                    <S.NameInfo>
                      <S.Name>{emp.name}</S.Name>
                      <S.Email>{emp.email}</S.Email>
                    </S.NameInfo>
                  </S.Td>
                  <S.Td>
                    <S.DepartmentBadge>{emp.department}</S.DepartmentBadge>
                  </S.Td>
                  <S.Td>{emp.position}</S.Td>
                  <S.Td>
                    <S.ContactInfo>
                      <Phone size={14} /> {emp.phone}
                    </S.ContactInfo>
                  </S.Td>
                  <S.Td>
                    <S.StatusBadge $status={emp.status}>
                      {emp.status}
                    </S.StatusBadge>
                  </S.Td>
                  <S.Td>{emp.joinDate}</S.Td>
                  <S.Td>
                    <S.MoreButton onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal size={20} />
                    </S.MoreButton>
                  </S.Td>
                </S.Tr>
              ))}
            </tbody>
          </S.Table>
        </S.TableContainer>

        <S.Pagination>
          <S.PaginationButton disabled>‹</S.PaginationButton>
          <S.PageNumber $active={true}>1</S.PageNumber>
          <S.PageNumber>2</S.PageNumber>
          <S.PageNumber>3</S.PageNumber>
          <S.PaginationButton>›</S.PaginationButton>
        </S.Pagination>

      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default EmployeeManagement;
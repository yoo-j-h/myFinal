import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ActionButton,
  SearchSection,
  SearchInputWrapper,
  SearchIcon,
  SearchInput,
  FilterGroup,
  FilterButton,
  FilterDivider,
  EmployeeCount,
  FilterToggle,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  EmployeeInfo,
  EmployeeAvatar,
  EmployeeDetails,
  EmployeeName,
  EmployeeId,
  DepartmentInfo,
  DepartmentName,
  DepartmentRole,
  DateText,
  StatusBadge,
  IconButton
} from './EmployeeHealthManagement.styled';
import { empPhysicalTestService } from '../../api/Health/healthService';
import { PageNumber, Pagination, PaginationButton } from '../../styles/GlobalStyle';

const formatDate = (iso) => {
  if (!iso) return "-";
  return String(iso).slice(0, 10);
};

const getStatusByHealthPoint = (hp) => {
  // 기준 확정 전 임시(원하면 값 조정)
  if (hp == null) return { label: "-", type: "alert" };
  if (hp >= 80) return { label: "정상", type: "normal" };
  if (hp >= 60) return { label: "주의", type: "warning" };
  return { label: "결과", type: "alert" };
};


const EmployeeHealthManagement = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('전체');

  // 검색(이름만)
  const [empName, setEmpName] = useState("");
  // 페이지 데이터
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const [items, setItems] = useState([]);

  const [totalSubmissions, setTotalSubmissions] = useState(0);
  // 페이징 관련
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);


  const size = 5;

  const fetchList = async (nextPage = 0, name = empName) => {
    console.log(name)
    try {
      const res = await empPhysicalTestService.getAllPhysicalTest({
        empName: name,
        page: nextPage,
        size,
      });

      const data = res.data;
      setRows(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setCurrentPage(data.number ?? nextPage);
    } catch (e) {
      console.error(e);
      alert("직원 건강 목록 조회 실패");
    }
  };

  useEffect(() => {
    fetchList(0, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetailClick = (empId) => {
    // 상세 화면에서 empId로 다시 조회하는 방식 추천
    // ex) navigate(`/employeehealthdetail/${empId}`)
    navigate("/employeehealthdetail", { state: { empId } });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    fetchList(0, empName.trim());
  };

  const employees = useMemo(() => {
    return rows.map((x) => {
      const avatar = x.emp_name?.[0] ?? "?";
      const status = getStatusByHealthPoint(x.health_point);
      console.log(x);
      return {
        emp_id: x.emp_id,
        emp_name: x.emp_name,
        department: x.department_name ?? "-",
        role: x.job ?? "-",
        start_date: formatDate(x.start_date), // DTO에 없어서 임시. 필요하면 startDate 내려받게 바꾸세요.
        test_date: formatDate(x.test_date),
        health_point: x.health_point,
        statusType: status.type,
      };
    });
  }, [rows]);




  // const employees = [
  //   {
  //     id: 'EMP-2024-0547',
  //     name: '김민수',
  //     avatar: '김',
  //     department: '객실 승무부',
  //     role: '신입 승무원',
  //     joinDate: '2015-03-15',
  //     lastCheckup: '2025-01-10',
  //     status: '정상',
  //     statusType: 'normal'
  //   },
  //   {
  //     id: 'EMP-2021-0214',
  //     name: '박지현',
  //     avatar: '박',
  //     department: '운항 승무부',
  //     role: '기장',
  //     joinDate: '2010-07-22',
  //     lastCheckup: '2025-01-08',
  //     status: '정상',
  //     statusType: 'normal'
  //   },
  //   {
  //     id: 'EMP-2022-0862',
  //     name: '이승진',
  //     avatar: '이',
  //     department: '객실 승무부',
  //     role: '승무원',
  //     joinDate: '2022-01-10',
  //     lastCheckup: '2024-12-28',
  //     status: '주의',
  //     statusType: 'warning'
  //   },
  //   {
  //     id: 'EMP-2018-0301',
  //     name: '최영호',
  //     avatar: '최',
  //     department: '정비사',
  //     role: '선임 정비사',
  //     joinDate: '2014-08-03',
  //     lastCheckup: '2025-01-05',
  //     status: '정상',
  //     statusType: 'normal'
  //   },
  //   {
  //     id: 'EMP-2023-0796',
  //     name: '정혜나',
  //     avatar: '정',
  //     department: '지상직',
  //     role: '팀장',
  //     joinDate: '2021-06-01',
  //     lastCheckup: '2024-11-20',
  //     status: '결과',
  //     statusType: 'alert'
  //   },
  //   {
  //     id: 'EMP-2023-0356',
  //     name: '한소희',
  //     avatar: '한',
  //     department: '객실 승무부',
  //     role: '사무장',
  //     joinDate: '2015-02-20',
  //     lastCheckup: '2025-01-12',
  //     status: '정상',
  //     statusType: 'normal'
  //   }
  // ];

  const filterOptions = [
    '전체',
    '객실 승무부',
    '운항 승무부',
    '정비사',
    '지상직',
    '정상',
    '주의',
    '결과'
  ];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // const handleDetailClick = () => {
  //   navigate('/employeehealthdetail');
  // };
  console.log(employees);
  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <div>
            <PageTitle>직원 건강 관리</PageTitle>
            <PageSubtitle>전체 직원 건강 상태를 조회하고 관리합니다</PageSubtitle>
          </div>
          <ActionButton>
            <span>📥</span>
            건강 보고서 다운로드
          </ActionButton>
        </PageHeader>

        <SearchSection onSubmit={onSearchSubmit}>
          <SearchInputWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput placeholder="이름 검색..."
              value={empName}
              onChange={(e) => setEmpName(e.target.value)} />
          </SearchInputWrapper>
          <button type="submit" style={{ display: "none" }} >검색</button>

          <FilterGroup>
            {filterOptions.map((filter, index) => (
              <React.Fragment key={filter}>
                <FilterButton
                  $active={activeFilter === filter}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </FilterButton>
                {index === 0 && <FilterDivider />}
              </React.Fragment>
            ))}
          </FilterGroup>
        </SearchSection>

        <EmployeeCount>
          전체 직원 <strong>{totalElements}명</strong>
          <FilterToggle>
            🔽 필터 초기화
          </FilterToggle>
        </EmployeeCount>

        <TableContainer>
          <TableHeader>
            <tr>
              <TableHeaderCell width="20%">직원 정보</TableHeaderCell>
              <TableHeaderCell width="18%">부서/직급</TableHeaderCell>
              <TableHeaderCell width="14%">입사일</TableHeaderCell>
              <TableHeaderCell width="14%">최근 검진일</TableHeaderCell>
              <TableHeaderCell width="12%">건강 상태</TableHeaderCell>
              <TableHeaderCell width="22%">관리</TableHeaderCell>
            </tr>
          </TableHeader>

          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee.emp_id}
                onClick={handleDetailClick}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <EmployeeInfo>
                    <EmployeeDetails>
                      <EmployeeName>{employee.emp_name}</EmployeeName>
                      <EmployeeId>{employee.emp_id}</EmployeeId>
                    </EmployeeDetails>
                  </EmployeeInfo>
                </td>
                <td>
                  <DepartmentInfo>
                    <DepartmentName>{employee.department_name}</DepartmentName>
                    <DepartmentRole>{employee.role}</DepartmentRole>
                  </DepartmentInfo>
                </td>
                <td>
                  <DateText>{employee.start_date}</DateText>
                </td>
                <td>
                  <DateText>{employee.test_date}</DateText>
                </td>
                <td>
                  <StatusBadge type={employee.statusType}>
                    {employee.health_point}
                  </StatusBadge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <IconButton
                      title="상세보기"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/employeehealthdetail/${employee.emp_id}`);

                      }}
                    >
                      👁️
                    </IconButton>
                    <IconButton title="편집" onClick={(e) => e.stopPropagation()}>✏️</IconButton>
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>

        <Pagination>
          <PaginationButton
            onClick={() => fetchList(currentPage - 1)}
            disabled={currentPage === 0}
          >‹</PaginationButton>

          {[...Array(totalPages)].map((_, idx) => (
            <PageNumber
              key={idx}
              $active={currentPage === idx}
              onClick={() => fetchList(idx)}
            >{idx + 1}</PageNumber>
          ))}

          <PaginationButton
            onClick={() => fetchList(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
          >›</PaginationButton>
        </Pagination>
      </ContentWrapper>
    </MainContainer>
  );
};

export default EmployeeHealthManagement;
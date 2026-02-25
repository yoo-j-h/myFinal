import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as S from "./FlightScheduleDetail.styled";
import { flightScheduleService } from "../../api/flightSchedule/services";
import { airportService } from "../../api/airport/services";
import { empService } from "../../api/emp/services";
import useAuthStore from "../../store/authStore";

const FlightScheduleDetail = () => {
  const navigate = useNavigate();
  const { flightId } = useParams();

  const { getRole } = useAuthStore();
  const userRole = getRole();
  const isAdmin = userRole === 'AIRLINE_ADMIN' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [flightDetail, setFlightDetail] = useState(null);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 승무원 추가 모달 관련 상태
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // 비행편 상세 정보 조회
  useEffect(() => {
    if (flightId) {
      loadFlightDetail();
      loadAirports();
    }
  }, [flightId]);

  const loadFlightDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // flightId를 숫자로 변환 (URL 파라미터는 문자열)
      const flyScheduleId = Number(flightId);

      if (isNaN(flyScheduleId)) {
        throw new Error(`유효하지 않은 비행편 ID: ${flightId}`);
      }

      console.log('비행편 상세 조회 요청 - flyScheduleId:', flyScheduleId);

      const response = await flightScheduleService.getFlightScheduleDetail(flyScheduleId);
      
      // ✅ 1단계: API 응답 구조 확인
      console.log('========================================');
      console.log('✅ [프론트] 비행편 상세 조회 응답 구조 확인');
      console.log('  - 전체 응답:', response);
      console.log('  - response.data:', response.data);
      console.log('  - response.data?.data:', response.data?.data);
      console.log('  - response.data?.success:', response.data?.success);
      console.log('  - response.data?.message:', response.data?.message);
      
      // ApiResponse 구조: { success: true, message: "...", data: { ... } }
      const apiResponse = response.data;
      const data = apiResponse?.data || apiResponse;
      
      console.log('  - 최종 추출된 data:', data);
      console.log('  - data.crewMembers:', data?.crewMembers);
      console.log('  - data.crew_members:', data?.crew_members);
      console.log('  - crewMembers 타입:', typeof data?.crewMembers);
      console.log('  - crewMembers 배열 여부:', Array.isArray(data?.crewMembers));
      console.log('  - crewMembers 길이:', (data?.crewMembers || data?.crew_members)?.length || 0);
      
      if (data?.crewMembers && data.crewMembers.length > 0) {
        console.log('  ✅ crewMembers 데이터 존재!');
        console.log('  - 첫 번째 멤버:', data.crewMembers[0]);
      } else if (data?.crew_members && data.crew_members.length > 0) {
        console.log('  ✅ crew_members 데이터 존재! (snake_case)');
        console.log('  - 첫 번째 멤버:', data.crew_members[0]);
      } else {
        console.warn('  ⚠️ WARNING: crewMembers가 비어있거나 null입니다!');
        console.warn('  - 원인 가능성:');
        console.warn('    1) DB에 emp_fly_schedule 데이터가 없음');
        console.warn('    2) 백엔드에서 crewMembers 조회 실패');
        console.warn('    3) JSON 직렬화 문제');
      }
      console.log('========================================');

      // crewMembers 필드명 매핑 (snake_case 또는 camelCase 모두 지원)
      if (data && !data.crewMembers && data.crew_members) {
        data.crewMembers = data.crew_members;
        console.log('✅ crew_members를 crewMembers로 매핑 완료');
      }

      setFlightDetail(data);
    } catch (error) {
      console.error('비행편 상세 조회 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      setError('비행편 정보를 불러오는데 실패했습니다.');
      alert(`비행편 정보를 불러오는데 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadAirports = async () => {
    try {
      const response = await airportService.getAirports();
      const airportList = response.data?.data || response.data || [];
      setAirports(airportList);
    } catch (error) {
      console.error('공항 목록 조회 실패:', error);
    }
  };
  console.log("현재 URL flightId =", flightId);
  // 공항 코드로 공항명 찾기
  const getAirportName = (airportCode) => {
    if (!airportCode) return '';
    const airport = airports.find(a => a.airportCode === airportCode);
    return airport ? (airport.airportName || airport.cityName || airportCode) : airportCode;
  };

  // 날짜 포맷팅
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = days[date.getDay()];
    return `${month}월 ${day}일 (${dayName})`;
  };

  // 역할 한글 변환
  const getRoleName = (role) => {
    const roleMap = {
      'PILOT': '조종사',
      'CABIN_CREW': '객실승무원',
      'MAINTENANCE': '정비사',
      'GROUND_STAFF': '지상직',
      'AIRLINE_ADMIN': '항공사 관리자',
      'ADMIN': '관리자',
      'SUPER_ADMIN': '최상위 관리자'
    };
    return roleMap[role] || role;
  };

  // 역할별 그룹 제목
  const getGroupTitle = (role, count) => {
    const titleMap = {
      'PILOT': '운항 승무원',
      'CABIN_CREW': '객실 승무원',
      'MAINTENANCE': '정비 승무원',
      'GROUND_STAFF': '지상 승무원'
    };
    return `${titleMap[role] || getRoleName(role)} (${count}명)`;
  };

  // 역할별 아이콘 및 색상
  const getRoleStyle = (role) => {
    const styleMap = {
      'PILOT': { avatar: '👨‍✈️', bgColor: '#8b5cf6' },
      'CABIN_CREW': { avatar: '👩‍✈️', bgColor: '#10b981' },
      'MAINTENANCE': { avatar: '🔧', bgColor: '#3b82f6' },
      'GROUND_STAFF': { avatar: '👷', bgColor: '#f59e0b' }
    };
    return styleMap[role] || { avatar: '👤', bgColor: '#6b7280' };
  };

  // 승무원 추가 모달 열기
  const handleOpenAddCrewModal = async (role) => {
    console.log('승무원 추가 모달 열기 - 역할:', role);
    console.log('전달받은 role 값:', role);
    console.log('crewMembers 원본 데이터:', flightDetail?.crewMembers);

    setSelectedRole(role);
    setShowAddCrewModal(true);
    setSelectedEmployeeId('');
    setAvailableEmployees([]);
    setLoadingEmployees(true);

    try {
      // role이 대문자로 전달되어야 함 (PILOT, CABIN_CREW 등)
      const roleUpper = role ? role.toUpperCase() : null;
      console.log('직원 목록 조회 요청 - role (대문자 변환):', roleUpper);

      // 해당 역할의 직원 목록 조회 (role 필드로 조회)
      const response = await empService.getEmployees({ role: roleUpper });
      console.log('직원 목록 조회 응답:', response);
      console.log('직원 목록 조회 응답 전체:', JSON.stringify(response.data, null, 2));

      const employees = response.data?.data || response.data || [];
      console.log('직원 목록:', employees);
      console.log('직원 수:', employees.length);
      if (employees.length > 0) {
        console.log('첫 번째 직원 데이터:', employees[0]);
        console.log('각 직원의 필드:', employees.map(e => ({
          empId: e.empId || e.emp_id,
          empName: e.empName || e.emp_name,
          role: e.role,
          job: e.job
        })));
      }

      // 이미 배정된 직원 제외 (필드명 매핑 처리)
      const crewMembers = flightDetail?.crewMembers || flightDetail?.crew_members || [];
      console.log('배정된 크루 멤버:', crewMembers);

      const assignedEmpIds = crewMembers.map(m => {
        const id = m.empId || m.emp_id;
        console.log('배정된 멤버 ID 추출:', { 원본: m, 추출된ID: id });
        return id;
      }).filter(Boolean);
      console.log('배정된 직원 ID 목록:', assignedEmpIds);

      // 필드명 매핑 처리 (snake_case 또는 camelCase 모두 지원)
      const available = employees.filter(emp => {
        const empId = emp.empId || emp.emp_id;
        const isAssigned = assignedEmpIds.includes(empId);
        console.log('직원 필터링:', { empId, isAssigned, emp });
        return empId && !isAssigned;
      });
      console.log('추가 가능한 직원:', available);
      console.log('추가 가능한 직원 수:', available.length);

      setAvailableEmployees(available);
    } catch (error) {
      console.error('직원 목록 조회 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      console.error('에러 스택:', error.stack);
      alert(`직원 목록을 불러오는데 실패했습니다: ${error.response?.data?.message || error.message}`);
      setAvailableEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // 승무원 추가
  const handleAddCrewMember = async () => {
    if (!selectedEmployeeId) {
      alert('직원을 선택해주세요.');
      return;
    }

    try {
      const flyScheduleId = Number(flightId);
      console.log('승무원 추가 요청:', { flyScheduleId, selectedEmployeeId });

      await flightScheduleService.addCrewMember(flyScheduleId, selectedEmployeeId);

      alert('승무원이 추가되었습니다.');
      setShowAddCrewModal(false);
      setSelectedEmployeeId('');
      loadFlightDetail(); // 목록 새로고침
    } catch (error) {
      console.error('승무원 추가 실패:', error);
      console.error('에러 응답:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.empId?.[0] || '승무원 추가에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // 승무원 삭제
  const handleRemoveCrewMember = async (empId, empName, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!confirm(`정말로 "${empName}" 승무원을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const flyScheduleId = Number(flightId);
      await flightScheduleService.removeCrewMember(flyScheduleId, empId);
      alert('승무원이 삭제되었습니다.');
      loadFlightDetail(); // 목록 새로고침
    } catch (error) {
      console.error('승무원 삭제 실패:', error);
      alert(error.response?.data?.message || '승무원 삭제에 실패했습니다.');
    }
  };

  // 크루 멤버를 역할별로 그룹화
  const groupCrewByRole = (crewMembers) => {
    if (!crewMembers || crewMembers.length === 0) {
      console.log('크루 멤버가 없습니다:', crewMembers);
      return [];
    }

    const roleGroups = {};

    console.log('크루 멤버 그룹화 시작 - crewMembers:', crewMembers);

    crewMembers.forEach((member) => {
      // 필드명 매핑 (snake_case 또는 camelCase 모두 지원)
      const empId = member.empId || member.emp_id;
      const empName = member.empName || member.emp_name;
      const role = member.role || '기타'; // 실제 역할 필드 사용
      const job = member.job || '';
      const roleStyle = getRoleStyle(role);

      console.log('멤버 처리:', {
        empId,
        empName,
        role,
        job,
        원본데이터: member
      });

      // 역할별 그룹화 (role 필드 사용 - job이 아님!)
      if (!roleGroups[role]) {
        roleGroups[role] = [];
      }

      roleGroups[role].push({
        empId,
        name: empName,
        role: job || getRoleName(role), // 화면에 표시할 역할명 (job 또는 한글 역할명)
        roleKey: role, // 실제 역할 키 (PILOT, CABIN_CREW 등) - API 호출에 사용
        status: '근무 가능',
        avatar: roleStyle.avatar,
        bgColor: roleStyle.bgColor
      });
    });

    console.log('그룹화 결과:', roleGroups);

    // 그룹을 배열로 변환 (우선순위: PILOT > CABIN_CREW > 기타)
    const groups = [];
    const priorityOrder = ['PILOT', 'CABIN_CREW', 'MAINTENANCE', 'GROUND_STAFF'];

    // 우선순위 순서대로 그룹 추가
    priorityOrder.forEach((role) => {
      if (roleGroups[role] && roleGroups[role].length > 0) {
        groups.push({
          id: groups.length + 1,
          title: getGroupTitle(role, roleGroups[role].length),
          members: roleGroups[role]
        });
      }
    });

    // 나머지 역할 추가
    Object.keys(roleGroups).forEach((role) => {
      if (!priorityOrder.includes(role) && roleGroups[role].length > 0) {
        groups.push({
          id: groups.length + 1,
          title: getGroupTitle(role, roleGroups[role].length),
          members: roleGroups[role]
        });
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <S.PageContainer>
        <S.MessageContainer>
          로딩 중...
        </S.MessageContainer>
      </S.PageContainer>
    );
  }

  if (error || !flightDetail) {
    return (
      <S.PageContainer>
        <S.ErrorMessageContainer>
          {error || '비행편 정보를 찾을 수 없습니다.'}
        </S.ErrorMessageContainer>
      </S.PageContainer>
    );
  }

  // crewMembers 필드명 매핑 (snake_case 또는 camelCase 모두 지원)
  const crewMembers = flightDetail.crewMembers || flightDetail.crew_members || [];
  console.log('직원 목록 렌더링 - crewMembers:', crewMembers);
  console.log('직원 목록 길이:', crewMembers.length);

  const crewPositions = groupCrewByRole(crewMembers);
  const departureAirportName = getAirportName(flightDetail.departure);
  const destinationAirportName = getAirportName(flightDetail.destination);

  return (
    <S.PageContainer>
      {/* 페이지 헤더 */}
      <S.PageHeader>
        <S.HeaderLeft>
          <S.PageTitle>비행편 코드 상세 정보</S.PageTitle>
          <S.PageSubtitle>
            비행편 정보 및 승무원 근무 배정을 관리합니다.
          </S.PageSubtitle>
        </S.HeaderLeft>
      </S.PageHeader>

      {/* 비행편 요약 */}
      <S.FlightSummaryCard>
        <S.FlightSummaryHeader>
          <S.FlightBadge>
            <S.AirlineIcon>✈</S.AirlineIcon>
            <div>
              <S.FlightNumber>{flightDetail.flightNumber}</S.FlightNumber>
              <S.FlightDate>
                {formatDate(flightDetail.flyStartTime)} • {flightDetail.airlineName || '항공사'}
              </S.FlightDate>
            </div>
          </S.FlightBadge>
        </S.FlightSummaryHeader>

        <S.FlightRoute>
          <S.RoutePoint>
            <S.RouteTime>{flightDetail.departureTime || ''}</S.RouteTime>
            <S.RouteCode>{flightDetail.departure}</S.RouteCode>
            <S.RouteAirport>{departureAirportName}</S.RouteAirport>
          </S.RoutePoint>

          <S.RouteIndicator>
            <S.RoutePlaneIcon>✈</S.RoutePlaneIcon>
            <S.RouteLine />
            <S.RouteDuration>{flightDetail.duration || ''}</S.RouteDuration>
          </S.RouteIndicator>

          <S.RoutePoint>
            <S.RouteTime>{flightDetail.arrivalTime || ''}</S.RouteTime>
            <S.RouteCode>{flightDetail.destination}</S.RouteCode>
            <S.RouteAirport>{destinationAirportName}</S.RouteAirport>
          </S.RoutePoint>
        </S.FlightRoute>
      </S.FlightSummaryCard>

      {/* 승무원 목록 */}
      {crewPositions.length > 0 ? (
        crewPositions.map((position) => {
          // 역할 키 찾기 (첫 번째 멤버의 roleKey 사용)
          const roleKey = position.members[0]?.roleKey || 'PILOT';

          return (
            <S.CrewSection key={position.id}>
              <S.CrewSectionHeader>
                <S.CrewSectionTitle>{position.title}</S.CrewSectionTitle>
                {isAdmin && (
                  <S.AddCrewButton onClick={() => handleOpenAddCrewModal(roleKey)}>
                    + 승무원 추가
                  </S.AddCrewButton>
                )}
              </S.CrewSectionHeader>

              <S.CrewMemberList>
                {position.members.map((member, index) => (
                  <S.CrewMemberCard
                    key={member.empId || index}
                    onClick={() => navigate(`/crew/${member.empId}`)}
                  >
                    <S.CrewMemberLeft>
                      <S.CrewAvatar $bgColor={member.bgColor}>
                        {member.avatar}
                      </S.CrewAvatar>

                      <S.CrewInfo>
                        <S.CrewName>{member.name}</S.CrewName>

                        <S.CrewMetadata>
                          <S.CrewRole>{member.role}</S.CrewRole>
                          <S.CrewDivider>•</S.CrewDivider>
                          <S.CrewID>{member.empId}</S.CrewID>
                        </S.CrewMetadata>
                      </S.CrewInfo>
                    </S.CrewMemberLeft>

                    <S.CrewMemberRight>
                      <S.CrewStatusBadge $status={member.status}>
                        {member.status}
                      </S.CrewStatusBadge>
                      {isAdmin && (
                        <S.DeleteCrewButton
                          onClick={(e) => handleRemoveCrewMember(member.empId, member.name, e)}
                          title="승무원 삭제"
                        >
                          🗑️
                        </S.DeleteCrewButton>
                      )}
                    </S.CrewMemberRight>
                  </S.CrewMemberCard>
                ))}
              </S.CrewMemberList>
            </S.CrewSection>
          );
        })
      ) : (
        <S.CrewSection>
          <S.CrewSectionHeader>
            <S.CrewSectionTitle>배정된 직원 명단</S.CrewSectionTitle>
            {isAdmin && (
              <S.AddCrewButton onClick={() => handleOpenAddCrewModal('PILOT')}>
                + 승무원 추가
              </S.AddCrewButton>
            )}
          </S.CrewSectionHeader>
          <S.EmptyCrewMessage>
            현재 배정된 직원이 없습니다.
          </S.EmptyCrewMessage>
        </S.CrewSection>
      )}

      {/* 배정된 직원 명단 테이블 (추가 섹션) */}
      {crewMembers && crewMembers.length > 0 && (
        <S.CrewSection>
          <S.CrewSectionHeader>
            <S.CrewSectionTitle>배정된 직원 명단</S.CrewSectionTitle>
          </S.CrewSectionHeader>
          <S.CrewTable>
            <S.CrewTableHeader>
              <S.CrewTableRow>
                <S.CrewTableHeaderCell>사번</S.CrewTableHeaderCell>
                <S.CrewTableHeaderCell>이름</S.CrewTableHeaderCell>
                <S.CrewTableHeaderCell>직무</S.CrewTableHeaderCell>
                <S.CrewTableHeaderCell>역할</S.CrewTableHeaderCell>
                <S.CrewTableHeaderCell>부서</S.CrewTableHeaderCell>
                {isAdmin && <S.CrewTableHeaderCell>관리</S.CrewTableHeaderCell>}
              </S.CrewTableRow>
            </S.CrewTableHeader>
            <S.CrewTableBody>
              {crewMembers.map((member, index) => {
                const empId = member.empId || member.emp_id;
                const empName = member.empName || member.emp_name;
                const empNo = member.empNo || member.emp_no || '-';
                const job = member.job || '-';
                const role = member.role || '기타';
                const departmentName = member.departmentName || member.department_name || '-';
                
                return (
                  <S.CrewTableRow key={empId || index}>
                    <S.CrewTableCell>{empNo}</S.CrewTableCell>
                    <S.CrewTableCell>
                      <S.CrewNameLink onClick={() => navigate(`/crew/${empId}`)}>
                        {empName}
                      </S.CrewNameLink>
                    </S.CrewTableCell>
                    <S.CrewTableCell>{job}</S.CrewTableCell>
                    <S.CrewTableCell>{getRoleName(role)}</S.CrewTableCell>
                    <S.CrewTableCell>{departmentName}</S.CrewTableCell>
                    {isAdmin && (
                      <S.CrewTableCell>
                        <S.DeleteCrewButton
                          onClick={(e) => handleRemoveCrewMember(empId, empName, e)}
                          title="승무원 삭제"
                        >
                          🗑️
                        </S.DeleteCrewButton>
                      </S.CrewTableCell>
                    )}
                  </S.CrewTableRow>
                );
              })}
            </S.CrewTableBody>
          </S.CrewTable>
        </S.CrewSection>
      )}

      {/* 승무원 추가 모달 */}
      {showAddCrewModal && (
        <S.ModalOverlay onClick={() => setShowAddCrewModal(false)}>
          <S.ModalContainer onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>승무원 추가</S.ModalTitle>
              <S.CloseButton onClick={() => setShowAddCrewModal(false)}>×</S.CloseButton>
            </S.ModalHeader>
            <S.ModalContent>
              <S.FormGroup>
                <S.FormLabel>직원 선택 *</S.FormLabel>
                {loadingEmployees ? (
                  <S.SmallMessage>
                    직원 목록을 불러오는 중...
                  </S.SmallMessage>
                ) : (
                  <S.EmployeeSelect
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">직원을 선택하세요</option>
                    {availableEmployees.map((emp) => {
                      // 필드명 매핑 처리 (snake_case 또는 camelCase 모두 지원)
                      const empId = emp.empId || emp.emp_id;
                      const empName = emp.empName || emp.emp_name || '이름 없음';
                      const job = emp.job || getRoleName(emp.role) || '직급 없음';
                      console.log('직원 옵션 렌더링:', { empId, empName, job, 원본: emp });
                      return (
                        <option key={empId} value={empId}>
                          {job} / {empName}
                        </option>
                      );
                    })}
                  </S.EmployeeSelect>
                )}
              </S.FormGroup>
              {!loadingEmployees && availableEmployees.length === 0 && (
                <S.EmptyMessage>
                  추가 가능한 직원이 없습니다.
                </S.EmptyMessage>
              )}
            </S.ModalContent>
            <S.FormActions>
              <S.CancelButton onClick={() => setShowAddCrewModal(false)}>취소</S.CancelButton>
              <S.SubmitButton onClick={handleAddCrewMember} disabled={!selectedEmployeeId}>
                추가
              </S.SubmitButton>
            </S.FormActions>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
};

export default FlightScheduleDetail;

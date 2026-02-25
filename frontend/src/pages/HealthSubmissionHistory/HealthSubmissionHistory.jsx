import React, { useEffect, useMemo, useState } from 'react';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StatsCard,
  StatsLabel,
  StatsValue,
  StatsIcon,
  SearchSection,
  SearchBar,
  SearchIcon,
  SearchInput,
  FilterButton,
  SubmitButton,
  HistorySection,
  HistoryCount,
  HistoryGrid,
  HistoryCard,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDate,

  FileAttachment,
  FileIcon,
  FileName,
  ContentSection,
  ContentLabel,
  ContentText,
  EmptyState,
  EmptyIcon,
  EmptyText,
  CardTitleGroup
} from './HealthSubmissionHistory.styled';
import { empPhysicalTestService } from '../../api/Health/healthService';
import useAuthStore from '../../store/authStore';
import { PageNumber, Pagination, PaginationButton } from '../../styles/GlobalStyle';

const HealthSubmissionHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [items, setItems] = useState([]);          // ← 백에서 받은 content
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  // 페이징 관련
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  {/* TODO: Zustand state mapping */ }

  const empId = useAuthStore((s) => s.getEmpId()); // 또는 s.emp?.empId
  const hydrate = useAuthStore((s) => s.hydrate);

  const fetchPosts = async (page = 0) => {
    if (!empId) return;
    try {
      const res = await empPhysicalTestService.getPhysicalTest(empId, page, 4);

      setItems(res.data.content ?? []);
      setTotalPages(res.data.totalPages ?? 0);
      setCurrentPage(res.data.number ?? 0);
      setTotalSubmissions(res.data.totalElements ?? 0);
    } catch (e) {
      console.error(e);
      alert("제출 이력 조회 실패");
    }
  };

  useEffect(() => {
    if (!empId) hydrate(); // 토큰 있으면 me 호출해서 emp 채움
  }, [empId, hydrate]);

  useEffect(() => {
    if (empId) fetchPosts(0);
  }, [empId]);

  const submissionHistory = useMemo(() => {
    return items.map((x, idx) => {
      const date = x.testDate ? String(x.testDate).slice(0, 10) : "-";
      const bp = `${x.systolicBloodPressure ?? "-"} / ${x.diastolicBloodPressure ?? "-"}`;
      console.log(x);
      return {
        id: x.physicalTestId ?? `${currentPage}-${idx}`, // id 내려주면 그걸 쓰세요(추천)
        type: "pdf",
        title: "건강검진 결과",
        date,
        fileName: x.fileName ?? null,
        file_id: x.file_id ?? null,
        adminNote: x.adminNote ?? null,
        content: [
          `검사일: ${x.test_date}`,
          `키: ${x.height ?? "-"}`,
          `체중: ${x.weight ?? "-"}`,
          `혈당: ${x.blood_sugar ?? "-"}`,
          `혈압: ${x.systolic_blood_pressure} / ${x.diastolic_blood_pressure}`,
          `콜레스테롤: ${x.cholesterol ?? "-"}`,
          `심박수: ${x.heart_rate ?? "-"}`,
          `BMI: ${x.bmi ?? "-"}`,
          `체지방: ${x.body_fat ?? "-"}`,
        ].join("\n"),
      };
    });
  }, [items, currentPage]);

  const handleDownload = (file_id) => {
    console.log(file_id)
    if (!file_id) return;
    //window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/file/download/${fileId}`;
  };

  // const submissionHistory = [
  //   {
  //     id: 1,
  //     type: 'pdf',
  //     title: '건강검진 결과',
  //     date: '2025-01-10',
  //     fileName: '2025년_건강검진_결과서.pdf',
  //     adminNote: '검진 결과 확인 완료. 모든 항목 정상입니다.',
  //     content: null
  //   },
  //   {
  //     id: 2,
  //     type: 'text',
  //     title: '진료 기록',
  //     date: '2024-12-15',
  //     fileName: null,
  //     adminNote: '치료 완료 확인 완료. 정기 검진 시 재확인 예정.',
  //     content: '검진일: 2024년 12월 10일 검진 기관: 서울대학교병원 주요 소견: 경미한 비염검으로 내원, 비타민 D 부족 진단 처방: 비타민 D 보충제 3개월 복이사항: 충분한 휴식 권장'
  //   },
  //   {
  //     id: 3,
  //     type: 'pdf',
  //     title: '예방접종 증명서',
  //     date: '2024-10-20',
  //     fileName: '인플루엔자_예방접종_증명서.pdf',
  //     adminNote: '예방접종 기록 시스템에 반영 완료.',
  //     content: null
  //   },
  //   {
  //     id: 4,
  //     type: 'text',
  //     title: '임반 건강 정보',
  //     date: '2024-09-05',
  //     fileName: null,
  //     adminNote: null,
  //     content: '최근 수면 패턴 개선을 위한 노력 중입니다. - 취침 시간: 오후 11시 - 기상 시간: 오전 7시 - 운동: 주 3회 조깅 (30분) - 식습관: 규칙적인 식사, 야식 줄임'
  //   },
  //   {
  //     id: 5,
  //     type: 'text',
  //     title: '약물 복용 정보',
  //     date: '2024-08-12',
  //     fileName: null,
  //     adminNote: '약물명, 복용량, 복용 기간 등 상세 정보가 부족하니, 재제출 바랍니다.',
  //     content: '알레르기 약물 복용 중'
  //   }
  // ];

  const filteredHistory = submissionHistory.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCardIcon = (type) => {
    return type === 'pdf' ? '📄' : '📝';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    {/* TODO: Implement search with Zustand */ }
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <div>
            <PageTitle>내 건강 정보 제출 이력</PageTitle>
            <PageSubtitle>제출한 건강 정보 기록을 확인하고 관리합니다</PageSubtitle>
          </div>

          <StatsCard>
            <StatsIcon>📋</StatsIcon>
            <div>
              <StatsLabel>전체 제출</StatsLabel>
              <StatsValue>{totalSubmissions}</StatsValue>
            </div>
          </StatsCard>
        </PageHeader>


        <HistorySection>

          {filteredHistory.length > 0 ? (
            <HistoryGrid>
              {filteredHistory.map((item) => (
                <HistoryCard key={item.id} $hasAdminNote={!!item.adminNote}>
                  <CardHeader>
                    <CardTitleGroup>
                      <CardIcon type={item.type}>
                        {getCardIcon(item.type)}
                      </CardIcon>
                      <CardTitle>{item.title}</CardTitle>
                    </CardTitleGroup>
                    <CardDate>
                      <SubmitButton type="button"
                        onClick={() => handleDownload(item.file_id)} // fileId 필요
                        disabled={!item.file_id}>
                        다운로드
                      </SubmitButton>
                    </CardDate>
                  </CardHeader>

                  {item.fileName && (
                    <FileAttachment>
                      <FileIcon>📎</FileIcon>
                      <FileName>{item.fileName}</FileName>
                    </FileAttachment>
                  )}

                  {item.content && (
                    <ContentSection>
                      <ContentText>{item.content}</ContentText>
                    </ContentSection>
                  )}

                  {item.adminNote && (
                    <ContentSection $isAdminNote>
                      <ContentLabel>관리 의견</ContentLabel>
                      <ContentText>{item.adminNote}</ContentText>
                    </ContentSection>
                  )}
                </HistoryCard>
              ))}
            </HistoryGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyText>검색 결과가 없습니다.</EmptyText>
            </EmptyState>
          )}
        </HistorySection>
        {/* 페이지네이션 섹션 */}
        <Pagination>
          <PaginationButton
            onClick={() => fetchPosts(currentPage - 1)}
            disabled={currentPage === 0}
          >‹</PaginationButton>

          {[...Array(totalPages)].map((_, idx) => (
            <PageNumber
              key={idx}
              $active={currentPage === idx}
              onClick={() => fetchPosts(idx)}
            >{idx + 1}</PageNumber>
          ))}

          <PaginationButton
            onClick={() => fetchPosts(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
          >›</PaginationButton>
        </Pagination>


      </ContentWrapper>
    </MainContainer>
  );
};

export default HealthSubmissionHistory;
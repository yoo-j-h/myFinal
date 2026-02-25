import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as S from './QnA.styled';
import { useTheme } from 'styled-components'; // Import useTheme
import {
  Search, MessageSquare, Eye, MessageCircle, Heart, CheckCircle2, // 이거 추가
  Clock, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const QnA = () => {
  const theme = useTheme(); // Get theme context
  const { getRole, emp } = useAuthStore();
  
  // role 상태를 별도로 관리하여 emp가 로드된 후 업데이트
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // emp가 로드되면 role 업데이트
  useEffect(() => {
    const role = getRole() || emp?.role;
    setUserRole(role);
    setIsAdmin(role === 'AIRLINE_ADMIN' || role === 'SUPER_ADMIN');
    console.log('QnA - userRole:', role, 'emp:', emp, 'isAdmin:', role === 'AIRLINE_ADMIN' || role === 'SUPER_ADMIN');
  }, [getRole, emp]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('최신순');
  const [qnaList, setQnaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [emailForm, setEmailForm] = useState({ 
    adminEmail: '', 
    myEmail: '', 
    subject: '', 
    content: '' 
  });
  const [currentPage, setCurrentPage] = useState(0); // 백엔드는 0번부터 시작
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // 2. API 호출 로직

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      // 백엔드 엔드포인트에 page와 size 전달
      const response = await axios.get(`/api/questions?page=${currentPage}&size=10`);

      // Page 객체에서 content(목록)와 totalPages(전체 페이지) 추출
      const { content, totalPages } = response.data;

      setQnaList(content || []);
      setTotalPages(totalPages || 1);

      console.log("📦 받은 데이터:", response.data);
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]); // 페이지 바뀔 때마다 실행

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);



  const filteredList = qnaList.filter((item) => {
    const query = searchQuery.toLowerCase();

    // 제목, 내용, 작성자 이름 중 검색어가 포함된 것이 있는지 확인
    return (
      item.questionTitle?.toLowerCase().includes(query) ||
      item.questionContent?.toLowerCase().includes(query) ||
      item.questionerName?.toLowerCase().includes(query)
    );
  });

  // 2. handleSearch 함수는 이제 엔터를 쳤을 때 새로고침 방지만 하면 됩니다.
  const handleSearch = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    // 실제 필터링은 위에서 실시간(filteredList)으로 일어납니다.
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      // 1. 변수명을 storageData로 통일
      const storageData = localStorage.getItem('auth-storage');

      // 콘솔에 찍어서 데이터가 잘 나오는지 확인 (개발용)
      console.log("로컬스토리지 데이터:", storageData);

      if (!storageData) {
        alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      // 2. 파싱 로직
      const parsedData = JSON.parse(storageData);
      const token = parsedData.state?.token;

      if (!token) {
        alert("유효한 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 3. API 요청
      const response = await axios.post('/api/questions', {
        title: newPost.title,
        content: newPost.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      alert("글이 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
      setNewPost({ title: '', content: '' });
      fetchQuestions(); // 리스트 새로고침
      console.log("6. ✅ 서버 응답 결과:", response.data);
    } catch (error) {
      console.error("등록 실패 상세:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  // 이메일 문의 모달 열기 및 사전 입력 정보 조회
  const handleOpenEmailModal = async () => {
    try {
      const storageData = localStorage.getItem('auth-storage');
      if (!storageData) {
        alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      const parsedData = JSON.parse(storageData);
      const token = parsedData.state?.token;

      if (!token) {
        alert("유효한 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 사전 입력 정보 조회
      const response = await axios.get('/api/support/email/prefill', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success && response.data.data) {
        setEmailForm({
          adminEmail: response.data.data.adminEmail || '',
          myEmail: response.data.data.myEmail || '',
          subject: '',
          content: ''
        });
        setIsEmailModalOpen(true);
      } else {
        alert("이메일 정보를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 정보 조회 실패:", error);
      console.error("에러 상세:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // 403 Forbidden 에러 처리
      if (error.response?.status === 403) {
        alert("접근 권한이 없습니다. 로그인 상태를 확인해주세요.");
      } else if (error.response?.status === 401) {
        alert("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || 
                            "서버 오류가 발생했습니다. 관리자에게 문의해주세요.";
        alert(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message ||
                            "이메일 정보를 불러오는데 실패했습니다.";
        alert(errorMessage);
      }
    }
  };

  // 이메일 문의 발송
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailForm.subject.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!emailForm.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const storageData = localStorage.getItem('auth-storage');
      if (!storageData) {
        alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      const parsedData = JSON.parse(storageData);
      const token = parsedData.state?.token;

      if (!token) {
        alert("유효한 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      const response = await axios.post('/api/support/email/send', {
        subject: emailForm.subject,
        content: emailForm.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        alert("이메일이 성공적으로 발송되었습니다.");
        setIsEmailModalOpen(false);
        setEmailForm({ 
          adminEmail: '', 
          myEmail: '', 
          subject: '', 
          content: '' 
        });
      } else {
        const errorMessage = response.data.message || "이메일 발송에 실패했습니다.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("이메일 발송 실패:", error);
      // ErrorResponse 형식: { success: false, message: "...", errors: {...} }
      // ApiResponse 형식: { success: false, message: "...", data: null }
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "이메일 발송 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <S.PageContainer>
      <S.MainContent>
        <S.ContentWrapper>
          <S.PageHeader>
            <S.PageTitle>
              <MessageSquare size={28} />
              Q&A
            </S.PageTitle>
            <S.ButtonGroup>
              {!isAdmin && (
                <S.EmailButton onClick={handleOpenEmailModal}>
                  <Mail size={16} style={{ marginRight: '6px' }} />
                  이메일 문의
                </S.EmailButton>
              )}
              <S.CreateButton onClick={() => setIsModalOpen(true)}>+ 글쓰기</S.CreateButton>
            </S.ButtonGroup>
          </S.PageHeader>

          {/* 2. 글쓰기 모달 영역 */}
          {isModalOpen && (
            <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
              <S.ModalContainer onClick={(e) => e.stopPropagation()}>
                <S.ModalHeader>
                  <h3>질문하기</h3>
                  <button onClick={() => setIsModalOpen(false)}>×</button>
                </S.ModalHeader>
                <S.ModalBody onSubmit={handleCreatePost}>
                  <S.FormGroup>
                    <label>제목</label>
                    <input
                      type="text"
                      placeholder="제목을 입력하세요"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>내용</label>
                    <textarea
                      placeholder="내용을 상세히 입력해주세요"
                      rows="10"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    />
                  </S.FormGroup>
                  <S.ModalFooter>
                    <S.CancelButton type="button" onClick={() => setIsModalOpen(false)}>취소</S.CancelButton>
                    <S.SubmitButton type="submit">등록하기</S.SubmitButton>
                  </S.ModalFooter>
                </S.ModalBody>
              </S.ModalContainer>
            </S.ModalOverlay>
          )}

          {/* 3. 이메일 문의 모달 영역 */}
          {isEmailModalOpen && (
            <S.ModalOverlay onClick={() => setIsEmailModalOpen(false)}>
              <S.ModalContainer onClick={(e) => e.stopPropagation()}>
                <S.ModalHeader>
                  <h3>이메일 문의</h3>
                  <button onClick={() => setIsEmailModalOpen(false)}>×</button>
                </S.ModalHeader>
                <S.ModalBody onSubmit={handleSendEmail}>
                  <S.FormGroup>
                    <label>관리자 이메일</label>
                    <S.ReadOnlyInput
                      type="text"
                      value={emailForm.adminEmail}
                      readOnly
                    />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>내 이메일</label>
                    <S.ReadOnlyInput
                      type="text"
                      value={emailForm.myEmail}
                      readOnly
                    />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>제목</label>
                    <input
                      type="text"
                      placeholder="문의 제목을 입력하세요"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      maxLength={200}
                    />
                  </S.FormGroup>
                  <S.FormGroup>
                    <label>내용</label>
                    <textarea
                      placeholder="문의 내용을 상세히 입력해주세요"
                      rows="10"
                      value={emailForm.content}
                      onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
                      maxLength={5000}
                    />
                  </S.FormGroup>
                  <S.ModalFooter>
                    <S.CancelButton type="button" onClick={() => setIsEmailModalOpen(false)}>취소</S.CancelButton>
                    <S.SubmitButton type="submit">발송하기</S.SubmitButton>
                  </S.ModalFooter>
                </S.ModalBody>
              </S.ModalContainer>
            </S.ModalOverlay>
          )}


          <S.SearchSection>
            <S.SearchForm onSubmit={handleSearch}>
              <S.SearchInput
                type="text"
                placeholder="제목, 내용, 작성자를 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <S.SearchButton type="submit">
                <Search size={20} />
              </S.SearchButton>
            </S.SearchForm>
            <S.FilterButton
              $active={selectedFilter === '최신순'}
              onClick={() => setSelectedFilter('최신순')}
            >
              최신순
            </S.FilterButton>
          </S.SearchSection>
          <S.QnaList>
            {filteredList.map((item) => (
              <S.QnaItem key={item.questionId}
                onClick={() => navigate(`/qna/${item.questionId}`)}>
                <S.CategoryBadge
                  $bgColor={item.answered ? theme.status.success : theme.status.warning}
                  $textColor={item.answered ? theme.text.inverse : theme.text.primary}
                >
                  {/* 상태에 따른 아이콘 렌더링 */}
                  {item.answered ? (
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
                  ) : (
                    <Clock size={14} style={{ marginRight: '4px' }} />
                  )}
                  {item.answered ? '답변완료' : '답변대기'}
                </S.CategoryBadge>

                <S.QnaContent>
                  <S.QnaTitle>{item.questionTitle}</S.QnaTitle>
                  <S.QnaMetaRow>
                    <S.QnaMeta>
                      <S.MetaItem>
                        <S.MetaIcon>👤</S.MetaIcon>
                        {item.questionerName}
                      </S.MetaItem>
                      <S.MetaItem>
                        <S.MetaIcon>📅</S.MetaIcon>
                        {item.createDate ? item.createDate.split('T')[0] : '-'}
                      </S.MetaItem>
                    </S.QnaMeta>
                  </S.QnaMetaRow>
                </S.QnaContent>
              </S.QnaItem>
            ))}
          </S.QnaList>
          {/* 페이지네이션 버튼 동적 생성 */}
          <S.Pagination>
            <S.PaginationButton
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >‹</S.PaginationButton>

            {[...Array(totalPages)].map((_, i) => (
              <S.PageNumber
                key={i}
                $active={currentPage === i}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </S.PageNumber>
            ))}

            <S.PaginationButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >›</S.PaginationButton>
          </S.Pagination>
        </S.ContentWrapper>
      </S.MainContent>
    </S.PageContainer>
  );
};

export default QnA;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Board.styled';
import { Search, MessageSquare, Eye, Send, X } from 'lucide-react';

const Board = () => {
  const navigate = useNavigate();

  // --- [1] 상태 관리 (States) ---
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('최신순');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 페이징 관련
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // 폼 및 파일 데이터
  const [formData, setFormData] = useState({ category: '', title: '', content: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- [2] API 호출 로직 (Data Fetching) ---
  const fetchPosts = useCallback(async (category, page = 0, keyword = '') => {
    try {
      setLoading(true);
      const storageData = JSON.parse(localStorage.getItem('auth-storage'));
      const token = storageData?.state?.token;

      // URL 파라미터 구성
      const params = new URLSearchParams({ page });
      if (category !== '전체') params.append('category', category);
      if (keyword) params.append('keyword', keyword);

      const response = await fetch(`http://localhost:8001/api/board/list?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setBoardList(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.number || 0);

    } catch (error) {
      console.error("게시글 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드 및 탭 변경 감지
  useEffect(() => {
    fetchPosts(activeTab, 0, searchQuery);
  }, [activeTab, fetchPosts]);

  // --- [3] 이벤트 핸들러 (Event Handlers) ---
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(''); // 탭 변경 시 검색어 초기화 (선택 사항)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ category: '', title: '', content: '' });
    setSelectedFiles([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(activeTab, 0, searchQuery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storageData = JSON.parse(localStorage.getItem('auth-storage'));
    const token = storageData?.state?.token;
    const empId = storageData?.state?.emp?.empId;

    if (!token) return alert("로그인이 필요합니다.");

    // FormData 생성 (텍스트 + 파일 통합)
    const formDataObj = new FormData();
    formDataObj.append('category', formData.category);
    formDataObj.append('title', formData.title);
    formDataObj.append('content', formData.content);
    formDataObj.append('writerId', empId);

    selectedFiles.forEach((file) => {
      formDataObj.append('files', file); 
    });

    try {
      const response = await fetch('http://localhost:8001/api/board/write', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj, // 브라우저가 자동으로 multipart/form-data 설정
      });

      if (response.ok) {
        alert("등록되었습니다.");
        handleCloseModal();
        fetchPosts(activeTab, 0);
      }
    } catch (error) {
      console.error("글쓰기 실패:", error);
    }
  };

  // --- [4] 렌더링 (Render) ---
  return (
    <S.PageContainer>
      <S.MainContent>
        <S.ContentWrapper>
          
          {/* 헤더 섹션 */}
          <S.PageHeader>
            <S.PageTitle><MessageSquare size={28} /> 게시판</S.PageTitle>
            <S.CreateButton onClick={handleOpenModal}>+ 글쓰기</S.CreateButton>
          </S.PageHeader>

          {/* 탭 섹션 */}
          <S.TabSection>
            {['전체', '공지사항', '사건사고'].map((tab) => (
              <S.Tab 
                key={tab} 
                $active={activeTab === tab} 
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </S.Tab>
            ))}
          </S.TabSection>

          {/* 검색 및 필터 섹션 */}
          <S.SearchSection>
            <S.SearchForm onSubmit={handleSearch}>
              <S.SearchInput
                placeholder="제목, 내용 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <S.SearchButton type="submit"><Search size={20} /></S.SearchButton>
            </S.SearchForm>
            <S.FilterButton 
              $active={selectedFilter === '최신순'} 
              onClick={() => fetchPosts(activeTab, 0, searchQuery)}
            >
              최신순
            </S.FilterButton>
          </S.SearchSection>

          {/* 게시글 리스트 섹션 */}
          <S.BoardList>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>데이터 로딩 중...</div>
            ) : boardList.length > 0 ? (
              boardList.map((item) => (
                <S.BoardItem key={item.boardId} onClick={() => navigate(`/board/detail/${item.boardId}`)}>
                  <S.CategoryBadge>{item.boardType}</S.CategoryBadge>
                  <S.BoardContent>
                    <S.BoardTitle>{item.boardTitle}</S.BoardTitle>
                    <S.BoardMetaRow>
                      <S.BoardMeta>
                        <S.MetaItem>👤 {item.writerName}</S.MetaItem>
                        <S.MetaItem>📅 {item.createDate}</S.MetaItem>
                        <S.MetaItem><Eye size={14} /> {item.boardCount}</S.MetaItem>
                      </S.BoardMeta>
                    </S.BoardMetaRow>
                  </S.BoardContent>
                </S.BoardItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>게시글이 존재하지 않습니다.</div>
            )}
          </S.BoardList>

          {/* 페이지네이션 섹션 */}
          <S.Pagination>
            <S.PaginationButton 
              onClick={() => fetchPosts(activeTab, currentPage - 1, searchQuery)}
              disabled={currentPage === 0}
            >‹</S.PaginationButton>

            {[...Array(totalPages)].map((_, idx) => (
              <S.PageNumber
                key={idx}
                $active={currentPage === idx}
                onClick={() => fetchPosts(activeTab, idx, searchQuery)}
              >{idx + 1}</S.PageNumber>
            ))}

            <S.PaginationButton 
              onClick={() => fetchPosts(activeTab, currentPage + 1, searchQuery)}
              disabled={currentPage + 1 >= totalPages}
            >›</S.PaginationButton>
          </S.Pagination>

        </S.ContentWrapper>
      </S.MainContent>

      {/* 글쓰기 모달 */}
      {isModalOpen && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContainer onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle><Send size={24} /> 새 글 작성</S.ModalTitle>
              <S.CloseButton onClick={handleCloseModal}><X size={24} /></S.CloseButton>
            </S.ModalHeader>
            <S.ModalBody>
              <S.PostForm onSubmit={handleSubmit}>
                <S.FormGroup>
                  <S.FormLabel>카테고리</S.FormLabel>
                  <S.FormSelect name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">선택하세요</option>
                    <option value="공지사항">공지사항</option>
                    <option value="사건사고">사건사고</option>
                  </S.FormSelect>
                </S.FormGroup>
                <S.FormGroup>
                  <S.FormLabel>제목</S.FormLabel>
                  <S.FormInput name="title" value={formData.title} onChange={handleInputChange} required />
                </S.FormGroup>
                <S.FormGroup>
                  <S.FormLabel>내용</S.FormLabel>
                  <S.FormTextarea name="content" value={formData.content} onChange={handleInputChange} rows={10} required />
                </S.FormGroup>
                
                {/* 파일 첨부 영역 */}
                <S.FormGroup>
                  <S.FormLabel>파일 첨부</S.FormLabel>
                  <S.FormInput 
                    type="file" 
                    multiple 
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))} 
                  />
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    {selectedFiles.map((file, index) => (
                      <div key={index}>📎 {file.name}</div>
                    ))}
                  </div>
                </S.FormGroup>

                <S.ModalFooter>
                  <S.CancelButton type="button" onClick={handleCloseModal}>취소</S.CancelButton>
                  <S.SubmitButton type="submit">등록</S.SubmitButton>
                </S.ModalFooter>
              </S.PostForm>
            </S.ModalBody>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
};

export default Board;
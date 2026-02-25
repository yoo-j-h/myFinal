import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './boardEdit.styled'; // 기존 Board 스타일 재사용
import { Send, X, FileText } from 'lucide-react';

const BoardEdit = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ category: '', title: '', content: '' });
  const [existingFiles, setExistingFiles] = useState([]); // 기존 첨부파일
  const [newFiles, setNewFiles] = useState([]); // 새로 추가할 파일
  const [loading, setLoading] = useState(true);

  // 1. 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const storageData = JSON.parse(localStorage.getItem('auth-storage'));
        const token = storageData?.state?.token;

        const response = await fetch(`http://localhost:8001/api/board/detail/${boardId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        setFormData({
          category: data.boardType,
          title: data.boardTitle,
          content: data.boardContent
        });
        setExistingFiles(data.files || []);
        setLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        navigate('/board');
      }
    };
    fetchPostDetail();
  }, [boardId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storageData = JSON.parse(localStorage.getItem('auth-storage'));
    const token = storageData?.state?.token;

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('content', formData.content);
    formDataObj.append('category', formData.category);

    // 신규 파일 추가
    newFiles.forEach(file => formDataObj.append('files', file));

    try {
      const response = await fetch(`http://localhost:8001/api/board/update/${boardId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj,
      });

      if (response.ok) {
        alert("수정되었습니다.");
        navigate(`/board/detail/${boardId}`);
      }
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <S.PageContainer>
      <S.MainContent>
        <S.ContentWrapper>
          <S.PageHeader>
            <S.PageTitle><FileText size={28} /> 게시글 수정</S.PageTitle>
          </S.PageHeader>

          <S.PostForm onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.FormLabel>카테고리</S.FormLabel>
              <S.FormSelect name="category" value={formData.category} onChange={handleInputChange} required>
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
              <S.FormTextarea name="content" value={formData.content} onChange={handleInputChange} rows={15} required />
            </S.FormGroup>

            {/* 기존 파일 목록 표시 (삭제 기능은 필요 시 추가) */}
            <S.FormGroup>
              <S.FormLabel>기존 첨부파일</S.FormLabel>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {existingFiles.length > 0 ? existingFiles.map(f => (
                  <div key={f.fileId}>📎 {f.fileOriginName}</div>
                )) : "첨부된 파일이 없습니다."}
              </div>
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>새 파일 추가</S.FormLabel>
              <S.FormInput type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
            </S.FormGroup>

            <S.ModalFooter>
              <S.CancelButton type="button" onClick={() => navigate(-1)}>취소</S.CancelButton>
              <S.SubmitButton type="submit">수정 완료</S.SubmitButton>
            </S.ModalFooter>
          </S.PostForm>
        </S.ContentWrapper>
      </S.MainContent>
    </S.PageContainer>
  );
};

export default BoardEdit;
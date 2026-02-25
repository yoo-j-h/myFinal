import React, { useState, useEffect ,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './BoardDetail.styled';
import { ArrowLeft, Calendar, Eye, User, Edit3, Trash2 } from 'lucide-react';
import { Paperclip, Download } from 'lucide-react';

const BoardDetail = () => {
  const navigate = useNavigate();
  const { boardId } = useParams(); // URL 파라미터에서 ID 추출 (예: /board/detail/12)
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);
const handleDownload = (fileId, fileName) => {
    // 예시: 서버의 다운로드 API 호출
    window.location.href = `http://localhost:8001/api/board/download/${fileId}`;
  };
  // --- [1] 데이터 로드 (API 호출) ---
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const storageData = JSON.parse(localStorage.getItem('auth-storage'));
        const token = storageData?.state?.token;

        // 상세 조회 API 호출 (URL은 백엔드 엔드포인트에 맞게 조정하세요)
        const response = await fetch(`http://localhost:8001/api/board/detail/${boardId}`, {
         
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("게시글 상세 정보:", data);
          setPost(data);
          
        } else {
          isFetched.current = false;
          alert("게시글을 불러올 수 없습니다.");
          navigate('/board');
        }
      } catch (error) {
        isFetched.current = false;
        console.error("상세 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (boardId) fetchPostDetail();
  }, [boardId, navigate]);

  // --- [2] 핸들러 ---
  const handleBack = () => navigate(-1);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const storageData = JSON.parse(localStorage.getItem('auth-storage'));
      const token = storageData?.state?.token;

      const response = await fetch(`http://localhost:8001/api/board/delete/${boardId}`, {
        method: 'DELETE', // 보통 삭제는 DELETE 메소드를 사용합니다.
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("삭제되었습니다.");
        navigate('/board');
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  if (loading) return <S.PageContainer><div style={{textAlign: 'center', padding: '100px'}}>로딩 중...</div></S.PageContainer>;
  if (!post) return <S.PageContainer><div style={{textAlign: 'center', padding: '100px'}}>데이터가 없습니다.</div></S.PageContainer>;

  return (
    <S.PageContainer>
      <S.MainContent>
        <S.ContentWrapper>
          <S.BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
            목록으로
          </S.BackButton>

          <S.PostCard>
            <S.PostHeader>
              <S.CategoryBadge $bgColor={post.boardType === '공지사항' ? '#FFE5E5' : '#E5F1FF'}>
                {post.boardType}
              </S.CategoryBadge>
              <S.PostTitle>{post.boardTitle}</S.PostTitle>
              <S.PostMeta>
                <S.MetaItem>
                  <User size={16} />
                  {post.writerName}
                </S.MetaItem>
                <S.MetaItem>
                  <Calendar size={16} />
                  {post.createDate}
                </S.MetaItem>
                <S.MetaItem>
                  <Eye size={16} />
                  {post.boardCount}
                </S.MetaItem>
              </S.PostMeta>
            </S.PostHeader>

            <S.PostBody>
              {/* 백엔드에서 받아온 본문 내용 출력 */}
              <S.ContentParagraph style={{ whiteSpace: 'pre-wrap' }}>
                {post.boardContent}
              </S.ContentParagraph>
              {/* ✅ 첨부파일 영역 추가 */}
              {post.files && post.files.length > 0 && (
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Paperclip size={18} /> 첨부파일 ({post.files.length})
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {post.files.map((file, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <a 
                          href={`http://localhost:8001/api/file/download/${file.fileId}`} // 백엔드 다운로드 경로 확인 필요
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            color: '#007bff', 
                            textDecoration: 'none',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa',
                            padding: '10px',
                            borderRadius: '5px'
                          }}
                        >
                          <Download size={14} />
                          {file.originName} {/* 또는 file.fileOriginName */}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </S.PostBody>
          </S.PostCard>
            
          <S.ActionButtons>
            <S.ListButton onClick={handleBack}>목록</S.ListButton>
            {/* 작성자 본인만 수정 버튼이 보이게 하려면 백엔드에서 넘겨준 writerId와 로컬스토리지의 empId를 비교하세요 */}
            {post.writerId === JSON.parse(localStorage.getItem('auth-storage'))?.state?.emp?.empId && (
                <S.EditButton onClick={() => navigate(`/board/edit/${post.boardId}`)}>
                  수정
                </S.EditButton>
            )}
            {post.writerId === JSON.parse(localStorage.getItem('auth-storage'))?.state?.emp?.empId && (
             <S.DeleteButton onClick={handleDelete}>
                  <Trash2 size={16} /> 삭제
                </S.DeleteButton>
              )}
          </S.ActionButtons>
        </S.ContentWrapper>
      </S.MainContent>
    </S.PageContainer>
  );
};

export default BoardDetail;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as S from "../QnA/QnA.styled"; // 기존 스타일 재활용
import * as D from './QnADetail.styled'; // 상세 페이지 전용 스타일
import {
  MessageSquare,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  Send,
  Edit3,
  Trash2
} from 'lucide-react';
import { useTheme } from 'styled-components';

const QnADetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false); // 관리자 답변 수정 모드
  const [isEditMode, setIsEditMode] = useState(false);   // 질문 수정 모드

  // 입력 필드 상태
  const [answerText, setAnswerText] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 데이터 페칭
  const fetchQuestionDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const storageData = JSON.parse(localStorage.getItem('auth-storage'));
      const userRole = storageData?.state?.emp?.role;
      const currentEmpId = storageData?.state?.emp?.empId;

      if (userRole === 'AIRLINE_ADMIN') setIsAdmin(true);

      const response = await axios.get(`/api/questions/${id}`);
      const data = response.data;

      setQuestion(data);
      setAnswerText(data.answerContent || '');
      setEditTitle(data.questionTitle);
      setEditContent(data.questionContent);

      if (String(data.questionerId) === String(currentEmpId)) {
        setIsAuthor(true);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      navigate('/qna');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchQuestionDetail();
  }, [fetchQuestionDetail]);

  // 핸들러: 질문 삭제
  const handleQuestionDelete = async () => {
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) return;
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      await axios.delete(`/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("삭제되었습니다.");
      navigate('/qna');
    } catch (error) {
      alert("삭제 실패: 권한이 없거나 오류가 발생했습니다.");
    }
  };

  // 핸들러: 질문 수정 제출
  const handleQuestionUpdate = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      await axios.put(`/api/questions/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("질문이 수정되었습니다.");
      setIsEditMode(false);
      fetchQuestionDetail();
    } catch (error) {
      alert("수정 실패");
    }
  };

  // 핸들러: 답변 등록/수정
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) return alert("답변 내용을 입력해주세요.");
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      await axios.post(`/api/questions/${id}/answers`,
        { content: answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("답변이 등록되었습니다.");
      setIsReplyMode(false);
      fetchQuestionDetail();
    } catch (error) {
      alert("답변 등록 실패");
    }
  };

  if (isLoading) return <S.PageContainer><S.ContentWrapper>로딩 중...</S.ContentWrapper></S.PageContainer>;
  if (!question) return null;

  return (
    <S.PageContainer>
      <S.MainContent>
        <S.ContentWrapper>
          <D.BackButton onClick={() => navigate('/qna')}>
            <ArrowLeft size={20} /> 목록으로 돌아가기
          </D.BackButton>

          <D.DetailHeader>
            {/* 상태 뱃지 및 수정/삭제 버튼 레이아웃 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <D.CategoryBadge
                $bgColor={question.answered ? theme.status.success : theme.status.warning}
                $textColor={question.answered ? theme.text.inverse : theme.text.primary}
              >
                {question.answered ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {question.answered ? '답변완료' : '답변대기'}
              </D.CategoryBadge>

              <div style={{ display: 'flex', gap: '10px' }}>
                {/* 수정 버튼: 작성자이면서 답변 대기 중일 때만 */}
                {isAuthor && !question.answered && (
                  <button onClick={() => setIsEditMode(!isEditMode)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: theme.text.secondary }}>
                    <Edit3 size={18} />
                  </button>
                )}
                {/* 삭제 버튼: 작성자라면 항상 노출 */}
                {isAuthor && (
                  <button onClick={handleQuestionDelete} style={{ border: 'none', background: 'none', cursor: 'pointer', color: theme.status.error }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* 제목 영역 (수정 모드 여부) */}
            {isEditMode ? (
              <input
                style={{ width: '100%', fontSize: '1.5rem', marginTop: '10px', padding: '5px' }}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <D.Title>{question.questionTitle}</D.Title>
            )}

            <D.MetaSection>
              <S.MetaItem><User size={14} /> {question.questionerName}</S.MetaItem>
              <S.MetaItem><Calendar size={14} /> {question.createDate?.split('T')[0]}</S.MetaItem>
            </D.MetaSection>
          </D.DetailHeader>

          {/* 본문 영역 (수정 모드 여부) */}
          {isEditMode ? (
            <div style={{ marginTop: '20px' }}>
              <textarea
                style={{ width: '100%', minHeight: '200px', padding: '10px' }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={() => setIsEditMode(false)}>취소</button>
                <button
                  onClick={handleQuestionUpdate}
                  style={{ backgroundColor: theme.status.success, color: theme.text.inverse, border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  수정완료
                </button>
              </div>
            </div>
          ) : (
            <D.QuestionBody>{question.questionContent}</D.QuestionBody>
          )}

          <D.Divider />

          {/* 답변 영역 */}
          {question.answered ? (
            <D.AnswerSection>
              <D.AnswerHeader>
                <MessageCircle size={20} color={theme.status.success} />
                <h3>관리자 답변</h3>
                <span className="date">{question.answerDate?.split('T')[0]}</span>
                {isAdmin && (
                  <button
                    onClick={() => setIsReplyMode(true)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: theme.text.secondary, cursor: 'pointer' }}
                  >
                    수정
                  </button>
                )}
              </D.AnswerHeader>

              {isReplyMode ? (
                <D.AdminReplyForm>
                  <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows="5" />
                  <div className="btn-group">
                    <button onClick={() => setIsReplyMode(false)}>취소</button>
                    <button className="submit" onClick={handleAnswerSubmit}>수정 완료</button>
                  </div>
                </D.AdminReplyForm>
              ) : (
                <D.AnswerContent>{question.answerContent}</D.AnswerContent>
              )}
            </D.AnswerSection>
          ) : (
            <>
              {isAdmin ? (
                <D.AdminReplyBox>
                  <h3>관리자 답변 작성</h3>
                  <textarea
                    placeholder="답변을 입력하세요..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                  <D.SubmitButton onClick={handleAnswerSubmit}>
                    <Send size={16} /> 답변 등록하기
                  </D.SubmitButton>
                </D.AdminReplyBox>
              ) : (
                <D.NoAnswerBox>
                  <Clock size={40} color={theme.text.disabled} />
                  <p>답변을 준비 중입니다. 잠시만 기다려주세요.</p>
                </D.NoAnswerBox>
              )}
            </>
          )}
        </S.ContentWrapper>
      </S.MainContent>
    </S.PageContainer>
  );
};

export default QnADetail;
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { commonCodeService } from '../../api/commonCode/services';
import { tenantService } from '../../api/tenant/services';
import useAuthStore from '../../store/authStore';
import {
  MainContainer,
  ContentWrapper,
  LeftPanel,
  RightPanel,
  SectionHeader,
  SectionTitle,
  AddButton,
  CodeGroupCard,
  CodeGroupCardHeader,
  CodeGroupTitle,
  CodeGroupSubtitle,
  CodeGroupLabel,
  CodeCountBadge,
  CodeGroupDeleteButton,
  AirlineFilterWrapper,
  AirlineSelectWrapper,
  AirlineSelect,
  SearchInputWrapper,
  SearchIcon,
  SearchInput,
  TableWrapper,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  CodeLink,
  StatusBadge,
  ActionButton,
  EditIcon,
  DeleteIcon,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormActions,
  CancelButton,
  SubmitButton
} from './CommonCodeManagement.styled.js';

const CommonCodeManagement = () => {
  const theme = useTheme();
  const { getRole, emp } = useAuthStore();
  const userRole = getRole();
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'AIRLINE_ADMIN' || userRole === 'ADMIN';
  const airlineId = emp?.airlineId;

  const [searchQuery, setSearchQuery] = useState('');
  const [codeGroups, setCodeGroups] = useState([]);
  const [allCodeGroups, setAllCodeGroups] = useState([]); // 전체 코드 그룹 (필터링 전)
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [selectedCodeName, setSelectedCodeName] = useState('');
  const [codeDetails, setCodeDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // 항공사 필터 관련 (최상위관리자만)
  const [airlines, setAirlines] = useState([]);
  const [selectedAirlineId, setSelectedAirlineId] = useState(null);

  // 모달 상태
  const [showCodeGroupModal, setShowCodeGroupModal] = useState(false);
  const [showCodeDetailModal, setShowCodeDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCodeDetail, setEditingCodeDetail] = useState(null);

  // 폼 상태
  const [codeGroupForm, setCodeGroupForm] = useState({ codeName: '' });
  const [codeDetailForm, setCodeDetailForm] = useState({ codeDetailName: '', codeDesc: '' });

  // 항공사 목록 조회 (최상위관리자만)
  useEffect(() => {
    if (isSuperAdmin) {
      loadAirlines();
    }
  }, [isSuperAdmin]);

  // 코드 그룹 목록 조회
  useEffect(() => {
    loadCodeGroups();
  }, []);

  // 항공사 필터 변경 시 코드 그룹 필터링
  useEffect(() => {
    if (isSuperAdmin && allCodeGroups.length > 0) {
      filterCodeGroupsByAirline();
    }
  }, [selectedAirlineId, allCodeGroups, isSuperAdmin]);

  // 선택한 코드 그룹의 디테일 조회
  useEffect(() => {
    if (selectedCodeId) {
      loadCodeDetails(selectedCodeId);
    } else {
      setCodeDetails([]);
    }
  }, [selectedCodeId]);

  const loadAirlines = async () => {
    try {
      const response = await tenantService.getTenants();
      const airlineList = response.data || [];
      setAirlines(airlineList);
    } catch (error) {
      console.error('항공사 목록 조회 실패:', error);
    }
  };

  const loadCodeGroups = async () => {
    try {
      setLoading(true);
      const response = await commonCodeService.getCodes();
      const codes = response.data?.data || response.data || [];
      setAllCodeGroups(codes);

      // 최상위관리자가 아니면 바로 필터링 없이 표시
      if (!isSuperAdmin) {
        setCodeGroups(codes);
        // 첫 번째 코드 그룹 자동 선택
        if (codes.length > 0 && !selectedCodeId) {
          setSelectedCodeId(codes[0].codeId);
          setSelectedCodeName(codes[0].codeName);
        }
      } else {
        // 최상위관리자는 필터링 적용
        filterCodeGroupsByAirline(codes);
      }
    } catch (error) {
      console.error('코드 그룹 조회 실패:', error);
      alert('코드 그룹을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filterCodeGroupsByAirline = (codesToFilter = null) => {
    const codes = codesToFilter || allCodeGroups;
    let filteredCodes;

    if (!selectedAirlineId) {
      // 전체 선택
      filteredCodes = codes;
    } else {
      // 선택한 항공사 필터링
      filteredCodes = codes.filter(code => code.airlineId === selectedAirlineId);
    }

    setCodeGroups(filteredCodes);

    // 필터링 후 첫 번째 코드 그룹 자동 선택 (선택된 코드가 없거나 선택된 코드가 필터링 결과에 없을 때)
    if (filteredCodes.length > 0) {
      const currentSelectedExists = filteredCodes.some(code => code.codeId === selectedCodeId);
      if (!currentSelectedExists || !selectedCodeId) {
        setSelectedCodeId(filteredCodes[0].codeId);
        setSelectedCodeName(filteredCodes[0].codeName);
      }
    } else {
      // 필터링 결과가 없으면 선택 해제
      setSelectedCodeId(null);
      setSelectedCodeName('');
      setCodeDetails([]);
    }
  };

  const handleAirlineChange = (e) => {
    const airlineId = e.target.value === 'all' ? null : Number(e.target.value);
    setSelectedAirlineId(airlineId);
  };

  const loadCodeDetails = async (codeId) => {
    try {
      setLoading(true);
      const response = await commonCodeService.getCodeDetails(codeId);
      const details = response.data?.data || response.data || [];
      setCodeDetails(details);
    } catch (error) {
      console.error('코드 디테일 조회 실패:', error);
      alert('코드 디테일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeGroupClick = (codeId, codeName) => {
    setSelectedCodeId(codeId);
    setSelectedCodeName(codeName);
  };

  const handleAddCodeGroup = () => {
    if (isSuperAdmin) {
      alert('최상위관리자는 코드 그룹을 추가할 수 없습니다.');
      return;
    }
    setCodeGroupForm({ codeName: '' });
    setShowCodeGroupModal(true);
  };

  const handleSubmitCodeGroup = async () => {
    if (!codeGroupForm.codeName || !codeGroupForm.codeName.trim()) {
      alert('코드 그룹명을 입력해주세요.');
      return;
    }

    try {
      const codeDto = {
        codeName: codeGroupForm.codeName.trim()
      };

      // 관리자인 경우 airlineId 자동 추가
      if (isAdmin && airlineId) {
        codeDto.airlineId = airlineId;
      }

      await commonCodeService.createCode(codeDto);
      alert('코드 그룹이 추가되었습니다.');
      setShowCodeGroupModal(false);
      setCodeGroupForm({ codeName: '' });
      loadCodeGroups();
    } catch (error) {
      console.error('코드 그룹 추가 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코드 그룹 추가에 실패했습니다.';
      alert(errorMsg);
    }
  };

  const handleAddCode = () => {
    if (isSuperAdmin) {
      alert('최상위관리자는 코드를 추가할 수 없습니다.');
      return;
    }
    if (!selectedCodeId) {
      alert('코드 그룹을 먼저 선택해주세요.');
      return;
    }
    setCodeDetailForm({ codeDetailName: '', codeDesc: '' });
    setShowCodeDetailModal(true);
  };

  const handleSubmitCodeDetail = async () => {
    if (!codeDetailForm.codeDetailName || !codeDetailForm.codeDetailName.trim()) {
      alert('코드명을 입력해주세요.');
      return;
    }

    try {
      await commonCodeService.createCodeDetail(selectedCodeId, {
        codeDetailName: codeDetailForm.codeDetailName.trim(),
        codeDesc: codeDetailForm.codeDesc.trim()
      });
      alert('코드가 추가되었습니다.');
      setShowCodeDetailModal(false);
      setCodeDetailForm({ codeDetailName: '', codeDesc: '' });
      loadCodeDetails(selectedCodeId);
    } catch (error) {
      console.error('코드 추가 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코드 추가에 실패했습니다.';
      alert(errorMsg);
    }
  };

  const handleEditCode = (codeDetail) => {
    if (isSuperAdmin) {
      alert('최상위관리자는 코드를 수정할 수 없습니다.');
      return;
    }
    setEditingCodeDetail(codeDetail);
    setCodeDetailForm({
      codeDetailName: codeDetail.codeDetailName || '',
      codeDesc: codeDetail.codeDesc || ''
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!codeDetailForm.codeDetailName || !codeDetailForm.codeDetailName.trim()) {
      alert('코드명을 입력해주세요.');
      return;
    }

    try {
      await commonCodeService.updateCodeDetail(
        selectedCodeId,
        editingCodeDetail.codeDetailId,
        {
          codeDetailName: codeDetailForm.codeDetailName.trim(),
          codeDesc: codeDetailForm.codeDesc.trim()
        }
      );
      alert('코드가 수정되었습니다.');
      setShowEditModal(false);
      setEditingCodeDetail(null);
      setCodeDetailForm({ codeDetailName: '', codeDesc: '' });
      loadCodeDetails(selectedCodeId);
    } catch (error) {
      console.error('코드 수정 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코드 수정에 실패했습니다.';
      alert(errorMsg);
    }
  };

  const handleDeleteCode = async (codeDetail) => {
    if (isSuperAdmin) {
      alert('최상위관리자는 코드를 삭제할 수 없습니다.');
      return;
    }
    if (!confirm(`정말로 "${codeDetail.codeDetailName}" 코드를 삭제하시겠습니까?`)) return;

    try {
      await commonCodeService.deleteCodeDetail(selectedCodeId, codeDetail.codeDetailId);
      alert('코드가 삭제되었습니다.');
      loadCodeDetails(selectedCodeId);
    } catch (error) {
      console.error('코드 삭제 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코드 삭제에 실패했습니다.';
      alert(errorMsg);
    }
  };

  const handleDeleteCodeGroup = async (codeId, codeName, e) => {
    // 카드 클릭 이벤트와 버튼 클릭 이벤트 분리
    e.stopPropagation();

    if (isSuperAdmin) {
      alert('최상위관리자는 코드 그룹을 삭제할 수 없습니다.');
      return;
    }

    if (!confirm(`정말로 "${codeName}" 코드 그룹을 삭제하시겠습니까?\n코드 그룹에 포함된 모든 코드도 함께 삭제됩니다.`)) return;

    try {
      await commonCodeService.deleteCode(codeId);
      alert('코드 그룹이 삭제되었습니다.');

      // 삭제된 코드 그룹이 선택되어 있었다면 선택 해제
      if (selectedCodeId === codeId) {
        setSelectedCodeId(null);
        setSelectedCodeName('');
        setCodeDetails([]);
      }

      loadCodeGroups();
    } catch (error) {
      console.error('코드 그룹 삭제 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코드 그룹 삭제에 실패했습니다.';
      alert(errorMsg);
    }
  };

  // 검색 필터링
  const filteredCodeDetails = codeDetails.filter((detail) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      detail.codeDetailName?.toLowerCase().includes(query) ||
      detail.codeDesc?.toLowerCase().includes(query) ||
      detail.codeDetailId?.toString().includes(query)
    );
  });

  return (
    <MainContainer>
      <ContentWrapper>
        {/* Left Panel - Code Groups */}
        <LeftPanel>
          <SectionHeader>
            <SectionTitle>코드 그룹</SectionTitle>
            {!isSuperAdmin && (
              <AddButton onClick={handleAddCodeGroup}>
                + 그룹 추가
              </AddButton>
            )}
          </SectionHeader>

          {/* 항공사 필터 (최상위관리자만) */}
          {isSuperAdmin && (
            <AirlineFilterWrapper>
              <AirlineSelectWrapper>
                <AirlineSelect
                  value={selectedAirlineId || 'all'}
                  onChange={handleAirlineChange}
                >
                  <option value="all">전체 항공사</option>
                  {airlines.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                      {airline.name}
                    </option>
                  ))}
                </AirlineSelect>
              </AirlineSelectWrapper>
            </AirlineFilterWrapper>
          )}

          {codeGroups.map((group) => (
            <CodeGroupCard
              key={group.codeId}
              onClick={() => handleCodeGroupClick(group.codeId, group.codeName)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedCodeId === group.codeId ?
                  (theme.mode === 'dark' ? `${theme.colors.primary}30` : '#e3f2fd') :
                  theme.background.paper
              }}
            >
              <CodeGroupCardHeader>
                <CodeGroupTitle>{group.codeName}</CodeGroupTitle>
                {!isSuperAdmin && (
                  <CodeGroupDeleteButton
                    onClick={(e) => handleDeleteCodeGroup(group.codeId, group.codeName, e)}
                    title="코드 그룹 삭제"
                  >
                    🗑️
                  </CodeGroupDeleteButton>
                )}
              </CodeGroupCardHeader>
              <CodeGroupSubtitle>{group.airlineName || '공통 코드'}</CodeGroupSubtitle>
              <CodeGroupLabel>{group.airlineName ? `${group.airlineName} ` : '공통'}</CodeGroupLabel>
              <CodeCountBadge>{group.count || 0}개 항목</CodeCountBadge>
            </CodeGroupCard>
          ))}
        </LeftPanel>

        {/* Right Panel - Code List */}
        <RightPanel>
          <SectionHeader>
            <SectionTitle>{selectedCodeName || '코드 그룹을 선택하세요'}</SectionTitle>
            {!isSuperAdmin && (
              <AddButton onClick={handleAddCode} disabled={!selectedCodeId}>
                + 코드 추가
              </AddButton>
            )}
          </SectionHeader>

          {selectedCodeId && (
            <CodeGroupLabel style={{ marginBottom: '16px' }}>
              {codeGroups.find(g => g.codeId === selectedCodeId)?.airlineName || '공통'} 코드
            </CodeGroupLabel>
          )}

          <SearchInputWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="코드, 코드명, 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>

          <TableWrapper>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>순서</TableHeaderCell>
                  <TableHeaderCell>코드</TableHeaderCell>
                  <TableHeaderCell>코드명</TableHeaderCell>
                  <TableHeaderCell>설명</TableHeaderCell>
                  <TableHeaderCell>사용여부</TableHeaderCell>
                  <TableHeaderCell>관리</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      로딩 중...
                    </TableCell>
                  </TableRow>
                ) : filteredCodeDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      {selectedCodeId ? '코드가 없습니다.' : '코드 그룹을 선택해주세요.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCodeDetails.map((detail, index) => (
                    <TableRow key={detail.codeDetailId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <CodeLink>{detail.codeDetailId}</CodeLink>
                      </TableCell>
                      <TableCell>{detail.codeDetailName}</TableCell>
                      <TableCell>{detail.codeDesc || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge $status="사용">
                          사용
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {!isSuperAdmin && (
                          <>
                            <ActionButton onClick={() => handleEditCode(detail)}>
                              <EditIcon>✏️</EditIcon>
                            </ActionButton>
                            <ActionButton onClick={() => handleDeleteCode(detail)}>
                              <DeleteIcon>🗑️</DeleteIcon>
                            </ActionButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableWrapper>
        </RightPanel>
      </ContentWrapper>

      {/* 코드 그룹 추가 모달 */}
      {showCodeGroupModal && (
        <ModalOverlay onClick={() => setShowCodeGroupModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>코드 그룹 추가</ModalTitle>
              <CloseButton onClick={() => setShowCodeGroupModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalContent>
              <FormGroup>
                <FormLabel>코드 그룹명 *</FormLabel>
                <FormInput
                  type="text"
                  value={codeGroupForm.codeName}
                  onChange={(e) => setCodeGroupForm({ ...codeGroupForm, codeName: e.target.value })}
                  placeholder="코드 그룹명을 입력하세요"
                />
              </FormGroup>
              {isAdmin && airlineId && (
                <FormGroup>
                  <FormLabel>항공사 ID</FormLabel>
                  <FormInput
                    type="text"
                    value={airlineId}
                    disabled
                  />
                </FormGroup>
              )}
            </ModalContent>
            <FormActions>
              <CancelButton onClick={() => setShowCodeGroupModal(false)}>취소</CancelButton>
              <SubmitButton onClick={handleSubmitCodeGroup}>추가</SubmitButton>
            </FormActions>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* 코드 디테일 추가 모달 */}
      {showCodeDetailModal && (
        <ModalOverlay onClick={() => setShowCodeDetailModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>코드 추가</ModalTitle>
              <CloseButton onClick={() => setShowCodeDetailModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalContent>
              <FormGroup>
                <FormLabel>코드명 *</FormLabel>
                <FormInput
                  type="text"
                  value={codeDetailForm.codeDetailName}
                  onChange={(e) => setCodeDetailForm({ ...codeDetailForm, codeDetailName: e.target.value })}
                  placeholder="코드명을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>설명</FormLabel>
                <FormTextarea
                  value={codeDetailForm.codeDesc}
                  onChange={(e) => setCodeDetailForm({ ...codeDetailForm, codeDesc: e.target.value })}
                  placeholder="설명을 입력하세요 (선택사항)"
                />
              </FormGroup>
            </ModalContent>
            <FormActions>
              <CancelButton onClick={() => setShowCodeDetailModal(false)}>취소</CancelButton>
              <SubmitButton onClick={handleSubmitCodeDetail}>추가</SubmitButton>
            </FormActions>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* 코드 수정 모달 */}
      {showEditModal && editingCodeDetail && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>코드 수정</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalContent>
              <FormGroup>
                <FormLabel>코드명 *</FormLabel>
                <FormInput
                  type="text"
                  value={codeDetailForm.codeDetailName}
                  onChange={(e) => setCodeDetailForm({ ...codeDetailForm, codeDetailName: e.target.value })}
                  placeholder="코드명을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>설명</FormLabel>
                <FormTextarea
                  value={codeDetailForm.codeDesc}
                  onChange={(e) => setCodeDetailForm({ ...codeDetailForm, codeDesc: e.target.value })}
                  placeholder="설명을 입력하세요 (선택사항)"
                />
              </FormGroup>
            </ModalContent>
            <FormActions>
              <CancelButton onClick={() => setShowEditModal(false)}>취소</CancelButton>
              <SubmitButton onClick={handleSubmitEdit}>수정</SubmitButton>
            </FormActions>
          </ModalContainer>
        </ModalOverlay>
      )}
    </MainContainer>
  );
};

export default CommonCodeManagement;
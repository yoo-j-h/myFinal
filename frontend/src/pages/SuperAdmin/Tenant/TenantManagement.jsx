import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './TenantManagement.styled';
import { tenantService } from '../../../api/tenant/services';

const TenantManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드
  useEffect(() => {
    fetchTenants();
  }, []);

  // 검색어 변경 시 자동 검색 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTenants();
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tenantService.getTenants(searchQuery);
      setTenants(response.data);
    } catch (err) {
      console.error('테넌트 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTenants();
  };

  const handleViewDetail = (tenantId) => {
    navigate(`/super-admin/tenants/${tenantId}`);
  };

  const getStatusText = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'ACTIVE':
        return '정상 서비스 중';
      case 'PAYMENT_PENDING':
        return '결제 중';
      case 'INACTIVE':
        return '미납으로 인한 정지';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'ACTIVE':
        return '✓';
      case 'PAYMENT_PENDING':
        return '⏱';
      case 'INACTIVE':
        return '⚠';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <S.LoadingWrapper>
            <p>데이터를 불러오는 중...</p>
          </S.LoadingWrapper>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  if (error) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <S.ErrorWrapper>
            <p>{error}</p>
            <S.RetryButton onClick={fetchTenants}>
              다시 시도
            </S.RetryButton>
          </S.ErrorWrapper>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  return (
    <S.MainContainer>
      <S.ContentWrapper>
        <S.PageHeader>
          <S.PageTitle>테넌트 총괄</S.PageTitle>
          <S.PageDescription>
            모든 항공사 테넌트의 현황을 관리하고 모니터링할 수 있습니다.
          </S.PageDescription>
        </S.PageHeader>

        <S.ControlBar>
          <S.SearchInputWrapper>
            <S.SearchIcon>🔍</S.SearchIcon>
            <S.SearchInput
              placeholder="항공사명, 테넌트 ID 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </S.SearchInputWrapper>

          <S.ViewToggle>
            <S.ViewButton
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </S.ViewButton>
            <S.ViewButton
              $active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              ☰
            </S.ViewButton>
          </S.ViewToggle>
        </S.ControlBar>

        {viewMode === 'grid' ? (
          <S.GridContainer>
            {tenants.map((tenant) => (
              <S.TenantCard key={tenant.id}>
                <S.CardHeader>
                  <S.TenantIcon>{tenant.icon}</S.TenantIcon>
                  <S.TenantName>{tenant.name}</S.TenantName>
                </S.CardHeader>

                <S.CardBody>
                  <S.TenantId>테넌트 ID: {tenant.id}</S.TenantId>
                  <S.EmployeeCount>활성 직원 수: {(tenant.employeeCount || 0).toLocaleString()}명</S.EmployeeCount>
                </S.CardBody>

                <S.CardFooter>
                  <S.StatusBadge $status={tenant.status}>
                    <S.StatusIcon>{getStatusIcon(tenant.status)}</S.StatusIcon>
                    {getStatusText(tenant.status)}
                  </S.StatusBadge>
                  {/* 🔥 onClick에 tenant.id 전달 */}
                  <S.ViewDetailButton onClick={() => handleViewDetail(tenant.id)}>
                    👁 상세보기
                  </S.ViewDetailButton>
                </S.CardFooter>

                <S.CardActions>
                  <S.ActionButton>⋮</S.ActionButton>
                </S.CardActions>
              </S.TenantCard>
            ))}
          </S.GridContainer>
        ) : (
          <S.TableContainer>
            <S.Table>
              <S.TableHead>
                <S.TableRow>
                  <S.TableHeader>항공사</S.TableHeader>
                  <S.TableHeader>테넌트 ID</S.TableHeader>
                  <S.TableHeader>활성 직원 수</S.TableHeader>
                  <S.TableHeader>상태</S.TableHeader>
                  <S.TableHeader>상세보기</S.TableHeader>
                </S.TableRow>
              </S.TableHead>
              <S.TableBody>
                {tenants.map((tenant) => (
                  <S.TableRow key={tenant.id}>
                    <S.TableCell>
                      <S.TenantInfo>
                        <S.TenantIconSmall>{tenant.icon}</S.TenantIconSmall>
                        <S.TenantNameText>{tenant.name}</S.TenantNameText>
                      </S.TenantInfo>
                    </S.TableCell>
                    <S.TableCell>{tenant.id}</S.TableCell>
                    <S.TableCell>{(tenant.employeeCount || 0).toLocaleString()}명</S.TableCell>
                    <S.TableCell>
                      <S.StatusBadge $status={tenant.status}>
                        <S.StatusIcon>{getStatusIcon(tenant.status)}</S.StatusIcon>
                        {getStatusText(tenant.status)}
                      </S.StatusBadge>
                    </S.TableCell>
                    <S.TableCell>
                      {/* 🔥 onClick에 tenant.id 전달 */}
                      <S.ViewDetailButtonSmall onClick={() => handleViewDetail(tenant.id)}>
                        👁 상세보기
                      </S.ViewDetailButtonSmall>
                    </S.TableCell>
                  </S.TableRow>
                ))}
              </S.TableBody>
            </S.Table>
          </S.TableContainer>
        )}
      </S.ContentWrapper>
    </S.MainContainer>
  );
};

export default TenantManagement;
import React from 'react';
import styled from 'styled-components';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

/**
 * 근태 현황 요약 카드 컴포넌트
 * @param {Object} data - 통계 데이터 { totalEmployees, present, late, absent }
 */
const AttendanceSummaryCards = ({ data }) => {
    // 기본값 설정
    const stats = {
        totalEmployees: data?.totalEmployees || 0,
        present: data?.present || 0,
        late: data?.late || 0,
        absent: data?.absent || 0,
    };

    // 카드 설정
    const cards = [
        {
            label: '전체 직원',
            value: stats.totalEmployees,
            icon: Users,
            bgColor: '#EFF6FF',      // 연한 파란색
            textColor: '#1E40AF',    // 진한 파란색
            iconBgColor: '#DBEAFE',  // 아이콘 배경
        },
        {
            label: '출근',
            value: stats.present,
            icon: CheckCircle,
            bgColor: '#F0FDF4',      // 연한 초록색
            textColor: '#15803D',    // 진한 초록색
            iconBgColor: '#DCFCE7',  // 아이콘 배경
        },
        {
            label: '지각',
            value: stats.late,
            icon: Clock,
            bgColor: '#FFFBEB',      // 연한 노란색
            textColor: '#B45309',    // 진한 주황색
            iconBgColor: '#FEF3C7',  // 아이콘 배경
        },
        {
            label: '결근',
            value: stats.absent,
            icon: AlertCircle,
            bgColor: '#FEF2F2',      // 연한 빨간색
            textColor: '#B91C1C',    // 진한 빨간색
            iconBgColor: '#FEE2E2',  // 아이콘 배경
        },
    ];

    return (
        <CardsContainer>
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index} $bgColor={card.bgColor}>
                        <CardContent>
                            <CardInfo>
                                <CardLabel>{card.label}</CardLabel>
                                <CardValue $color={card.textColor}>{card.value}</CardValue>
                            </CardInfo>
                            <IconWrapper $bgColor={card.iconBgColor}>
                                <Icon size={28} color={card.textColor} strokeWidth={2.5} />
                            </IconWrapper>
                        </CardContent>
                    </Card>
                );
            })}
        </CardsContainer>
    );
};

// ========== Styled Components ==========

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.$bgColor || '#ffffff'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  letter-spacing: 0.3px;
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.$color || '#111827'};
  line-height: 1;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.$bgColor || '#F3F4F6'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export default AttendanceSummaryCards;

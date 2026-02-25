import React from 'react';
import AttendanceSummaryCards from '../components/AttendanceSummaryCards';

/**
 * 사용 예시 컴포넌트
 */
const ExampleUsage = () => {
    // 더미 데이터 (실제로는 API에서 가져옴)
    const attendanceData = {
        totalEmployees: 48,
        present: 42,
        late: 3,
        absent: 3,
    };

    return (
        <div style={{ padding: '24px', background: '#F9FAFB', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
                근태 관리 대시보드
            </h1>

            {/* 근태 현황 요약 카드 */}
            <AttendanceSummaryCards data={attendanceData} />

            {/* 나머지 대시보드 컨텐츠 */}
            <div style={{ marginTop: '32px' }}>
                {/* 다른 컴포넌트들... */}
            </div>
        </div>
    );
};

export default ExampleUsage;

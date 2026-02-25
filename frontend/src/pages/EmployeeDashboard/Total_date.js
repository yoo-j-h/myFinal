const days = ['일', '월', '화', '수', '목', '금', '토'];

export const getTodayString = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = days[today.getDay()];

  return `${year}년 ${month}월 ${date}일 (${day})`;
};

export const getYearString = () => {
  const today = new Date();

  const year = today.getFullYear();

  return `${year}년`;
};

export const getWorkingDaysInMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  
  const lastDay = new Date(year, month + 1, 0).getDate(); // 이번 달 마지막 날짜
  let workingDays = 0;

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    // 0: 일요일, 6: 토요일 제외
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  return workingDays;
};
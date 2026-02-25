package com.kh.ct.global.repository;

import com.kh.ct.global.entity.Alarm;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    List<Alarm> findByReceiver_EmpIdAndAlarmStatus(String empId, CommonEnums.CommonStatus alarmStatus);

    Page<Alarm> findByReceiver_EmpIdOrderByCreateDateDesc(String empId, Pageable pageable);

    long countByReceiver_EmpIdAndAlarmStatus(String empId, CommonEnums.CommonStatus alarmStatus);

    @Query("SELECT a FROM Alarm a WHERE a.receiver.empId = :empId AND a.alarmId > :lastEventId ORDER BY a.createDate ASC")
    List<Alarm> findUnreadNotificationsAfterId(@Param("empId") String empId, @Param("lastEventId") Long lastEventId);
}


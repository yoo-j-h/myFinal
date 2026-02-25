package com.kh.ct.domain.code.repository;

import com.kh.ct.domain.code.dto.CodeDto;
import com.kh.ct.domain.code.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CodeRepository extends JpaRepository<Code, Long> {

    // CODE 목록 + CODE_DETAIL 개수 count (항공사ID 필터링)
    @Query("""
        select new com.kh.ct.domain.code.dto.CodeDto(
            c.codeId,
            c.codeName,
            count(cd),
            c.airlineId
        )
        from Code c
        left join CodeDetail cd on cd.codeId.codeId = c.codeId
        where c.airlineId = :airlineId or c.airlineId is null
        group by c.codeId, c.codeName, c.airlineId
        order by c.codeId
    """)
    List<CodeDto> findCodesWithDetailCountByAirlineId(@Param("airlineId") Long airlineId);

    // CODE 목록 + CODE_DETAIL 개수 count (모든 항공사 - 최상위관리자용)
    @Query("""
        select new com.kh.ct.domain.code.dto.CodeDto(
            c.codeId,
            c.codeName,
            count(cd),
            c.airlineId
        )
        from Code c
        left join CodeDetail cd on cd.codeId.codeId = c.codeId
        group by c.codeId, c.codeName, c.airlineId
        order by c.airlineId, c.codeId
    """)
    List<CodeDto> findCodesWithDetailCount();

    // 동일 airlineId 내 codeName 중복 체크
    boolean existsByCodeNameAndAirlineId(String codeName, Long airlineId);

    // airlineId가 null인 경우 codeName 중복 체크
    boolean existsByCodeNameAndAirlineIdIsNull(String codeName);
}



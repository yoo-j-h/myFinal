package com.kh.ct.domain.code.repository;

import com.kh.ct.domain.code.dto.CodeDetailDto;
import com.kh.ct.domain.code.entity.Code;
import com.kh.ct.domain.code.entity.CodeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CodeDetailRepository extends JpaRepository<CodeDetail, Long> {

    @Query("""
    select new com.kh.ct.domain.code.dto.CodeDetailDto(
        cd.codeDetailId,
        cd.codeId.codeId,
        cd.codeDetailName,
        cd.codeDesc
    )
    from CodeDetail cd
    where cd.codeId.codeId = :codeId
    order by cd.codeDetailId
""")
    List<CodeDetailDto> findDetailDtosByCodeId(@Param("codeId") Long codeId);

    // 동일 code 내 detailName 중복 체크
    boolean existsByCodeIdAndCodeDetailName(Code code, String codeDetailName);

    // 코드 디테일 ID로 조회
    java.util.Optional<CodeDetail> findByCodeDetailIdAndCodeId_CodeId(Long codeDetailId, Long codeId);
}

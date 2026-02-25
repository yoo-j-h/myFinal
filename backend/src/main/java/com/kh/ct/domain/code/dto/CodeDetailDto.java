package com.kh.ct.domain.code.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.domain.code.entity.CodeDetail;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeDetailDto {

    private Long codeDetailId;
    private Long codeId;
    private String codeDetailName;
    private String codeDesc;
    private Date createDate;
    private Date updateDate;

    // JPQL 쿼리용 생성자 (codeId 포함)
    public CodeDetailDto(Long codeDetailId, Long codeId, String codeDetailName, String codeDesc) {
        this.codeDetailId = codeDetailId;
        this.codeId = codeId;
        this.codeDetailName = codeDetailName;
        this.codeDesc = codeDesc;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        // 프론트엔드에서 codeDetailName을 보내므로 명시적으로 매핑
        // @JsonAlias로 code_detail_name도 받을 수 있도록 설정
        @JsonProperty("codeDetailName")
        @JsonAlias("code_detail_name")
        @NotBlank(message = "코드 디테일명(codeDetailName)은 필수입니다.")
        @Size(max = 255, message = "코드 디테일명은 255자 이하여야 합니다.")
        private String codeDetailName;

        // 프론트엔드에서 codeDesc를 보내므로 명시적으로 매핑
        // @JsonAlias로 code_desc도 받을 수 있도록 설정
        @JsonProperty("codeDesc")
        @JsonAlias("code_desc")
        private String codeDesc;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        // 프론트엔드에서 codeDetailName을 보내므로 명시적으로 매핑
        // @JsonAlias로 code_detail_name도 받을 수 있도록 설정
        @JsonProperty("codeDetailName")
        @JsonAlias("code_detail_name")
        @NotBlank(message = "코드 디테일명(codeDetailName)은 필수입니다.")
        @Size(max = 255, message = "코드 디테일명은 255자 이하여야 합니다.")
        private String codeDetailName;

        // 프론트엔드에서 codeDesc를 보내므로 명시적으로 매핑
        // @JsonAlias로 code_desc도 받을 수 있도록 설정
        @JsonProperty("codeDesc")
        @JsonAlias("code_desc")
        private String codeDesc;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class CreateResponse {
        @JsonProperty("code_detail_id")
        private Long codeDetailId;

        @JsonProperty("code_id")
        private Long codeId;

        @JsonProperty("code_detail_name")
        private String codeDetailName;

        @JsonProperty("code_desc")
        private String codeDesc;

        @JsonProperty("create_date")
        private Date createDate;

        @JsonProperty("update_date")
        private Date updateDate;

        public static CreateResponse from(CodeDetail codeDetail) {
            Date createDate = null;
            Date updateDate = null;
            if (codeDetail.getCreateDate() != null) {
                createDate = Date.from(codeDetail.getCreateDate().atZone(java.time.ZoneId.systemDefault()).toInstant());
            }
            if (codeDetail.getUpdateDate() != null) {
                updateDate = Date.from(codeDetail.getUpdateDate().atZone(java.time.ZoneId.systemDefault()).toInstant());
            }

            return CreateResponse.builder()
                    .codeDetailId(codeDetail.getCodeDetailId())
                    .codeId(codeDetail.getCodeId().getCodeId())
                    .codeDetailName(codeDetail.getCodeDetailName())
                    .codeDesc(codeDetail.getCodeDesc())
                    .createDate(createDate)
                    .updateDate(updateDate)
                    .build();
        }
    }
}


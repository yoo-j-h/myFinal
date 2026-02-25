package com.kh.ct.domain.code.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.domain.code.entity.Code;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeDto {

    private Long codeId;
    private String codeName;
    private Long count;
    private Date createDate;
    private Date updateDate;
    private Long airlineId;
    private String airlineName;

    // JPQL 쿼리용 생성자
    public CodeDto(Long codeId, String codeName, Long count, Long airlineId) {
        this.codeId = codeId;
        this.codeName = codeName;
        this.count = count;
        this.airlineId = airlineId;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        // 프론트엔드에서 codeName을 보내므로 명시적으로 매핑
        // @JsonAlias로 code_name도 받을 수 있도록 설정
        @JsonProperty("codeName")
        @JsonAlias("code_name")
        @NotBlank(message = "코드명(codeName)은 필수입니다.")
        @Size(max = 100, message = "코드명은 100자 이하여야 합니다.")
        private String codeName;

        // 프론트엔드에서 airlineId를 보내므로 명시적으로 매핑
        // @JsonAlias로 airline_id도 받을 수 있도록 설정
        @JsonProperty("airlineId")
        @JsonAlias("airline_id")
        private Long airlineId;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class CreateResponse {
        @JsonProperty("code_id")
        private Long codeId;

        @JsonProperty("code_name")
        private String codeName;

        @JsonProperty("count")
        private Long count;

        @JsonProperty("airline_id")
        private Long airlineId;

        @JsonProperty("airline_name")
        private String airlineName;

        @JsonProperty("create_date")
        private Date createDate;

        @JsonProperty("update_date")
        private Date updateDate;

        public static CreateResponse from(Code code, String airlineName) {
            Date createDate = null;
            Date updateDate = null;
            if (code.getCreateDate() != null) {
                createDate = Date.from(code.getCreateDate().atZone(java.time.ZoneId.systemDefault()).toInstant());
            }
            if (code.getUpdateDate() != null) {
                updateDate = Date.from(code.getUpdateDate().atZone(java.time.ZoneId.systemDefault()).toInstant());
            }

            return CreateResponse.builder()
                    .codeId(code.getCodeId())
                    .codeName(code.getCodeName())
                    .count(0L)
                    .airlineId(code.getAirlineId())
                    .airlineName(airlineName)
                    .createDate(createDate)
                    .updateDate(updateDate)
                    .build();
        }
    }
}

package com.kh.ct.domain.health.service.parser;

import com.kh.ct.domain.health.dto.HealthDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.Map.entry;

@Component
public class HealthLabelParser {
    // 라벨별 정규식 (값 그룹은 1번 그룹)
    // - ":" 유무
    // - 공백/줄바꿈 섞임
    // - 단위(kg, cm, %, mg/dL 등) 포함 가능
    private static final Map<String, Pattern> PATTERNS = Map.ofEntries(
            entry("name", Pattern.compile("이\\s*름\\s*[:：]?\\s*(.+?)(?=\\s*(?:생\\s*년\\s*월\\s*일|검\\s*사\\s*일\\s*자|검\\s*사\\s*일|키|체\\s*중|BMI|$))")),
            entry("testDate", Pattern.compile("검\\s*사\\s*일\\s*자\\s*[:：]?\\s*([0-9]{6}|[0-9]{4}[./-][0-9]{1,2}[./-][0-9]{1,2})")),

            entry("height", Pattern.compile("키\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)(?=\\s*(?:cm)?\\s*(?:체\\s*중|BMI|체\\s*지\\s*방|$))")),
            entry("weight", Pattern.compile(
                    "체\\s*중\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:kg)?(?=\\s*(?:BMI|체\\s*지\\s*방|활\\s*력\\s*징\\s*후|혈\\s*당|콜\\s*레\\s*스\\s*테\\s*롤|심\\s*박\\s*수|수\\s*축\\s*기|이\\s*완\\s*기|$))"
            )),

            entry("bloodSugar", Pattern.compile("혈\\s*당\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)(?=\\s*(?:mg\\s*/\\s*dL)?\\s*(?:콜\\s*레\\s*스\\s*테\\s*롤|심\\s*박\\s*수|수\\s*축\\s*기|이\\s*완\\s*기|$))")),

            entry("bpPair", Pattern.compile("(?im)^(?:혈\\s*압)\\s*[:：]?\\s*([0-9]{2,3})\\s*/\\s*([0-9]{2,3})\\s*(?:mmHg)?\\s*$")),
            entry("systolic", Pattern.compile(
                    "수\\s*축\\s*기\\s*혈\\s*압\\s*[:：]?\\s*([0-9]{2,3})(?=\\s*(?:mmHg|\\(|메\\s*모|이\\s*완\\s*기|혈\\s*당|콜\\s*레\\s*스\\s*테\\s*롤|$))"
            )),
            entry("diastolic", Pattern.compile(
                    "이\\s*완\\s*기\\s*혈\\s*압\\s*[:：]?\\s*([0-9]{2,3})(?=\\s*(?:mmHg|\\(|혈\\s*당|콜\\s*레\\s*스\\s*테\\s*롤|추\\s*가\\s*소\\s*견|$))"
            )),

            entry("cholesterol", Pattern.compile(
                    "콜\\s*레\\s*스\\s*테\\s*롤\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:mg\\s*/\\s*dL)?(?=\\s*(?:심\\s*박\\s*수|수\\s*축\\s*기|이\\s*완\\s*기|추\\s*가\\s*소\\s*견|$))"
            )),
            entry("heartRate", Pattern.compile("심\\s*박\\s*수\\s*(?:\\(\\s*bpm\\s*\\))?\\s*[:：]?\\s*([0-9]{2,3})(?=\\s*(?:수\\s*축\\s*기|이\\s*완\\s*기|혈\\s*압|$))")),
            entry("bmi", Pattern.compile("(?i)BMI\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)(?=\\s*(?:체\\s*지\\s*방|혈\\s*당|콜\\s*레\\s*스\\s*테\\s*롤|심\\s*박\\s*수|수\\s*축\\s*기|이\\s*완\\s*기|$))")),
            entry("bodyFat", Pattern.compile(
                    "체\\s*지\\s*방\\s*[:：]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:%|퍼\\s*센\\s*트)?(?=\\s*(?:활\\s*력\\s*징\\s*후|혈\\s*당|콜\\s*레\\s*스\\s*테\\s*롤|심\\s*박\\s*수|수\\s*축\\s*기|이\\s*완\\s*기|$))"
            ))
    );

    public HealthDto.PhysicalTestRequest parse(String rawText) {
        String text = normalize(rawText);

        // 검사일: LocalDate -> LocalDateTime(00:00)
        LocalDateTime testDateTime = findFirst(text, PATTERNS.get("testDate"))
                .map(HealthLabelParser::parseDate)      // LocalDate 반환
                .map(LocalDate::atStartOfDay)           // LocalDateTime 변환
                .orElse(null);

        // 키/체중/혈당 등: 현재 DTO는 Integer이므로 소수는 반올림 처리(정책)
        Integer height = findFirst(text, PATTERNS.get("height"))
                .map(HealthLabelParser::toDecimalRoundedInt) // 아래 유틸 추가
                .orElse(null);

        Integer weightAsWeight = findFirst(text, PATTERNS.get("weight"))
                .map(HealthLabelParser::toDecimalRoundedInt)
                .orElse(null);

        Integer bloodSugar = findFirst(text, PATTERNS.get("bloodSugar"))
                .map(HealthLabelParser::toDecimalRoundedInt)
                .orElse(null);

        Integer cholesterol = findFirst(text, PATTERNS.get("cholesterol"))
                .map(HealthLabelParser::toDecimalRoundedInt)
                .orElse(null);

        Integer heartRate = findFirst(text, PATTERNS.get("heartRate"))
                .map(HealthLabelParser::toInt)
                .orElse(null);

        Integer bmi = findFirst(text, PATTERNS.get("bmi"))
                .map(HealthLabelParser::toDecimalRoundedInt)
                .orElse(null);

        Integer bodyFat = findFirst(text, PATTERNS.get("bodyFat"))
                .map(HealthLabelParser::toDecimalRoundedInt)
                .orElse(null);

        // 혈압: "혈압 120/80" 우선, 없으면 개별 라벨
        Integer systolic = null;
        Integer diastolic = null;

        Matcher bp = PATTERNS.get("bpPair").matcher(text);
        if (bp.find()) {
            systolic = toInt(bp.group(1));
            diastolic = toInt(bp.group(2));
        } else {
            systolic = findFirst(text, PATTERNS.get("systolic")).map(HealthLabelParser::toInt).orElse(null);
            diastolic = findFirst(text, PATTERNS.get("diastolic")).map(HealthLabelParser::toInt).orElse(null);
        }

        // empId/fileId는 파싱 결과가 아니라 서비스에서 주입해야 함 -> 여기서는 null
        return HealthDto.PhysicalTestRequest.builder()
                .empId(null) // 서비스에서 set (예: builder에서 empId(emp))
                .fileId(null) // 서비스에서 set
                .testDate(testDateTime)

                // DTO에 맞춘 매핑
                .height(height)          // 키(cm)
                .weight(weightAsWeight)  // (임시) 체중(kg) ->

                .bloodSugar(bloodSugar)
                .systolicBloodPressure(systolic)
                .diastolicBloodPressure(diastolic)
                .cholesterol(cholesterol)
                .heartRate(heartRate)
                .bmi(bmi)
                .bodyFat(bodyFat)
                .build();
    }

    private static Integer toDecimalRoundedInt(String s) {
        BigDecimal d = toDecimal(s); // 기존 toDecimal 재사용
        if (d == null) return null;
        return d.setScale(0, RoundingMode.HALF_UP).intValue();
    }

    /** PDF 추출 텍스트는 공백/줄바꿈이 난잡해서 정규화가 중요 */
    private String normalize(String s) {
        if (s == null) return "";
        String t = s;

        // 전각 콜론 등 표기 통일
        t = t.replace('：', ':');

        // 탭/연속 공백 정리
        t = t.replace("\u00A0", " ");          // NBSP
        t = t.replaceAll("[\\t\\f\\v]+", " ");
        t = t.replaceAll("[ ]{2,}", " ");

        // 줄 끝 공백 제거
        t = t.replaceAll("(?m)[ ]+$", "");

        return t;
    }

    private static Optional<String> findFirst(String text, Pattern p) {
        Matcher m = p.matcher(text);
        if (!m.find()) return Optional.empty();
        String v = m.group(1);
        return Optional.ofNullable(v).map(String::trim).filter(s -> !s.isBlank());
    }

    private static BigDecimal toDecimal(String s) {
        if (s == null) return null;
        String cleaned = s.replaceAll("[^0-9.]", "");
        if (cleaned.isBlank()) return null;
        return new BigDecimal(cleaned);
    }

    private static Integer toInt(String s) {
        if (s == null) return null;
        String cleaned = s.replaceAll("[^0-9]", "");
        if (cleaned.isBlank()) return null;
        return Integer.parseInt(cleaned);
    }

    private static LocalDate parseDate(String s) {
        if (s == null) return null;
        String v = s.trim();

        // yyMMdd: 250102 -> 2025-01-02
        if (v.matches("\\d{6}")) {
            int yy = Integer.parseInt(v.substring(0, 2));
            int mm = Integer.parseInt(v.substring(2, 4));
            int dd = Integer.parseInt(v.substring(4, 6));
            return LocalDate.of(2000 + yy, mm, dd);
        }

        // yyyy.MM.dd / yyyy-MM-dd / yyyy/MM/dd
        String norm = v.replace('.', '-').replace('/', '-');
        String[] parts = norm.split("-");
        int y = Integer.parseInt(parts[0]);
        int m = Integer.parseInt(parts[1]);
        int d = Integer.parseInt(parts[2]);
        return LocalDate.of(y, m, d);
    }
}

package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.repository.EmpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class EmpNoService {

    private final EmpRepository empRepository;

    private static final String PREFIX = "CT";
    private static final int NUMBER_LENGTH = 4;

    /**
     * 테이블 추가 없이 "연도(prefix) 기준 max(empNo)"를 읽어서 다음 사번을 계산.
     * 포맷: CT-YYYY-LL#### (LL은 AA~ZZ 순차)
     */
    public String previewEmpNo() {
        int year = Year.now().getValue();
        String yearPrefix = PREFIX + "-" + year + "-"; // "CT-2026-"

        String maxEmpNo = empRepository.findMaxEmpNoByYearPrefix(yearPrefix);

        // 기본 시작값
        String nextLetters = "AA";
        int nextNumber = 1;

        if (maxEmpNo != null) {
            Parsed parsed = parseEmpNo(maxEmpNo);

            // 같은 연도 내에서만 증가 (쿼리에서 연도 필터 했으니 사실상 항상 동일)
            if (parsed.number < 9999) {
                nextLetters = parsed.letters;
                nextNumber = parsed.number + 1;
            } else {
                nextLetters = nextLetters(parsed.letters);
                nextNumber = 1;
            }
        }

        String numberPart = String.format("%0" + NUMBER_LENGTH + "d", nextNumber);
        return String.format("%s-%d-%s%s", PREFIX, year, nextLetters, numberPart);
    }

    /**
     * 안전 파싱: "CT-2026-AB0123" -> letters="AB", number=123
     */
    private Parsed parseEmpNo(String empNo) {
        // 기대 포맷: CT-YYYY-LL####  (예: CT-2026-AB0123)
        // '-' 기준 split: ["CT", "2026", "AB0123"]
        String[] parts = empNo.split("-");
        if (parts.length != 3) {
            throw new IllegalStateException("사번 형식이 올바르지 않습니다: " + empNo);
        }
        String tail = parts[2]; // "AB0123"
        if (tail.length() != 2 + NUMBER_LENGTH) {
            throw new IllegalStateException("사번 형식이 올바르지 않습니다: " + empNo);
        }

        String letters = tail.substring(0, 2);
        String numberStr = tail.substring(2);
        int number;
        try {
            number = Integer.parseInt(numberStr);
        } catch (NumberFormatException e) {
            throw new IllegalStateException("사번 숫자부 파싱 실패: " + empNo);
        }

        // letters 검증(대문자 2자리)
        if (!letters.matches("[A-Z]{2}")) {
            throw new IllegalStateException("사번 알파벳부가 올바르지 않습니다: " + empNo);
        }

        return new Parsed(letters, number);
    }

    /**
     * AA -> AB -> ... -> AZ -> BA -> ... -> ZZ
     */
    private String nextLetters(String letters) {
        char first = letters.charAt(0);
        char second = letters.charAt(1);

        if (second < 'Z') {
            second++;
        } else {
            second = 'A';
            first++;
        }

        if (first > 'Z') {
            throw new IllegalStateException("사번 알파벳 범위를 초과했습니다 (ZZ)");
        }

        return "" + first + second;
    }

    private record Parsed(String letters, int number) {}
}

package com.kh.ct.domain.health.service;

import com.kh.ct.domain.health.dto.HealthDto;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfRenderServiceImpl implements PdfRenderService {

    private final SpringTemplateEngine templateEngine;

    @Override
    public byte[] renderHealthReport(HealthDto.HealthReportDto dto, int days) {
        Context ctx = new Context(Locale.KOREA);
        ctx.setVariable("dto", dto);
        ctx.setVariable("days", days);
        ctx.setVariable("generatedAtText",
                dto.getGeneratedAt() == null ? "" :
                        dto.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

        String html = templateEngine.process("report/health-report", ctx);

        html = html.replace("\uFEFF", "").trim();

        log.info("HTML head chars = {}", html.substring(0, Math.min(20, html.length())));
        log.info("HTML head codepoint = {}", (int) html.charAt(0));

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);

            // 한글 폰트(권장): resources/fonts/NotoSansKR-VariableFont_wght.ttf
            builder.useFont(
                    () -> getClass().getResourceAsStream("/fonts/NotoSansKR-VariableFont_wght.ttf"),
                    "NotoSansKR"
            );

            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF 생성 실패", e);
        }
    }
}


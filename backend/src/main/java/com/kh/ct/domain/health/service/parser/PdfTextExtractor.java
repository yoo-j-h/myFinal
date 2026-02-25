package com.kh.ct.domain.health.service.parser;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessRead;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Component
public class PdfTextExtractor {
    public String extract(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        try (InputStream is = file.getInputStream();
             RandomAccessRead rar = new RandomAccessReadBuffer(is);
             PDDocument document = Loader.loadPDF(rar)) {

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);
            return text == null ? "" : text;

        } catch (Exception e) {
            throw new RuntimeException("PDF 텍스트 추출 실패", e);
        }
    }

}

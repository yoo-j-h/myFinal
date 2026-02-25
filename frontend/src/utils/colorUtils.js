/**
 * 색상 유틸리티 함수
 * 항공사 테마 색상을 동적으로 조작하기 위한 헬퍼 함수들
 */

/**
 * Hex 색상을 밝게 만드는 함수
 * @param {string} hex - Hex 색상 코드 (예: "#9ACD32")
 * @param {number} percent - 밝게 할 비율 (기본값: 20%)
 * @returns {string} 밝아진 Hex 색상 코드
 */
export const lightenColor = (hex, percent = 20) => {
    if (!hex) return '#E2E8F0'; // 기본값 (Slate-200)

    // 1. hex -> r, g, b 변환
    let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    // 2. 범위(0~255) 클램핑 및 다시 hex로 변환
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

/**
 * Hex 색상을 어둡게 만드는 함수
 * @param {string} hex - Hex 색상 코드
 * @param {number} percent - 어둡게 할 비율 (기본값: 20%)
 * @returns {string} 어두워진 Hex 색상 코드
 */
export const darkenColor = (hex, percent = 20) => {
    if (!hex) return '#1A202C'; // 기본값 (Gray-900)

    let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;

    return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 + (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0)).toString(16).slice(1);
};

/**
 * 다크 모드용 색상 밝기 자동 조정 함수
 * 채도는 유지하되 밝기를 높여 어두운 배경에서 시인성 향상
 * @param {string} hex - Hex 색상 코드
 * @param {number} percent - 밝기 증가 비율 (기본값: 25%)
 * @returns {string} 조정된 Hex 색상 코드
 */
export const adjustBrightness = (hex, percent = 25) => {
    if (!hex) return '#E2E8F0';

    // Hex를 RGB로 변환
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // RGB를 HSL로 변환
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // 무채색
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    // 밝기(Lightness)를 증가 (채도는 유지)
    l = Math.min(1, l + (percent / 100));

    // HSL을 다시 RGB로 변환
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let r2, g2, b2;
    if (s === 0) {
        r2 = g2 = b2 = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r2 = hue2rgb(p, q, h + 1 / 3);
        g2 = hue2rgb(p, q, h);
        b2 = hue2rgb(p, q, h - 1 / 3);
    }

    // RGB를 Hex로 변환
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
};

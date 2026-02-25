package com.kh.ct.domain.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/valkey")
@RequiredArgsConstructor
public class ValkeyTestController {

    private final StringRedisTemplate redis;

    // 1. 값 저장
    @PostMapping("/set")
    public String setValue(@RequestParam String key,
                           @RequestParam String value,
                           @RequestParam(defaultValue = "60") long ttl) {

        redis.opsForValue().set(key, value, Duration.ofSeconds(ttl));
        return "OK";
    }

    // 2. 값 조회
    @GetMapping("/get")
    public String getValue(@RequestParam String key) {
        return redis.opsForValue().get(key);
    }

    // 3. TTL 확인
    @GetMapping("/ttl")
    public Long getTtl(@RequestParam String key) {
        return redis.getExpire(key);
    }
}
package com.kh.ct.domain.emp.controller;

import com.kh.ct.domain.emp.dto.AirlineDto;
import com.kh.ct.domain.emp.service.AirlineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/tenants")
@RequiredArgsConstructor
public class AirlineController {

    private final AirlineService airlineService;

    @GetMapping
    public ResponseEntity<List<AirlineDto.ListResponse>> getTenants(
            @RequestParam(required = false) String keyword) {
        
        List<AirlineDto.ListResponse> tenants;
        if (keyword != null && !keyword.trim().isEmpty()) {
            tenants = airlineService.searchTenants(keyword);
        } else {
            tenants = airlineService.getAllTenants();
        }
        
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirlineDto.DetailResponse> getTenantDetail(@PathVariable Long id) {
        AirlineDto.DetailResponse tenant = airlineService.getTenantDetail(id);
        return ResponseEntity.ok(tenant);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateTenantStatus(
            @PathVariable Long id,
            @Valid @RequestBody AirlineDto.UpdateStatusRequest request) {
        
        airlineService.updateTenantStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }
}


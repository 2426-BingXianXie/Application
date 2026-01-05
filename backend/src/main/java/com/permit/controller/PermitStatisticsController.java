package com.permit.controller;

import com.permit.dto.PermitStatisticsDto;
import com.permit.entity.base.BasePermit;
import com.permit.service.impl.PermitStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Permit Statistics Controller
 * Provides dashboard statistics and recent permits
 */
@RestController
@RequestMapping("/api/v1/permits")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PermitStatisticsController {

  private final PermitStatisticsService statisticsService;

  @Autowired
  public PermitStatisticsController(PermitStatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  /**
   * Get permit statistics for dashboard
   * GET /api/v1/permits/statistics?timeRange=month
   *
   * @param timeRange "day", "week", "month", "year", or "all"
   * @return PermitStatisticsDto
   */
  @GetMapping("/statistics")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<PermitStatisticsDto> getStatistics(
          @RequestParam(required = false, defaultValue = "month") String timeRange
  ) {
    try {
      PermitStatisticsDto stats = statisticsService.getStatistics(timeRange);
      return ResponseEntity.ok(stats);
    } catch (Exception e) {
      // Return empty statistics if error occurs
      return ResponseEntity.ok(new PermitStatisticsDto());
    }
  }

  /**
   * Get recent permits
   * GET /api/v1/permits/recent?limit=10
   *
   * @param limit Number of recent permits to return
   * @return List of recent permits
   */
  @GetMapping("/recent")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<List<BasePermit>> getRecentPermits(
          @RequestParam(required = false, defaultValue = "10") int limit
  ) {
    try {
      List<BasePermit> recentPermits = statisticsService.getRecentPermits(limit);
      return ResponseEntity.ok(recentPermits);
    } catch (Exception e) {
      // Return empty list if error occurs
      return ResponseEntity.ok(List.of());
    }
  }
}
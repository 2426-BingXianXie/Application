package com.permit.service.impl;

import com.permit.dto.PermitStatisticsDto;
import com.permit.entity.base.BasePermit;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Statistics Service Implementation
 * Provides dashboard statistics for permits using JPA EntityManager
 */
@Service
@Transactional(readOnly = true)
public class PermitStatisticsService {

  @PersistenceContext
  private EntityManager entityManager;

  /**
   * Get permit statistics for dashboard
   *
   * @param timeRange "day", "week", "month", "year", or "all"
   * @return PermitStatisticsDto with statistics
   */
  public PermitStatisticsDto getStatistics(String timeRange) {
    PermitStatisticsDto stats = new PermitStatisticsDto();

    // Calculate date range
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime startDate = calculateStartDate(now, timeRange);
    LocalDateTime previousStartDate = calculatePreviousStartDate(startDate, timeRange);

    // Query all permits in current period
    String currentQuery = "SELECT p FROM BasePermit p WHERE p.createdAt >= :startDate";
    TypedQuery<BasePermit> currentTypedQuery = entityManager.createQuery(currentQuery, BasePermit.class);
    currentTypedQuery.setParameter("startDate", startDate);
    List<BasePermit> currentPermits = currentTypedQuery.getResultList();

    // Calculate current period statistics
    stats.setTotalPermits((long) currentPermits.size());

    long pendingCount = currentPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.SUBMITTED ||
                    p.getStatus() == BasePermit.PermitStatus.UNDER_REVIEW)
            .count();
    stats.setPendingReview(pendingCount);

    long approvedCount = currentPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.APPROVED)
            .count();
    stats.setApproved(approvedCount);

    long rejectedCount = currentPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.REJECTED)
            .count();
    stats.setRejected(rejectedCount);

    long expiredCount = currentPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.EXPIRED)
            .count();
    stats.setExpired(expiredCount);

    // Calculate revenue (placeholder - $100 per permit)
    BigDecimal revenue = BigDecimal.valueOf(currentPermits.size() * 100);
    stats.setRevenue(revenue);

    // Query permits from previous period for comparison
    String previousQuery = "SELECT p FROM BasePermit p WHERE p.createdAt >= :previousStart AND p.createdAt < :currentStart";
    TypedQuery<BasePermit> previousTypedQuery = entityManager.createQuery(previousQuery, BasePermit.class);
    previousTypedQuery.setParameter("previousStart", previousStartDate);
    previousTypedQuery.setParameter("currentStart", startDate);
    List<BasePermit> previousPermits = previousTypedQuery.getResultList();

    // Calculate previous period statistics
    stats.setPreviousTotalPermits((long) previousPermits.size());

    long prevPendingCount = previousPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.SUBMITTED ||
                    p.getStatus() == BasePermit.PermitStatus.UNDER_REVIEW)
            .count();
    stats.setPreviousPendingReview(prevPendingCount);

    long prevApprovedCount = previousPermits.stream()
            .filter(p -> p.getStatus() == BasePermit.PermitStatus.APPROVED)
            .count();
    stats.setPreviousApproved(prevApprovedCount);

    BigDecimal prevRevenue = BigDecimal.valueOf(previousPermits.size() * 100);
    stats.setPreviousRevenue(prevRevenue);

    // Calculate percentage changes
    stats.setTotalPermitsChange(calculatePercentageChange(
            stats.getPreviousTotalPermits(),
            stats.getTotalPermits()
    ));
    stats.setPendingReviewChange(calculatePercentageChange(
            stats.getPreviousPendingReview(),
            stats.getPendingReview()
    ));
    stats.setApprovedChange(calculatePercentageChange(
            stats.getPreviousApproved(),
            stats.getApproved()
    ));
    stats.setRevenueChange(calculatePercentageChange(
            stats.getPreviousRevenue().doubleValue(),
            stats.getRevenue().doubleValue()
    ));

    return stats;
  }

  /**
   * Get recent permits (last N permits)
   */
  public List<BasePermit> getRecentPermits(int limit) {
    String query = "SELECT p FROM BasePermit p ORDER BY p.createdAt DESC";
    TypedQuery<BasePermit> typedQuery = entityManager.createQuery(query, BasePermit.class);
    typedQuery.setMaxResults(limit);
    return typedQuery.getResultList();
  }

  // Helper methods

  private LocalDateTime calculateStartDate(LocalDateTime now, String timeRange) {
    return switch (timeRange.toLowerCase()) {
      case "day" -> now.minusDays(1);
      case "week" -> now.minusWeeks(1);
      case "month" -> now.minusMonths(1);
      case "year" -> now.minusYears(1);
      case "all" -> LocalDateTime.of(2000, 1, 1, 0, 0); // Very old date
      default -> now.minusMonths(1); // default to month
    };
  }

  private LocalDateTime calculatePreviousStartDate(LocalDateTime startDate, String timeRange) {
    return switch (timeRange.toLowerCase()) {
      case "day" -> startDate.minusDays(1);
      case "week" -> startDate.minusWeeks(1);
      case "month" -> startDate.minusMonths(1);
      case "year" -> startDate.minusYears(1);
      case "all" -> LocalDateTime.of(1900, 1, 1, 0, 0); // Even older
      default -> startDate.minusMonths(1);
    };
  }

  private Double calculatePercentageChange(Long oldValue, Long newValue) {
    if (oldValue == null || oldValue == 0) {
      return newValue != null && newValue > 0 ? 100.0 : 0.0;
    }
    return ((newValue - oldValue) * 100.0) / oldValue;
  }

  private Double calculatePercentageChange(Double oldValue, Double newValue) {
    if (oldValue == null || oldValue == 0) {
      return newValue != null && newValue > 0 ? 100.0 : 0.0;
    }
    return ((newValue - oldValue) * 100.0) / oldValue;
  }
}
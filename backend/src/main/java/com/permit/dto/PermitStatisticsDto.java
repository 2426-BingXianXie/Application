package com.permit.dto;

import java.math.BigDecimal;

/**
 * DTO for Permit Statistics Dashboard
 */
public class PermitStatisticsDto {

  private Long totalPermits;
  private Long pendingReview;
  private Long approved;
  private Long rejected;
  private Long expired;
  private BigDecimal revenue;

  // Change percentages
  private Double totalPermitsChange;
  private Double pendingReviewChange;
  private Double approvedChange;
  private Double revenueChange;

  // Previous period stats (for comparison)
  private Long previousTotalPermits;
  private Long previousPendingReview;
  private Long previousApproved;
  private BigDecimal previousRevenue;

  // Constructors
  public PermitStatisticsDto() {
    this.totalPermits = 0L;
    this.pendingReview = 0L;
    this.approved = 0L;
    this.rejected = 0L;
    this.expired = 0L;
    this.revenue = BigDecimal.ZERO;
    this.totalPermitsChange = 0.0;
    this.pendingReviewChange = 0.0;
    this.approvedChange = 0.0;
    this.revenueChange = 0.0;
    this.previousTotalPermits = 0L;
    this.previousPendingReview = 0L;
    this.previousApproved = 0L;
    this.previousRevenue = BigDecimal.ZERO;
  }

  // Getters and Setters
  public Long getTotalPermits() {
    return totalPermits;
  }

  public void setTotalPermits(Long totalPermits) {
    this.totalPermits = totalPermits;
  }

  public Long getPendingReview() {
    return pendingReview;
  }

  public void setPendingReview(Long pendingReview) {
    this.pendingReview = pendingReview;
  }

  public Long getApproved() {
    return approved;
  }

  public void setApproved(Long approved) {
    this.approved = approved;
  }

  public Long getRejected() {
    return rejected;
  }

  public void setRejected(Long rejected) {
    this.rejected = rejected;
  }

  public Long getExpired() {
    return expired;
  }

  public void setExpired(Long expired) {
    this.expired = expired;
  }

  public BigDecimal getRevenue() {
    return revenue;
  }

  public void setRevenue(BigDecimal revenue) {
    this.revenue = revenue;
  }

  public Double getTotalPermitsChange() {
    return totalPermitsChange;
  }

  public void setTotalPermitsChange(Double totalPermitsChange) {
    this.totalPermitsChange = totalPermitsChange;
  }

  public Double getPendingReviewChange() {
    return pendingReviewChange;
  }

  public void setPendingReviewChange(Double pendingReviewChange) {
    this.pendingReviewChange = pendingReviewChange;
  }

  public Double getApprovedChange() {
    return approvedChange;
  }

  public void setApprovedChange(Double approvedChange) {
    this.approvedChange = approvedChange;
  }

  public Double getRevenueChange() {
    return revenueChange;
  }

  public void setRevenueChange(Double revenueChange) {
    this.revenueChange = revenueChange;
  }

  public Long getPreviousTotalPermits() {
    return previousTotalPermits;
  }

  public void setPreviousTotalPermits(Long previousTotalPermits) {
    this.previousTotalPermits = previousTotalPermits;
  }

  public Long getPreviousPendingReview() {
    return previousPendingReview;
  }

  public void setPreviousPendingReview(Long previousPendingReview) {
    this.previousPendingReview = previousPendingReview;
  }

  public Long getPreviousApproved() {
    return previousApproved;
  }

  public void setPreviousApproved(Long previousApproved) {
    this.previousApproved = previousApproved;
  }

  public BigDecimal getPreviousRevenue() {
    return previousRevenue;
  }

  public void setPreviousRevenue(BigDecimal previousRevenue) {
    this.previousRevenue = previousRevenue;
  }
}
package com.permit.entity.base;

import com.permit.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * BasePermit - Abstract base class for all permit types
 * Provides common fields and functionality for Building Permits, Gas Permits, etc.
 *
 * This is a foundational class that will be extended by specific permit types.
 * Uses JOINED inheritance strategy for proper database design.
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "permits", indexes = {
        @Index(name = "idx_permit_number", columnList = "permit_number"),
        @Index(name = "idx_permit_status", columnList = "status"),
        @Index(name = "idx_applicant", columnList = "applicant_id")
})
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class BasePermit {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "permit_id")
  private Long permitId;

  @Column(name = "permit_number", unique = true, length = 50)
  private String permitNumber;

  // Relationship: Many permits belong to one user (applicant)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "applicant_id", nullable = false)
  private User applicant;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private PermitStatus status = PermitStatus.DRAFT;

  @Column(name = "submission_date")
  private LocalDateTime submissionDate;

  @Column(name = "approval_date")
  private LocalDateTime approvalDate;

  @Column(name = "rejection_date")
  private LocalDateTime rejectionDate;

  @Column(name = "expiration_date")
  private LocalDateTime expirationDate;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "rejection_reason", columnDefinition = "TEXT")
  private String rejectionReason;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  /**
   * Permit Status Enum
   */
  public enum PermitStatus {
    DRAFT,
    SUBMITTED,
    UNDER_REVIEW,
    APPROVED,
    REJECTED,
    EXPIRED,
    CANCELLED
  }

  // Constructors

  /**
   * Default constructor
   */
  public BasePermit() {
  }

  /**
   * Constructor with applicant
   */
  public BasePermit(User applicant) {
    this.applicant = applicant;
    this.status = PermitStatus.DRAFT;
  }

  // Abstract methods that subclasses must implement

  /**
   * Get the specific permit type (BUILDING, GAS, etc.)
   * @return Permit type string
   */
  public abstract String getPermitType();

  /**
   * Validate permit data before submission
   * @return true if valid, false otherwise
   */
  public abstract boolean validateForSubmission();

  /**
   * Check if permit is complete and ready for submission
   * @return true if complete
   */
  public abstract boolean isComplete();

  // Business methods

  /**
   * Submit permit for review
   */
  public void submit() {
    if (!isComplete()) {
      throw new IllegalStateException("Permit is not complete and cannot be submitted");
    }
    this.status = PermitStatus.SUBMITTED;
    this.submissionDate = LocalDateTime.now();
  }

  /**
   * Approve permit
   */
  public void approve() {
    if (this.status != PermitStatus.SUBMITTED && this.status != PermitStatus.UNDER_REVIEW) {
      throw new IllegalStateException("Only submitted or under review permits can be approved");
    }
    this.status = PermitStatus.APPROVED;
    this.approvalDate = LocalDateTime.now();
    // Set expiration date (e.g., 1 year from approval)
    this.expirationDate = LocalDateTime.now().plusYears(1);
  }

  /**
   * Reject permit with reason
   */
  public void reject(String reason) {
    if (this.status != PermitStatus.SUBMITTED && this.status != PermitStatus.UNDER_REVIEW) {
      throw new IllegalStateException("Only submitted or under review permits can be rejected");
    }
    this.status = PermitStatus.REJECTED;
    this.rejectionDate = LocalDateTime.now();
    this.rejectionReason = reason;
  }

  /**
   * Cancel permit
   */
  public void cancel() {
    if (this.status == PermitStatus.APPROVED || this.status == PermitStatus.EXPIRED) {
      throw new IllegalStateException("Cannot cancel approved or expired permits");
    }
    this.status = PermitStatus.CANCELLED;
  }

  /**
   * Check if permit is expired
   */
  public boolean isExpired() {
    return this.expirationDate != null &&
            LocalDateTime.now().isAfter(this.expirationDate);
  }

  /**
   * Check if permit is active (approved and not expired)
   */
  public boolean isActive() {
    return this.status == PermitStatus.APPROVED && !isExpired();
  }

  /**
   * Check if permit can be edited
   */
  public boolean canBeEdited() {
    return this.status == PermitStatus.DRAFT;
  }

  /**
   * Check if permit can be submitted
   */
  public boolean canBeSubmitted() {
    return this.status == PermitStatus.DRAFT && isComplete();
  }

  // Getters and Setters

  public Long getPermitId() {
    return permitId;
  }

  public void setPermitId(Long permitId) {
    this.permitId = permitId;
  }

  public String getPermitNumber() {
    return permitNumber;
  }

  public void setPermitNumber(String permitNumber) {
    this.permitNumber = permitNumber;
  }

  public User getApplicant() {
    return applicant;
  }

  public void setApplicant(User applicant) {
    this.applicant = applicant;
  }

  public PermitStatus getStatus() {
    return status;
  }

  public void setStatus(PermitStatus status) {
    this.status = status;
  }

  public LocalDateTime getSubmissionDate() {
    return submissionDate;
  }

  public void setSubmissionDate(LocalDateTime submissionDate) {
    this.submissionDate = submissionDate;
  }

  public LocalDateTime getApprovalDate() {
    return approvalDate;
  }

  public void setApprovalDate(LocalDateTime approvalDate) {
    this.approvalDate = approvalDate;
  }

  public LocalDateTime getRejectionDate() {
    return rejectionDate;
  }

  public void setRejectionDate(LocalDateTime rejectionDate) {
    this.rejectionDate = rejectionDate;
  }

  public LocalDateTime getExpirationDate() {
    return expirationDate;
  }

  public void setExpirationDate(LocalDateTime expirationDate) {
    this.expirationDate = expirationDate;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public String getRejectionReason() {
    return rejectionReason;
  }

  public void setRejectionReason(String rejectionReason) {
    this.rejectionReason = rejectionReason;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  // equals, hashCode, toString

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BasePermit that = (BasePermit) o;
    return Objects.equals(permitId, that.permitId) &&
            Objects.equals(permitNumber, that.permitNumber);
  }

  @Override
  public int hashCode() {
    return Objects.hash(permitId, permitNumber);
  }

  @Override
  public String toString() {
    return "BasePermit{" +
            "permitId=" + permitId +
            ", permitNumber='" + permitNumber + '\'' +
            ", status=" + status +
            ", applicantId=" + (applicant != null ? applicant.getId() : null) +
            ", submissionDate=" + submissionDate +
            ", createdAt=" + createdAt +
            '}';
  }
}
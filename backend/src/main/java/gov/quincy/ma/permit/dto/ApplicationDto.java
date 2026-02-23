package gov.quincy.ma.permit.dto;

import gov.quincy.ma.permit.entity.Application;

import java.time.Instant;
import java.util.Map;

public record ApplicationDto(
    Long id,
    Long applicantId,
    String applicantEmail,
    Long permitTypeId,
    String permitTypeName,
    String permitTypeSlug,
    Application.Status status,
    Map<String, Object> formData,
    Instant submittedAt,
    Instant reviewedAt,
    Long reviewerId,
    String staffNotes,
    Instant createdAt,
    Instant updatedAt
) {
    public static ApplicationDto fromEntity(Application app) {
        return new ApplicationDto(
            app.getId(),
            app.getApplicant() != null ? app.getApplicant().getId() : null,
            app.getApplicant() != null ? app.getApplicant().getEmail() : null,
            app.getPermitType() != null ? app.getPermitType().getId() : null,
            app.getPermitType() != null ? app.getPermitType().getName() : null,
            app.getPermitType() != null ? app.getPermitType().getSlug() : null,
            app.getStatus(),
            app.getFormData(),
            app.getSubmittedAt(),
            app.getReviewedAt(),
            app.getReviewer() != null ? app.getReviewer().getId() : null,
            app.getStaffNotes(),
            app.getCreatedAt(),
            app.getUpdatedAt()
        );
    }
}

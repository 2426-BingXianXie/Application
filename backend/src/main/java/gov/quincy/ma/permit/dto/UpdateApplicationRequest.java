package gov.quincy.ma.permit.dto;

import java.util.Map;

public class UpdateApplicationRequest {

    private Map<String, Object> formData;
    private Boolean submit;   // if true, transition to SUBMITTED
    private String status;    // for staff: UNDER_REVIEW, APPROVED, REJECTED
    private String staffNotes;

    public Map<String, Object> getFormData() {
        return formData;
    }

    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }

    public Boolean getSubmit() {
        return submit;
    }

    public void setSubmit(Boolean submit) {
        this.submit = submit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStaffNotes() {
        return staffNotes;
    }

    public void setStaffNotes(String staffNotes) {
        this.staffNotes = staffNotes;
    }
}

package gov.quincy.ma.permit.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class CreateApplicationRequest {

    @NotNull
    private Long permitTypeId;

    private Map<String, Object> formData;

    private boolean submit; // if true, submit immediately; else save as draft

    public Long getPermitTypeId() {
        return permitTypeId;
    }

    public void setPermitTypeId(Long permitTypeId) {
        this.permitTypeId = permitTypeId;
    }

    public Map<String, Object> getFormData() {
        return formData;
    }

    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }

    public boolean isSubmit() {
        return submit;
    }

    public void setSubmit(boolean submit) {
        this.submit = submit;
    }
}

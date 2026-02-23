package gov.quincy.ma.permit.dto;

import gov.quincy.ma.permit.entity.PermitType;
import java.util.Map;

public class PermitTypeDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String category;
    private Map<String, Object> formSchema;

    public static PermitTypeDto fromEntity(PermitType entity) {
        PermitTypeDto dto = new PermitTypeDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setFormSchema(entity.getFormSchema());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Map<String, Object> getFormSchema() {
        return formSchema;
    }

    public void setFormSchema(Map<String, Object> formSchema) {
        this.formSchema = formSchema;
    }
}

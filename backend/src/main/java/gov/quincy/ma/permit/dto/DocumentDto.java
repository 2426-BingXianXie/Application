package gov.quincy.ma.permit.dto;

import gov.quincy.ma.permit.entity.Document;
import java.time.Instant;

public class DocumentDto {

    private Long id;
    private String name;
    private String category;
    private String mimeType;
    private Instant uploadedAt;

    public static DocumentDto fromEntity(Document doc) {
        DocumentDto dto = new DocumentDto();
        dto.setId(doc.getId());
        dto.setName(doc.getName());
        dto.setCategory(doc.getCategory());
        dto.setMimeType(doc.getMimeType());
        dto.setUploadedAt(doc.getUploadedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}

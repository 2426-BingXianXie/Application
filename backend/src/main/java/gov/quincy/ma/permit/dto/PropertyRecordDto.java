package gov.quincy.ma.permit.dto;

import gov.quincy.ma.permit.entity.PropertyRecord;
import java.util.Map;

public class PropertyRecordDto {

    private Long id;
    private String address;
    private String parcelId;
    private String recordType;
    private Map<String, Object> metadata;

    public static PropertyRecordDto fromEntity(PropertyRecord r) {
        PropertyRecordDto dto = new PropertyRecordDto();
        dto.setId(r.getId());
        dto.setAddress(r.getAddress());
        dto.setParcelId(r.getParcelId());
        dto.setRecordType(r.getRecordType());
        dto.setMetadata(r.getMetadata());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getParcelId() { return parcelId; }
    public void setParcelId(String parcelId) { this.parcelId = parcelId; }
    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}

package gov.quincy.ma.permit.config;

import gov.quincy.ma.permit.entity.PermitType;
import gov.quincy.ma.permit.entity.PropertyRecord;
import gov.quincy.ma.permit.entity.User;
import gov.quincy.ma.permit.repository.PermitTypeRepository;
import gov.quincy.ma.permit.repository.PropertyRecordRepository;
import gov.quincy.ma.permit.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PermitTypeRepository permitTypeRepository;
    private final PropertyRecordRepository propertyRecordRepository;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder,
                      PermitTypeRepository permitTypeRepository,
                      PropertyRecordRepository propertyRecordRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.permitTypeRepository = permitTypeRepository;
        this.propertyRecordRepository = propertyRecordRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User staff = new User();
        staff.setEmail("staff@quincyma.gov");
        staff.setPasswordHash(passwordEncoder.encode("staff123"));
        staff.setName("Quincy Staff");
        staff.setRole(User.Role.STAFF);
        userRepository.save(staff);

        List<Map<String, Object>> permitTypes = List.of(
                Map.of("name", "Accessory Dwelling Unit Application", "slug", "accessory-dwelling-unit", "category", "Online Permit Applications"),
                Map.of("name", "After Hour Special Inspection Request", "slug", "after-hour-special-inspection", "category", "Online Permit Applications"),
                Map.of("name", "Building Permit Application", "slug", "building-permit", "category", "Online Permit Applications"),
                Map.of("name", "Certificate of Inspection Application", "slug", "certificate-of-inspection", "category", "Online Permit Applications"),
                Map.of("name", "Conservation Commission Application", "slug", "conservation-commission", "category", "Online Permit Applications"),
                Map.of("name", "Certificate of Occupancy Application", "slug", "certificate-of-occupancy", "category", "Online Permit Applications"),
                Map.of("name", "D.B.A. Zoning Board Approval Application", "slug", "dba-zoning-board-approval", "category", "Online Permit Applications"),
                Map.of("name", "Electrical Permit Application", "slug", "electrical-permit", "category", "Online Permit Applications"),
                Map.of("name", "Gas Permit Application", "slug", "gas-permit", "category", "Online Permit Applications"),
                Map.of("name", "Paving Permit Application", "slug", "paving-permit", "category", "Online Permit Applications"),
                Map.of("name", "Plumbing Permit Application", "slug", "plumbing-permit", "category", "Online Permit Applications"),
                Map.of("name", "Preliminary Site Plan/Zoning Review - Request For Comments", "slug", "preliminary-site-plan-zoning-review", "category", "Online Permit Applications"),
                Map.of("name", "Quincy Paving License and/or Quincy Builders License Application (New and Renewal)", "slug", "quincy-builders-paving-license", "category", "Online Permit Applications"),
                Map.of("name", "Sheet Metal Permit Application", "slug", "sheet-metal-permit", "category", "Online Permit Applications"),
                Map.of("name", "Short-Term Rental Registration Application", "slug", "short-term-rental-registration", "category", "Online Permit Applications"),
                Map.of("name", "Small Cell Wireless Permit Application", "slug", "small-cell-wireless-permit", "category", "Online Permit Applications"),
                Map.of("name", "Temporary Extension of Premises Permit Application", "slug", "temporary-extension-premises", "category", "Online Permit Applications"),
                Map.of("name", "Ticket Appeal Request Form (Not Traffic Tickets)", "slug", "ticket-appeal-request", "category", "Online Permit Applications"),
                Map.of("name", "Zoning Board of Appeal Application", "slug", "zoning-board-of-appeal", "category", "Online Permit Applications")
        );

        for (Map<String, Object> pt : permitTypes) {
            PermitType type = new PermitType();
            type.setName((String) pt.get("name"));
            type.setSlug((String) pt.get("slug"));
            type.setCategory((String) pt.get("category"));
            type.setDescription("Apply for " + pt.get("name"));
            type.setFormSchema(getFormSchemaForPermit((String) pt.get("slug")));
            permitTypeRepository.save(type);
        }

        for (int i = 1; i <= 5; i++) {
            PropertyRecord pr = new PropertyRecord();
            pr.setAddress(i + " Main Street, Quincy, MA");
            pr.setParcelId("Q" + (1000 + i));
            pr.setRecordType("Residential");
            pr.setMetadata(Map.of("yearBuilt", 1950 + i * 10));
            propertyRecordRepository.save(pr);
        }
    }

    /**
     * Form schemas aligned with Quincy MA Inspectional Services and MA state permit requirements.
     * Includes all elements commonly required on official applications: location, dates, parties,
     * compliance, and affidavits where applicable.
     */
    private static Map<String, Object> getFormSchemaForPermit(String slug) {
        List<Map<String, Object>> fields = switch (slug == null ? "" : slug) {
            case "certificate-of-inspection" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Property Address (Street Name and Number)", "text", true),
                    field("city", "City / Town", "text", true),
                    field("zipCode", "Zip Code", "text", true),
                    field("premiseName", "Exact Name of Premise (to be printed on certificate)", "text", true),
                    field("purposeOfPremise", "Purpose for Which Premise Is Used", "text", true),
                    field("description", "Description of Work", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "building-permit" -> List.of(
                    field("submittalDate", "Submittal Date", "date", true, "Project Details"),
                    field("jobAddress", "Job Address (Street, City, Zip)", "text", true, "Project Details"),
                    field("mapNumber", "Assessor's Map / Parcel Number", "text", false, "Project Details"),
                    field("blockAndLot", "Block and Lot Numbers", "text", false, "Project Details"),
                    field("typeOfWork", "Type of Work", "select", true, "Project Details", List.of("New construction", "Alteration", "Addition", "Repair", "Demolition", "Change of use/occupancy")),
                    field("description", "Description of Work", "textarea", true, "Project Details"),
                    field("existingUse", "Existing Use of Building", "text", true, "Project Details"),
                    field("proposedUse", "Proposed Use of Building", "text", true, "Project Details"),
                    field("numberOfFamilies", "Number of Families", "number", false, "Project Details"),
                    field("estimatedValue", "Estimated Value of Work ($)", "number", true, "Project Details"),
                    field("numberOfFloors", "Number of Floors", "number", false, "Project Details"),
                    field("totalArea", "Total Building Area (sq ft)", "number", false, "Project Details"),
                    field("constructionType", "Construction Type (e.g. VA, VB, IIIA)", "text", false, "Project Details"),
                    field("ownerName", "Owner Name", "text", true, "Party Information"),
                    field("ownerAddress", "Owner Address", "text", true, "Party Information"),
                    field("ownerPhone", "Owner Phone", "tel", true, "Party Information"),
                    field("lesseeStatus", "Lessee (if applicable)", "text", false, "Party Information"),
                    field("contractorName", "Construction Supervisor / Contractor Name", "text", true, "Party Information"),
                    field("contractorAddress", "Contractor Address", "text", false, "Party Information"),
                    field("contractorPhone", "Contractor Phone", "tel", false, "Party Information"),
                    field("contractorLicense", "Contractor License Number", "text", false, "Party Information"),
                    field("hicRegistration", "H.I.C. Registration Number", "text", false, "Party Information"),
                    field("architectEngineer", "Architect / Engineer Name and Contact", "text", false, "Party Information"),
                    field("debrisDisposal", "Debris Disposal Facility", "text", false, "Party Information"),
                    field("zoningCompliance", "Zoning Compliance (describe or N/A)", "textarea", false, "Compliance"),
                    field("historicDistrict", "Historic District (describe or N/A)", "text", false, "Compliance"),
                    field("floodZone", "Flood Zone (describe or N/A)", "text", false, "Compliance"),
                    field("workersCompAffidavit", "I certify Workers' Compensation Insurance as required by MGL c.152 §25C", "checkbox", true, "Affidavits"),
                    field("homeownerAffidavit", "Homeowner Affidavit (if owner-occupant doing work)", "checkbox", false, "Affidavits"),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "electrical-permit", "plumbing-permit", "gas-permit", "sheet-metal-permit" -> List.of(
                    field("submittalDate", "Submittal Date", "date", true),
                    field("address", "Property Address", "text", true),
                    field("ownerName", "Owner Name", "text", true),
                    field("ownerPhone", "Owner Phone", "tel", true),
                    field("ownerEmail", "Owner Email", "email", false),
                    field("contractorName", "Contractor / License Holder Name", "text", true),
                    field("contractorLicense", "License Number", "text", true),
                    field("licenseExpiration", "License Expiration Date", "date", false),
                    field("workType", "Work Type", "select", true, null, List.of("New", "Alteration", "Repair", "Service only")),
                    field("description", "Description of Work", "textarea", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "certificate-of-occupancy" -> List.of(
                    field("applicantName", "Applicant / Owner Name", "text", true),
                    field("address", "Property Address", "text", true),
                    field("ownerMailingAddress", "Owner Mailing Address (if different)", "text", false),
                    field("ownerPhone", "Owner Phone", "tel", true),
                    field("ownerEmail", "Owner Email", "email", true),
                    field("typeOfUse", "Type of Use / Occupancy", "text", true),
                    field("description", "Additional Description", "textarea", false)
            );
            case "short-term-rental-registration" -> List.of(
                    field("operatorName", "Operator Name", "text", true),
                    field("operatorPhone", "Operator Phone", "tel", true),
                    field("operatorEmail", "Operator Email", "email", true),
                    field("unitAddress", "Unit / Property Address", "text", true),
                    field("classification", "Classification", "select", true, null, List.of("Limited share (primary residence, up to 2 bedrooms or 4 guests)", "Home share (primary residence, up to 3 bedrooms and 6 guests)", "Owner-adjacent unit (2- or 3-family, owner resides on site)")),
                    field("localContactName", "Local Contact Name (respond when operator absent)", "text", true),
                    field("localContactPhone", "Local Contact Phone", "tel", true),
                    field("listingUrl", "Listing URL (Airbnb, VRBO, etc.)", "text", false),
                    field("maxOccupants", "Maximum Number of Occupants", "number", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "conservation-commission", "zoning-board-of-appeal", "dba-zoning-board-approval",
                 "preliminary-site-plan-zoning-review" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Property / Project Address", "text", true),
                    field("description", "Description of Project / Request", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "accessory-dwelling-unit" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Property Address", "text", true),
                    field("description", "Description of ADU / Proposed Work", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "after-hour-special-inspection" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Inspection Address", "text", true),
                    field("inspectionType", "Type of Inspection", "text", true),
                    field("requestedDate", "Requested Date and Time", "text", true),
                    field("description", "Reason / Additional Details", "textarea", false),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "paving-permit" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Project Address", "text", true),
                    field("description", "Description of Paving Work", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "quincy-builders-paving-license" -> List.of(
                    field("applicantName", "Applicant / Business Name", "text", true),
                    field("licenseType", "License Type (Paving / Builders / Both)", "text", true),
                    field("applicationType", "Application Type (New / Renewal)", "text", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "small-cell-wireless-permit" -> List.of(
                    field("applicantName", "Applicant / Carrier Name", "text", true),
                    field("address", "Proposed Location Address", "text", true),
                    field("description", "Description of Installation", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "temporary-extension-premises" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Premises Address", "text", true),
                    field("description", "Description of Extension / Use", "textarea", true),
                    field("startDate", "Start Date", "date", true),
                    field("endDate", "End Date", "date", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            case "ticket-appeal-request" -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("ticketNumber", "Ticket / Citation Number", "text", true),
                    field("description", "Reason for Appeal / Explanation", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
            default -> List.of(
                    field("applicantName", "Applicant Name", "text", true),
                    field("address", "Property Address", "text", true),
                    field("description", "Description of Work", "textarea", true),
                    field("contactPhone", "Contact Phone", "tel", true),
                    field("contactEmail", "Contact Email", "email", true)
            );
        };
        Map<String, Object> schema = new HashMap<>();
        schema.put("fields", fields);
        return schema;
    }

    private static Map<String, Object> field(String name, String label, String type, boolean required) {
        return new HashMap<>(Map.of(
                "name", name,
                "label", label,
                "type", type,
                "required", required
        ));
    }

    private static Map<String, Object> field(String name, String label, String type, boolean required, String section) {
        Map<String, Object> m = new HashMap<>(Map.of(
                "name", name,
                "label", label,
                "type", type,
                "required", required
        ));
        if (section != null && !section.isEmpty()) m.put("section", section);
        return m;
    }

    private static Map<String, Object> field(String name, String label, String type, boolean required, String section, List<String> options) {
        Map<String, Object> m = field(name, label, type, required, section);
        if (options != null && !options.isEmpty()) m.put("options", options);
        return m;
    }
}

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
            type.setFormSchema(buildDefaultFormSchema((String) pt.get("name")));
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

    private static Map<String, Object> buildDefaultFormSchema(String permitName) {
        return Map.of(
                "fields", List.of(
                        Map.of("name", "applicantName", "label", "Applicant Name", "type", "text", "required", true),
                        Map.of("name", "address", "label", "Property Address", "type", "text", "required", true),
                        Map.of("name", "description", "label", "Description of Work", "type", "textarea", "required", true),
                        Map.of("name", "contactPhone", "label", "Contact Phone", "type", "tel", "required", true),
                        Map.of("name", "contactEmail", "label", "Contact Email", "type", "email", "required", true)
                )
        );
    }
}

package gov.quincy.ma.permit.service;

import gov.quincy.ma.permit.dto.DocumentDto;
import gov.quincy.ma.permit.entity.Application;
import gov.quincy.ma.permit.entity.Document;
import gov.quincy.ma.permit.repository.ApplicationRepository;
import gov.quincy.ma.permit.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;
    private final Path uploadRoot;

    public DocumentService(DocumentRepository documentRepository,
                           ApplicationRepository applicationRepository,
                           @Value("${app.upload-dir:${java.io.tmpdir}/quincy-uploads}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
        this.uploadRoot = Path.of(uploadDir);
    }

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(uploadRoot);
    }

    public List<DocumentDto> listByCategory(String category) {
        if (category == null || category.isBlank()) {
            return documentRepository.findByApplicationIdIsNullOrderByNameAsc().stream()
                    .map(DocumentDto::fromEntity)
                    .collect(Collectors.toList());
        }
        return documentRepository.findByApplicationIdIsNullAndCategoryOrderByNameAsc(category).stream()
                .map(DocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> searchByName(String name) {
        if (name == null || name.isBlank()) {
            return documentRepository.findByApplicationIdIsNullOrderByNameAsc().stream()
                    .map(DocumentDto::fromEntity)
                    .collect(Collectors.toList());
        }
        return documentRepository.findByApplicationIdIsNullAndNameContainingIgnoreCaseOrderByNameAsc(name).stream()
                .map(DocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<String> listCategories() {
        return documentRepository.findByApplicationIdIsNullOrderByNameAsc().stream()
                .map(Document::getCategory)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Resource getFile(Long id) {
        Document doc = documentRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            Path file = uploadRoot.resolve(doc.getFilePath());
            Resource r = new UrlResource(file.toUri());
            if (!r.exists() || !r.isReadable()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            return r;
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public DocumentDto savePublicDocument(String name, String category, MultipartFile file) {
        try {
            String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
                    : "";
            String storedName = UUID.randomUUID() + ext;
            Path target = uploadRoot.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            Document doc = new Document();
            doc.setName(name != null ? name : file.getOriginalFilename());
            doc.setCategory(category);
            doc.setFilePath(storedName);
            doc.setMimeType(file.getContentType());
            doc = documentRepository.save(doc);
            return DocumentDto.fromEntity(doc);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to store file");
        }
    }

    public List<DocumentDto> findByApplicationId(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId).stream()
                .map(DocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public DocumentDto attachToApplication(Long applicationId, MultipartFile file) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
                    : "";
            String storedName = UUID.randomUUID() + ext;
            Path target = uploadRoot.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            Document doc = new Document();
            doc.setName(file.getOriginalFilename() != null ? file.getOriginalFilename() : storedName);
            doc.setFilePath(storedName);
            doc.setMimeType(file.getContentType());
            doc.setApplication(app);
            doc = documentRepository.save(doc);
            return DocumentDto.fromEntity(doc);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to store file");
        }
    }
}

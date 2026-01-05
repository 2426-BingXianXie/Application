package com.permit.entity;

import com.permit.entity.base.BasePermit;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Building Permit Extended - Concrete implementation of BasePermit
 * Represents building permits with specific building-related fields
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "building_permits")
public class BuildingPermit extends BasePermit {

  @Column(name = "permit_for", length = 50)
  private String permitFor; // NEW_CONSTRUCTION, RENOVATION, etc.

  @Column(name = "building_type", length = 50)
  private String buildingType; // RESIDENTIAL, COMMERCIAL, etc.

  @Column(name = "occupancy_type", length = 50)
  private String occupancyType; // SINGLE_FAMILY, MULTI_FAMILY, etc.

  @Column(name = "project_cost", precision = 15, scale = 2)
  private BigDecimal projectCost;

  @Column(name = "work_description", columnDefinition = "TEXT")
  private String workDescription;

  @Column(name = "tenant_owner_name", length = 255)
  private String tenantOwnerName;

  @Column(name = "tenant_owner_phone", length = 20)
  private String tenantOwnerPhone;

  @Column(name = "tenant_owner_address", columnDefinition = "TEXT")
  private String tenantOwnerAddress;

  @Column(name = "development_title", length = 255)
  private String developmentTitle;

  @Column(name = "property_address", length = 500)
  private String propertyAddress;

  @Column(name = "property_city", length = 100)
  private String propertyCity;

  @Column(name = "property_state", length = 2)
  private String propertyState;

  @Column(name = "property_zip_code", length = 10)
  private String propertyZipCode;

  @Column(name = "parcel_id", length = 50)
  private String parcelId;

  @Column(name = "zoning_classification", length = 50)
  private String zoningClassification;

  @Column(name = "lot_size_sqft")
  private Double lotSizeSqft;

  @Column(name = "has_architect")
  private Boolean hasArchitect = false;

  @Column(name = "has_engineer")
  private Boolean hasEngineer = false;

  @Column(name = "owner_doing_work")
  private Boolean ownerDoingWork = false;

  // Contractor information
  @Column(name = "contractor_name", length = 255)
  private String contractorName;

  @Column(name = "contractor_license_number", length = 50)
  private String contractorLicenseNumber;

  @Column(name = "contractor_phone", length = 20)
  private String contractorPhone;

  @Column(name = "contractor_address", length = 500)
  private String contractorAddress;

  // Debris disposal
  @Column(name = "dumpster_location", length = 255)
  private String dumpsterLocation;

  @Column(name = "disposal_company_name", length = 255)
  private String disposalCompanyName;

  @Column(name = "disposal_method", length = 50)
  private String disposalMethod;

  // Constructors
  public BuildingPermit() {
    super();
  }

  // Implement abstract methods from BasePermit
  @Override
  public String getPermitType() {
    return "BUILDING";
  }

  @Override
  public boolean validateForSubmission() {
    return permitFor != null &&
            projectCost != null &&
            workDescription != null &&
            propertyAddress != null;
  }

  @Override
  public boolean isComplete() {
    return validateForSubmission() &&
            buildingType != null &&
            occupancyType != null;
  }

  // Business logic methods
  public boolean isMajorProject() {
    return projectCost != null && projectCost.compareTo(new BigDecimal("50000")) > 0;
  }

  public boolean requiresProfessionalServices() {
    return isMajorProject() || "COMMERCIAL".equals(buildingType);
  }

  // Getters and Setters
  public String getPermitFor() {
    return permitFor;
  }

  public void setPermitFor(String permitFor) {
    this.permitFor = permitFor;
  }

  public String getBuildingType() {
    return buildingType;
  }

  public void setBuildingType(String buildingType) {
    this.buildingType = buildingType;
  }

  public String getOccupancyType() {
    return occupancyType;
  }

  public void setOccupancyType(String occupancyType) {
    this.occupancyType = occupancyType;
  }

  public BigDecimal getProjectCost() {
    return projectCost;
  }

  public void setProjectCost(BigDecimal projectCost) {
    this.projectCost = projectCost;
  }

  public String getWorkDescription() {
    return workDescription;
  }

  public void setWorkDescription(String workDescription) {
    this.workDescription = workDescription;
  }

  public String getTenantOwnerName() {
    return tenantOwnerName;
  }

  public void setTenantOwnerName(String tenantOwnerName) {
    this.tenantOwnerName = tenantOwnerName;
  }

  public String getTenantOwnerPhone() {
    return tenantOwnerPhone;
  }

  public void setTenantOwnerPhone(String tenantOwnerPhone) {
    this.tenantOwnerPhone = tenantOwnerPhone;
  }

  public String getTenantOwnerAddress() {
    return tenantOwnerAddress;
  }

  public void setTenantOwnerAddress(String tenantOwnerAddress) {
    this.tenantOwnerAddress = tenantOwnerAddress;
  }

  public String getDevelopmentTitle() {
    return developmentTitle;
  }

  public void setDevelopmentTitle(String developmentTitle) {
    this.developmentTitle = developmentTitle;
  }

  public String getPropertyAddress() {
    return propertyAddress;
  }

  public void setPropertyAddress(String propertyAddress) {
    this.propertyAddress = propertyAddress;
  }

  public String getPropertyCity() {
    return propertyCity;
  }

  public void setPropertyCity(String propertyCity) {
    this.propertyCity = propertyCity;
  }

  public String getPropertyState() {
    return propertyState;
  }

  public void setPropertyState(String propertyState) {
    this.propertyState = propertyState;
  }

  public String getPropertyZipCode() {
    return propertyZipCode;
  }

  public void setPropertyZipCode(String propertyZipCode) {
    this.propertyZipCode = propertyZipCode;
  }

  public String getParcelId() {
    return parcelId;
  }

  public void setParcelId(String parcelId) {
    this.parcelId = parcelId;
  }

  public String getZoningClassification() {
    return zoningClassification;
  }

  public void setZoningClassification(String zoningClassification) {
    this.zoningClassification = zoningClassification;
  }

  public Double getLotSizeSqft() {
    return lotSizeSqft;
  }

  public void setLotSizeSqft(Double lotSizeSqft) {
    this.lotSizeSqft = lotSizeSqft;
  }

  public Boolean getHasArchitect() {
    return hasArchitect;
  }

  public void setHasArchitect(Boolean hasArchitect) {
    this.hasArchitect = hasArchitect;
  }

  public Boolean getHasEngineer() {
    return hasEngineer;
  }

  public void setHasEngineer(Boolean hasEngineer) {
    this.hasEngineer = hasEngineer;
  }

  public Boolean getOwnerDoingWork() {
    return ownerDoingWork;
  }

  public void setOwnerDoingWork(Boolean ownerDoingWork) {
    this.ownerDoingWork = ownerDoingWork;
  }

  public String getContractorName() {
    return contractorName;
  }

  public void setContractorName(String contractorName) {
    this.contractorName = contractorName;
  }

  public String getContractorLicenseNumber() {
    return contractorLicenseNumber;
  }

  public void setContractorLicenseNumber(String contractorLicenseNumber) {
    this.contractorLicenseNumber = contractorLicenseNumber;
  }

  public String getContractorPhone() {
    return contractorPhone;
  }

  public void setContractorPhone(String contractorPhone) {
    this.contractorPhone = contractorPhone;
  }

  public String getContractorAddress() {
    return contractorAddress;
  }

  public void setContractorAddress(String contractorAddress) {
    this.contractorAddress = contractorAddress;
  }

  public String getDumpsterLocation() {
    return dumpsterLocation;
  }

  public void setDumpsterLocation(String dumpsterLocation) {
    this.dumpsterLocation = dumpsterLocation;
  }

  public String getDisposalCompanyName() {
    return disposalCompanyName;
  }

  public void setDisposalCompanyName(String disposalCompanyName) {
    this.disposalCompanyName = disposalCompanyName;
  }

  public String getDisposalMethod() {
    return disposalMethod;
  }

  public void setDisposalMethod(String disposalMethod) {
    this.disposalMethod = disposalMethod;
  }

  @Override
  public String toString() {
    return "BuildingPermitExtended{" +
            "permitId=" + getPermitId() +
            ", permitNumber='" + getPermitNumber() + '\'' +
            ", permitFor='" + permitFor + '\'' +
            ", buildingType='" + buildingType + '\'' +
            ", projectCost=" + projectCost +
            ", status=" + getStatus() +
            '}';
  }
}
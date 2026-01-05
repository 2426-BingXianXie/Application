package com.permit.entity;

import com.permit.entity.base.BasePermit;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Gas Permit - Concrete implementation of BasePermit
 * Represents gas permits with specific gas-related fields
 *
 * @author Permit Management System
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "gas_permits")
public class GasPermit extends BasePermit {

  @Column(name = "work_type", length = 50)
  private String workType; // NEW_INSTALLATION, REPAIR, etc.

  @Column(name = "gas_type", length = 50)
  private String gasType; // NATURAL_GAS, PROPANE, etc.

  @Column(name = "installation_type", length = 50)
  private String installationType; // RESIDENTIAL, COMMERCIAL, etc.

  @Column(name = "total_btu_input")
  private Integer totalBtuInput;

  @Column(name = "gas_line_length_feet")
  private Integer gasLineLengthFeet;

  @Column(name = "number_of_appliances")
  private Integer numberOfAppliances;

  @Column(name = "gas_line_size_inches", precision = 5, scale = 2)
  private BigDecimal gasLineSizeInches;

  @Column(name = "project_cost", precision = 15, scale = 2)
  private BigDecimal projectCost;

  @Column(name = "work_description", columnDefinition = "TEXT")
  private String workDescription;

  @Column(name = "appliance_details", columnDefinition = "TEXT")
  private String applianceDetails;

  // Location information
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

  // Safety requirements
  @Column(name = "requires_pressure_test")
  private Boolean requiresPressureTest = false;

  @Column(name = "requires_meter_upgrade")
  private Boolean requiresMeterUpgrade = false;

  @Column(name = "requires_regulator")
  private Boolean requiresRegulator = false;

  @Column(name = "emergency_shutoff_required")
  private Boolean emergencyShutoffRequired = false;

  // Contractor information
  @Column(name = "contractor_name", length = 255)
  private String contractorName;

  @Column(name = "contractor_license_number", length = 50)
  private String contractorLicenseNumber;

  @Column(name = "contractor_phone", length = 20)
  private String contractorPhone;

  @Column(name = "contractor_address", length = 500)
  private String contractorAddress;

  // Constructors
  public GasPermit() {
    super();
  }

  // Implement abstract methods from BasePermit
  @Override
  public String getPermitType() {
    return "GAS";
  }

  @Override
  public boolean validateForSubmission() {
    return workType != null &&
            gasType != null &&
            installationType != null &&
            totalBtuInput != null &&
            workDescription != null &&
            propertyAddress != null;
  }

  @Override
  public boolean isComplete() {
    return validateForSubmission() &&
            gasLineSizeInches != null &&
            contractorName != null &&
            contractorLicenseNumber != null;
  }

  // Business logic methods
  public boolean isCommercialInstallation() {
    return "COMMERCIAL".equals(installationType) ||
            "INDUSTRIAL".equals(installationType);
  }

  public boolean isHighBtuInstallation() {
    return totalBtuInput != null && totalBtuInput > 400000;
  }

  public BigDecimal getMinimumRequiredLineSize() {
    if (totalBtuInput == null) return BigDecimal.ZERO;

    if (totalBtuInput > 200000) return new BigDecimal("1.25");
    if (totalBtuInput > 100000) return new BigDecimal("1.0");
    if (totalBtuInput > 50000) return new BigDecimal("0.75");
    return new BigDecimal("0.5");
  }

  // Getters and Setters
  public String getWorkType() {
    return workType;
  }

  public void setWorkType(String workType) {
    this.workType = workType;
  }

  public String getGasType() {
    return gasType;
  }

  public void setGasType(String gasType) {
    this.gasType = gasType;
  }

  public String getInstallationType() {
    return installationType;
  }

  public void setInstallationType(String installationType) {
    this.installationType = installationType;
  }

  public Integer getTotalBtuInput() {
    return totalBtuInput;
  }

  public void setTotalBtuInput(Integer totalBtuInput) {
    this.totalBtuInput = totalBtuInput;
  }

  public Integer getGasLineLengthFeet() {
    return gasLineLengthFeet;
  }

  public void setGasLineLengthFeet(Integer gasLineLengthFeet) {
    this.gasLineLengthFeet = gasLineLengthFeet;
  }

  public Integer getNumberOfAppliances() {
    return numberOfAppliances;
  }

  public void setNumberOfAppliances(Integer numberOfAppliances) {
    this.numberOfAppliances = numberOfAppliances;
  }

  public BigDecimal getGasLineSizeInches() {
    return gasLineSizeInches;
  }

  public void setGasLineSizeInches(BigDecimal gasLineSizeInches) {
    this.gasLineSizeInches = gasLineSizeInches;
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

  public String getApplianceDetails() {
    return applianceDetails;
  }

  public void setApplianceDetails(String applianceDetails) {
    this.applianceDetails = applianceDetails;
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

  public Boolean getRequiresPressureTest() {
    return requiresPressureTest;
  }

  public void setRequiresPressureTest(Boolean requiresPressureTest) {
    this.requiresPressureTest = requiresPressureTest;
  }

  public Boolean getRequiresMeterUpgrade() {
    return requiresMeterUpgrade;
  }

  public void setRequiresMeterUpgrade(Boolean requiresMeterUpgrade) {
    this.requiresMeterUpgrade = requiresMeterUpgrade;
  }

  public Boolean getRequiresRegulator() {
    return requiresRegulator;
  }

  public void setRequiresRegulator(Boolean requiresRegulator) {
    this.requiresRegulator = requiresRegulator;
  }

  public Boolean getEmergencyShutoffRequired() {
    return emergencyShutoffRequired;
  }

  public void setEmergencyShutoffRequired(Boolean emergencyShutoffRequired) {
    this.emergencyShutoffRequired = emergencyShutoffRequired;
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

  @Override
  public String toString() {
    return "GasPermit{" +
            "permitId=" + getPermitId() +
            ", permitNumber='" + getPermitNumber() + '\'' +
            ", workType='" + workType + '\'' +
            ", gasType='" + gasType + '\'' +
            ", totalBtuInput=" + totalBtuInput +
            ", status=" + getStatus() +
            '}';
  }
}
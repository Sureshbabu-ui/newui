﻿using BeSureApi.Models;
using database.Models;
using database.Seeder.Production;
using database.Seeder.Staging;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Bogus;
using static Bogus.DataSets.Name;
using Microsoft.Extensions.Hosting;
using database.Seeders;
using System.ComponentModel;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Runtime.Intrinsics.X86;
using System;
using System.Data;
using System.Reflection.Metadata;
using System.Security.Cryptography.Xml;
using Bogus.DataSets;
using System.Collections.Generic;
using database.Seeder;

namespace database
{
    public class BeSureDbContext : DbContext
    {
        private object seeder;
        private readonly IWebHostEnvironment _env;

        public BeSureDbContext(DbContextOptions<BeSureDbContext> options, IWebHostEnvironment env) : base(options)
        {
            _env = env;
        }
        public DbSet<ApprovalWorkflow> ApprovalWorkflow { get; set; }
        public DbSet<ApprovalWorkflowDetail> ApprovalWorkflowDetail { get; set; }
        public DbSet<ApprovalRequest> ApprovalRequest { get; set; }
        public DbSet<ApprovalRequestDetail> ApprovalRequestDetail { get; set; }
        public DbSet<Bank> Bank { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<PaymentFrequency> PaymentFrequency { get; set; }
        public DbSet<Tenant> Tenant { get; set; }
        public DbSet<TenantRegion> TenantRegion { get; set; }
        public DbSet<TenantOffice> TenantOffice { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<State> State { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<CustomerInfo> CustomerInfo { get; set; }
        public DbSet<Contract> Contract { get; set; }
        public DbSet<ContractManPower> ContractManPower { get; set; }
        public DbSet<Division> Division { get; set; }
        public DbSet<Designation> Designation { get; set; }
        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<UserLogin> UserLogin { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistory { get; set; }
        public DbSet<UserPasscodeHistory> UserPasscodeHistory { get; set; }
        public DbSet<UserResetPasscode> UserResetPasscode { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<CustomerSite> CustomerSite { get; set; }
        public DbSet<Make> Make { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<PartCategory> PartCategory { get; set; }
        public DbSet<ContractProductCategoryPartNotCovered> ContractProductCategoryPartNotCovered { get; set; }
        public DbSet<Asset> Asset { get; set; }
        public DbSet<ContractAssetDetail> ContractAssetDetail { get; set; }
        public DbSet<ContractAssetSummary> ContractAssetSummary { get; set; }
        public DbSet<ContractDocument> ContractDocument { get; set; }
        public DbSet<ContractCustomerSite> ContractCustomerSite { get; set; }
        public DbSet<PreAmcInspectionSchedule> PreAmcInspectionSchedule { get; set; }
        public DbSet<PreAmcInspectionScheduleUser> PreAmcInspectionScheduleUser { get; set; }
        public DbSet<ServiceRequest> ServiceRequest { get; set; }
        public DbSet<TenantInfo> TenantInfo { get; set; }
        public DbSet<TenantOfficeInfo> TenantOfficeInfo { get; set; }
        public DbSet<BankBranch> BankBranch { get; set; }
        public DbSet<BankBranchInfo> BankBranchInfo { get; set; }
        public DbSet<LocationSetting> LocationSetting { get; set; }
        public DbSet<PartSubCategory> PartSubCategory { get; set; }
        public DbSet<Part> Part { get; set; }
        public DbSet<GstRate> GstRate { get; set; }
        public DbSet<PartProductCategory> PartProductCategory { get; set; }
        public DbSet<BusinessEvent> BusinessEvent { get; set; }
        public DbSet<ContractHistory> ContractHistory { get; set; }
        public DbSet<CustomerGroup> CustomerGroup { get; set; }
        public DbSet<NotificationSetting> NotificationSetting { get; set; }
        public DbSet<ContractManpowerAllocation> ContractManpowerAllocation { get; set; }
        public DbSet<TenantBankAccount> TenantBankAccount { get; set; }
        public DbSet<AppSetting> AppSetting { get; set; }
        public DbSet<ContractInvoiceSchedule> ContractInvoiceSchedule { get; set; }
        public DbSet<ContractInvoice> ContractInvoice { get; set; }
        public DbSet<ContractInvoiceDetail> ContractInvoiceDetail { get; set; }
        public DbSet<Vendor> Vendor { get; set; }
        public DbSet<VendorInfo> VendorInfo { get; set; }
        public DbSet<VendorBranch> VendorBranch { get; set; }
        public DbSet<VendorBankAccount> VendorBankAccount { get; set; }
        public DbSet<AssetProductCategoryPartNotCovered> AssetProductCategoryPartNotCovered { get; set; }
        public DbSet<ContractInvoicePrerequisite> ContractInvoicePrerequisite { get; set; }
        public DbSet<InvoicePrerequisite> InvoicePrerequisite { get; set; }
        public DbSet<BusinessModule> BusinessModule { get; set; }
        public DbSet<BusinessFunction> BusinessFunction { get; set; }
        public DbSet<RoleBusinessFunctionPermission> RoleBusinessFunctionPermission { get; set; }
        public DbSet<ServiceRequestAssignee> ServiceRequestAssignee { get; set; }
        public DbSet<ContractCallStopHistory> contractCallStopHistory { get; set; }
        public DbSet<Invoice> Invoice { get; set; }
        public DbSet<Receipt> Receipt { get; set; }
        public DbSet<InvoiceReceipt> InvoiceReceipt { get; set; }
        public DbSet<ContractBankGuarantee> ContractBankGuarantee { get; set; }
        public DbSet<ContractApprovalFlow> ContractApprovalFlow { get; set; }
        public DbSet<BankCollection> BankCollection { get; set; }
        public DbSet<InvoiceReconciliation> InvoiceReconciliation { get; set; }
        public DbSet<InvoiceReconciliationTdsUpload> InvoiceReconciliationTdsUpload { get; set; }
        public DbSet<InvoiceReconciliationGstTdsUpload> InvoiceReconciliationGstTdsUpload { get; set; }
        public DbSet<SalesRegisterHeader> SalesRegisterHeader { get; set; }
        public DbSet<SalesRegisterDetails> SalesRegisterDetails { get; set; }
        public DbSet<SalesRegisterReturnResponse> SalesRegisterReturnResponse { get; set; }
        public DbSet<StockBin> StockBin { get; set; }
        public DbSet<StockRoom> StockRoom { get; set; }
        public DbSet<MasterEntity> MasterEntity { get; set; }
        public DbSet<MasterEntityData> MasterEntityData { get; set; }
        public DbSet<PartStock> PartStock { get; set; }
        public DbSet<PartIndentRequest> PartIndentRequest { get; set; }
        public DbSet<PartIndentRequestDetail> PartIndentRequestDetail { get; set; }
        public DbSet<ContractInterimAsset> ContractInterimAsset { get; set; }
        public DbSet<PartIndentDemand> PartIndentDemand { get; set; }
        public DbSet<GoodsIssuedReceivedNote> GoodsIssuedReceivedNote { get; set; }
        public DbSet<GoodsIssuedReceivedDetail> GoodsIssuedReceivedDetail { get; set; }       
        public DbSet<ServiceEngineerVisit> serviceEngineerVisit { get; set; }
        public DbSet<ServiceEngineerInfo> ServiceEngineerInfo { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrder { get; set; }
        public DbSet<PurchaseOrderDetail> PurchaseOrderDetail { get; set; }
        public DbSet<GoodsReceivedNote> GoodsReceivedNote { get; set; }
        public DbSet<GoodsReceivedNoteDetail> GoodsReceivedNoteDetail { get; set; }
        public DbSet<GrnTransactionType> GrnTransactionType { get; set; }
        public DbSet<DeliveryChallan> DeliveryChallan { get; set; }
        public DbSet<DeliveryChallanDetail> DeliveryChallanDetail { get; set; }
        public DbSet<PartReturn> PartReturn { get; set; }
        public DbSet<AssetProductCategory> AssetProductCategory { get; set; }
        public DbSet<ContractAssetPmDetail> ContractAssetPmDetail { get; set; }
        public DbSet<PartProductCategoryToPartCategoryMapping> PartProductCategoryToPartCategoryMapping { get; set; }
        public DbSet<PartInstallation>PartInstallation { get; set; }
        public DbSet<ImprestStock> ImprestStock { get; set; }
        public DbSet<DebitNote> DebitNote { get; set; }
        public DbSet<UserBusinessUnit> UserBusinessUnit { get; set; }
        public DbSet<PlannedJob> PlannedJob { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<FailedJob> FailedJob { get; set; }
        public DbSet<DocumentNumberSeries> DocumentNumberSeries { get; set; }
        public DbSet<DocumentNumberFormat> DocumentNumberFormat { get; set; }
        public DbSet<PostalCode> PostalCode { get; set; }
        public DbSet<EventGroup> EventGroup { get; set; }
        public DbSet<ApprovalEvent> ApprovalEvent { get; set; }
        public DbSet<EventConditionMasterTable> EventConditionMasterTable { get; set; }
        public DbSet<EventConditionMasterColumn> EventConditionMasterColumn { get; set; }
        public DbSet<EventCondition> EventCondition { get; set; }
        public DbSet<ContractFutureUpdate> ContractFutureUpdate { get; set; }
        public DbSet<ContractPmSchedule> ContractPmSchedule { get; set; }       

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // below seeders will work in all environments
            modelBuilder.Entity<Designation>().HasData(new DesignationSeeder().GetData());
            modelBuilder.Entity<Division>().HasData(new DivisionSeeder().GetData());
            modelBuilder.Entity<MasterEntity>().HasData(new MasterEntitySeeder().GetData());
            modelBuilder.Entity<MasterEntityData>().HasData(new MasterEntityDataSeeder().GetData());
            modelBuilder.Entity<Role>().HasData(new RoleSeeder().GetData());
            modelBuilder.Entity<Country>().HasData(new CountrySeeder().GetData());
            modelBuilder.Entity<State>().HasData(new StateSeeder().GetData());
            modelBuilder.Entity<City>().HasData(new CitySeeder().GetData());
            modelBuilder.Entity<BusinessEvent>().HasData(new BusinessEventSeeder().GetData());
            modelBuilder.Entity<PaymentFrequency>().HasData(new PaymentFrequencySeeder().GetData());
            modelBuilder.Entity<BusinessModule>().HasData(new BusinessModuleSeeder().GetData());
            modelBuilder.Entity<BusinessFunction>().HasData(new BusinessFunctionSeeder().GetData());
            modelBuilder.Entity<RoleBusinessFunctionPermission>().HasData(new RoleBusinessFunctionPermissionSeeder().GetData());
            modelBuilder.Entity<UserLogin>().HasData(new UserLoginSeeder().GetData());
            modelBuilder.Entity<UserInfo>().HasData(new UserInfoSeeder().GetData());
            modelBuilder.Entity<UserRole>().HasData(new UserRoleSeeder().GetData());
            modelBuilder.Entity<ServiceEngineerInfo>().HasData(new ServiceEngineerInfoSeeder().GetData());
            modelBuilder.Entity<Bank>().HasData(new BankSeeder().GetData());
            modelBuilder.Entity<BankBranch>().HasData(new BankBranchSeeder().GetData());
            modelBuilder.Entity<BankBranchInfo>().HasData(new BankBranchInfoSeeder().GetData());
            modelBuilder.Entity<TenantRegion>().HasData(new TenantRegionSeeder().GetData());
            modelBuilder.Entity<Tenant>().HasData(new TenantSeeder().GetData());
            modelBuilder.Entity<TenantOffice>().HasData(new TenantOfficeSeeder().GetData());
            modelBuilder.Entity<TenantInfo>().HasData(new TenantInfoSeeder().GetData());
            modelBuilder.Entity<LocationSetting>().HasData(new LocationSettingSeeder().GetData());
            modelBuilder.Entity<TenantOfficeInfo>().HasData(new TenantOfficeInfoSeeder().GetData());
            modelBuilder.Entity<GstRate>().HasData(new GstRateSeeder().GetData());
            //modelBuilder.Entity<NotificationSetting>().HasData(new NotificationSettingSeeder().GetData());
            modelBuilder.Entity<TenantBankAccount>().HasData(new TenantBankAccountSeeder().GetData());
            modelBuilder.Entity<AppSetting>().HasData(new AppSettingSeeder().GetData());
            modelBuilder.Entity<InvoicePrerequisite>().HasData(new InvoicePrerequisiteSeeder().GetData());
            modelBuilder.Entity<StockRoom>().HasData(new StockRoomSeeder().GetData());
            modelBuilder.Entity<ContractApprovalFlow>().HasData(new ContractApprovalFlowSeeder().GetData());
            modelBuilder.Entity<GrnTransactionType>().HasData(new GrnTransactionTypeSeeder().GetData());
            modelBuilder.Entity<GoodsReceivedNote>(entity => entity.HasCheckConstraint("CK_GRN_PO_Eng_Loc", "(((case when [SourceVendorId] IS NULL then (0) else (1) end+case when [SourceLocationId] IS NULL then (0) else (1) end+case when [SourceEngineerId] IS NULL then (0) else (1) end)=(1)))"));
            modelBuilder.Entity<AssetProductCategory>().HasData(new AssetProductCategorySeeder().GetData());
            modelBuilder.Entity<PartProductCategory>().HasData(new PartProductCategorySeeder().GetData());
            modelBuilder.Entity<PartCategory>().HasData(new PartCategorySeeder().GetData());
            modelBuilder.Entity<AssetProductCategoryPartNotCovered>().HasData(new AssetProductCategoryPartNotCoveredSeeder().GetData());
            modelBuilder.Entity<Make>().HasData(new MakeSeeder().GetData());
            modelBuilder.Entity<PartSubCategory>().HasData(new PartSubCategorySeeder().GetData());
            modelBuilder.Entity<PartProductCategoryToPartCategoryMapping>().HasData(new PartProductCategoryToPartCategoryMappingSeeder().GetData());
            modelBuilder.Entity<ApprovalWorkflow>().HasData(new ApprovalWorkflowSeeder().GetData());
            modelBuilder.Entity<EventGroup>().HasData(new EventGroupSeeder().GetData());
            modelBuilder.Entity<ApprovalEvent>().HasData(new ApprovalEventSeeder().GetData());
            modelBuilder.Entity<EventConditionMasterTable>().HasData(new EventConditionMasterTableSeeder().GetData());
            modelBuilder.Entity<EventConditionMasterColumn>().HasData(new EventConditionMasterColumnSeeder().GetData());
            modelBuilder.Entity<DocumentNumberSeries>().HasData(new DocumentNumberSeriesSeeder().GetData());
            modelBuilder.Entity<DocumentNumberFormat>().HasData(new DocumentNumberFormatSeeder().GetData());
            if (_env.IsStaging() || _env.IsDevelopment())
            {
                //seeders below will work only on the testing/ development environment
                modelBuilder.Entity<Customer>().HasData(new CustomerSeeder().GetData());
                modelBuilder.Entity<CustomerInfo>().HasData(new CustomerInfoSeeder().GetData());
                modelBuilder.Entity<Contract>().HasData(new ContractSeeder().GetData());
                modelBuilder.Entity<ContractManPower>().HasData(new ContractManPowerSeeder().GetData());
                modelBuilder.Entity<CustomerSite>().HasData(new CustomerSiteSeeder().GetData());
                modelBuilder.Entity<Product>().HasData(new ProductSeeder().GetData());
                modelBuilder.Entity<Part>().HasData(new PartSeeder().GetData());
                modelBuilder.Entity<PartStock>().HasData(new PartStockSeeder().GetData());
                modelBuilder.Entity<ContractProductCategoryPartNotCovered>().HasData(new ContractProductCategoryPartNotCoveredSeeder().GetData());
                modelBuilder.Entity<Asset>().HasData(new AssetSeeder().GetData());
                modelBuilder.Entity<ContractAssetDetail>().HasData(new ContractAssetDetailSeeder().GetData());
                modelBuilder.Entity<ContractAssetSummary>().HasData(new ContractAssetSummarySeeder().GetData());
                modelBuilder.Entity<ContractCustomerSite>().HasData(new ContractCustomerSiteSeeder().GetData());
                modelBuilder.Entity<ContractDocument>().HasData(new ContractDocumentSeeder().GetData());
                modelBuilder.Entity<ServiceRequest>().HasData(new ServiceRequestSeeder().GetData());
                modelBuilder.Entity<CustomerGroup>().HasData(new CustomerGroupSeeder().GetData());
                modelBuilder.Entity<ContractManpowerAllocation>().HasData(new ContractManpowerAllocationSeeder().GetData());
                modelBuilder.Entity<Vendor>().HasData(new VendorSeeder().GetData());
                modelBuilder.Entity<VendorInfo>().HasData(new VendorInfoSeeder().GetData());
                modelBuilder.Entity<VendorBranch>().HasData(new VendorBranchSeeder().GetData());
                //modelBuilder.Entity<DocumentNumberSeries>().HasData(new DocumentNumberSeriesSeeder().GetData());
                //modelBuilder.Entity<DocumentNumberFormat>().HasData(new DocumentNumberFormatSeeder().GetData());
                modelBuilder.Entity<PostalCode>().HasData(new PostalCodeSeeder().GetData());
                  }

            ApplyDefaultValues(modelBuilder);
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }


        private void ApplyDefaultValues(ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entity.GetProperties())
                {
                    var defaultValueAttr = property.PropertyInfo?.GetCustomAttribute<DefaultValueAttribute>();
                    if (defaultValueAttr != null)
                    {
                        property.SetDefaultValue(defaultValueAttr.Value);
                    }
                }
            }
        }
    }
}
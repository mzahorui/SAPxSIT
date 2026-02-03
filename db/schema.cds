namespace com.schwarz.vendor;
using { cuid } from '@sap/cds/common';

entity Suppliers : cuid {
  legalName                : String(255);
  tradingName              : String(255);
  companyRegistrationNumber: String(50);
  placeOfRegistration      : String(100);
  dunsNumber               : String(20);

  registeredOfficeAddress  : String(500);
  billingAddress           : String(500);

  primaryContactName       : String(120);
  primaryContactTitle      : String(80);
  primaryContactPhone      : String(40);
  primaryContactEmail      : String(255);

  poRecipientEmail         : String(255);
  arContactEmail           : String(255);

  vatId                    : String(30);
  taxId                    : String(60);
  taxResidencyCertificate  : Boolean default false;
  w8beneForm               : Boolean default false;
  w9Form                   : Boolean default false;
  eoriNumber               : String(30);

  accountHolderName        : String(255);
  bankName                 : String(255);
  bankBranchAddress        : String(255);
  iban                     : String(34);
  swiftBic                 : String(20);
  routingNumber            : String(20);
  sortCode                 : String(20);

  preferredCurrency        : String(3);
  standardPaymentTerms     : String(60);
}

entity Orders : cuid {
  orderNumber        : String(30);
  orderDate          : Date;
  expectedDeliveryDate: Date;
  status             : String(30);

  netAmount          : Decimal(13,2);
  taxAmount          : Decimal(13,2);
  grossAmount        : Decimal(13,2);
  currency           : String(3);

  paymentTerms       : String(60);
  incoterms          : String(20);
  itemsCount         : Integer;

  supplier           : Association to Suppliers;
}

using CatalogService from './catalog-service';

annotate CatalogService.Orders with @UI.SelectionFields: [orderNumber];

annotate CatalogService.Orders with @UI.LineItem: [
  { $Type: 'UI.DataField', Value: orderNumber, Label: 'Order ID' },
  { $Type: 'UI.DataField', Value: status, Label: 'Status' },
  { $Type: 'UI.DataField', Value: supplier.primaryContactName, Label: 'Primary Contact' },
  { $Type: 'UI.DataField', Value: supplier.primaryContactEmail, Label: 'Contact Email' },
  { $Type: 'UI.DataField', Value: supplier.primaryContactPhone, Label: 'Contact Phone' }
];

annotate CatalogService.Orders with @UI.HeaderInfo: {
  TypeName: 'Order',
  TypeNamePlural: 'Orders',
  Title: { Value: orderNumber },
  Description: { Value: status }
};

annotate CatalogService.Orders with @UI.Facets: [
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Order Details',
    Target: '@UI.FieldGroup#Order'
  },
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Supplier Contact',
    Target: '@UI.FieldGroup#SupplierContact'
  }
];

annotate CatalogService.Orders with @UI.FieldGroup #Order: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { $Type: 'UI.DataField', Value: orderNumber, Label: 'Order ID' },
    { $Type: 'UI.DataField', Value: status, Label: 'Status' },
    { $Type: 'UI.DataField', Value: orderDate, Label: 'Order Date' },
    { $Type: 'UI.DataField', Value: expectedDeliveryDate, Label: 'Expected Delivery' },
    { $Type: 'UI.DataField', Value: grossAmount, Label: 'Gross Amount' },
    { $Type: 'UI.DataField', Value: currency, Label: 'Currency' }
  ]
};

annotate CatalogService.Orders with @UI.FieldGroup #SupplierContact: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { $Type: 'UI.DataField', Value: supplier.primaryContactName, Label: 'Name' },
    { $Type: 'UI.DataField', Value: supplier.primaryContactTitle, Label: 'Title' },
    { $Type: 'UI.DataField', Value: supplier.primaryContactPhone, Label: 'Phone' },
    { $Type: 'UI.DataField', Value: supplier.primaryContactEmail, Label: 'Email' }
  ]
};

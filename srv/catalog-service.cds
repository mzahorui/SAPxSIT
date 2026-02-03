using { com.schwarz.vendor as db } from '../db/schema';

service CatalogService {
  entity Orders as projection on db.Orders;
  entity Suppliers as projection on db.Suppliers;
}

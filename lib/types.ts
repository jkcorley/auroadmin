export interface Laundromat {
  "Laundromat ID": string
  "Place ID": string
  Neighborhood: string
  Name: string
  Latitude: number
  Longitude: number
  Rating: string
  "Total User Ratings": string
  Address: string
  Phone: string
  "Hours of Operation": string
  "Accessible?": string
  "Photo Reference": string
  "Google Maps URL": string
  "Top Review Text": string
  "Top Review Rating": string
  "Top Review Author": string
  "Original Query": string
  Borough: string | null
}

export interface Driver {
  "Driver ID": string
  "Full Name": string
  Email: string
  "Phone Number": string
  "Vehicle Type": string
  "License Plate": string
  "Current Status": string
  "Is Active": string
  "Date Registered": string
  "Last Status Update": string
  "Admin Notes": string
}

export interface User {
  "User ID": string
  "Phone Number": number
  "PIN Hash": string
  "Full Name": string
  Email: string
  "Default Pickup Address Street": string
  "Default Pickup Address City": string | null
  "Default Pickup Address State": string | null
  "Default Pickup Address Zip": string | null
  "Default Delivery Address Street": string | null
  "Default Delivery Address City": string | null
  "Default Delivery Address State": string | null
  "Default Delivery Address Zip": string | null
  "Preferred Laundromat ID": string | null
  "User Role": string
  "Account Status": string
  "Date Registered": string
  "Last Login Timestamp": string | null
  "Admin Notes User": string
}

export interface Booking {
  "Booking ID": string
  "User ID": string
  "User Full Name Snapshot": string
  "User Phone Snapshot": string
  "Participating Laundromat ID": string
  "Laundromat Name Snapshot": string
  "Service Type ID": string
  "Service Name Snapshot": string
  "Service Category ID Snapshot": string
  "Booking Creation Timestamp": string
  "Current Booking Status": string
  "Estimated Cost": string
  "Actual Cost": string | null
  "Payment Status": string
  "Last Status Update Timestamp": string
}

export interface SupplyOrder {
  "Supply Order ID": string
  "User ID": string
  "User Full Name Snapshot": string
  "Order Timestamp": string
  "Delivery Address Street": string
  "Delivery Address City": string
  "Delivery Address State": string
  "Delivery Address Zip": string
  "Subtotal Amount": string
  "Total Order Amount": string
  "Order Status": string
  "Payment Status": string
  "Payment Method Snapshot": string
  "Last Updated Timestamp": string
}

export interface ServiceType {
  Service_Type_ID: string
  Service_Category_ID: string
  Service_Name: string
  Service_Description: string
  Pricing_Model: string
  Price: string
  Unit_Name: string
  Is_Active: string
  Date_Created: string
}

export interface ServiceCategory {
  "Service Category ID": string
  "Category Name": string
  "Category Description": string
  "Default Pricing Model": string
  "Is Active": string
}

export interface Machine {
  "Participating Laundromat ID": string
  "Laundromat Name": string
  Address: string
  "Phone Number": string
  "Hours of Operation": string
  "Contact Person": string
  "Contact Email": string
  "Onboarding Date": string
  "Contract Status": string
  "Payment Terms": string
  "Commission Rate": string
  "Average Monthly Revenue": string
  "Last Revenue Update": string
  "Admin Notes": string
  // We'll use this as machine data - each participating laundromat represents machines
}

export interface OrderItem {
  "Order Item ID": string
  "Supply Order ID": string
  "Product ID": string
  "Product Name Snapshot": string
  "Quantity Ordered": string
  "Unit Price Snapshot": string
  "Item Total": string
}

export interface Product {
  "Product ID": string
  "Product Name": string
  "Product Description": string
  Category: string
  "Unit Price": string
  "Stock Quantity": string
  "Unit of Measure": string
  "Supplier Name": string
  "Supplier Contact": string
  "Product Image URL": string
  "Is Active": string
  "Date Added": string
  "Last Updated": string
}

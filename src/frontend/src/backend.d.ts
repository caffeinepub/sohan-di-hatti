import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ShopOrder {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    createdAt: Time;
    totalAmount: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface OrderItem {
    productId: bigint;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface ContactQuery {
    id: bigint;
    name: string;
    createdAt: Time;
    email: string;
    message: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
    isBestSeller: boolean;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<ShopOrder>;
    getProduct(productId: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listBestSellers(): Promise<Array<Product>>;
    listContactQueries(): Promise<Array<ContactQuery>>;
    listOrders(): Promise<Array<ShopOrder>>;
    listProducts(): Promise<Array<Product>>;
    listProductsByCategory(category: string): Promise<Array<Product>>;
    placeOrder(order: ShopOrder): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<void>;
    submitContactQuery(contactQuery: ContactQuery): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}

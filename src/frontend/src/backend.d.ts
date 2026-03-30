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
export interface Order {
    id: bigint;
    preferred_date: string;
    service_type: string;
    name: string;
    email: string;
    product_interest: string;
    address: string;
    notes: string;
    timestamp: Time;
    phone: string;
}
export interface Review {
    id: bigint;
    name: string;
    stars: bigint;
    message: string;
    timestamp: Time;
}
export interface backendInterface {
    getAllOrders(password: string): Promise<Array<Order> | null>;
    getAllReviews(password: string): Promise<Array<Review> | null>;
    submitOrder(name: string, phone: string, email: string, service_type: string, product_interest: string, address: string, preferred_date: string, notes: string): Promise<boolean>;
    submitReview(name: string, stars: bigint, message: string): Promise<boolean>;
    verifyAdmin(password: string): Promise<boolean>;
}

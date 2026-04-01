import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    id: bigint;
    name: string;
    message: string;
    timestamp: Time;
    sessionId: string;
    reply?: string;
}
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
    getAllChatMessages(): Promise<Array<ChatMessage>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllReviews(): Promise<Array<Review>>;
    getChatMessagesBySession(sessionId: string): Promise<Array<ChatMessage>>;
    replyToChat(id: bigint, reply: string): Promise<boolean>;
    sendChatMessage(name: string, sessionId: string, message: string): Promise<boolean>;
    submitOrder(name: string, phone: string, email: string, service_type: string, product_interest: string, address: string, preferred_date: string, notes: string): Promise<boolean>;
    submitReview(name: string, stars: bigint, message: string): Promise<boolean>;
}

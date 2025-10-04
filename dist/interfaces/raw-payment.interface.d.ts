export interface RawPayment {
    id_: string;
    amount: number;
    userId: string;
    productId: string;
    confirmed: boolean;
    timestamp: string;
}

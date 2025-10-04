export interface ProcessedData {
    id: string;
    type: 'PRODUCT' | 'USER' | 'PAYMENT';
    timestamp: Date;
    status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    data: any;
}

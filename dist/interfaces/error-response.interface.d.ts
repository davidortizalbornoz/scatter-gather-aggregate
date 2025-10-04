export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    details?: {
        phase?: string;
        errorMessage?: string;
        errorType?: string;
        originalError?: any;
        stack?: string;
    };
}

import type { Product } from './product.interface';
import type { User } from './user.interface';
import type { Payment } from './payment.interface';

export interface AggregatedResponse {
  success: boolean;
  failedServices: string[];
  timestamp: Date;
  metrics: {
    total: number;
    successful: number;
    failed: number;
    processingTimeMs: number;
  };
  data: {
    products?: {
      id: string;
      type: 'PRODUCT';
      timestamp: Date;
      status: 'SUCCESS' | 'FAILED';
      data: Product[] | null;
    };
    users?: {
      id: string;
      type: 'USER';
      timestamp: Date;
      status: 'SUCCESS' | 'FAILED';
      data: User[] | null;
    };
    payments?: {
      id: string;
      type: 'PAYMENT';
      timestamp: Date;
      status: 'SUCCESS' | 'FAILED';
      data: Payment[] | null;
    };
  };
  summary: string;
}

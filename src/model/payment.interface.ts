export interface Payment {
  id: string;
  amount: number;
  userId: string;
  productId: string;
  confirmed: boolean;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING';
  formattedAmount: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

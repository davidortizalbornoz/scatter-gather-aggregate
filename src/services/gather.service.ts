import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../model/product.interface';
import { User } from '../model/user.interface';
import { Payment } from '../model/payment.interface';
import { ServiceResponse } from '../model/service-response.interface';
import { AggregatedResponse } from '../model/aggregated-response.interface';

@Injectable()
export class GatherService {
  processResults(results: any): AggregatedResponse {
    const startTime = Date.now();
    
    const processedData = {
      service1: this.processProductService(results.service1),
      service2: this.processUserService(results.service2),
      service3: this.processPaymentService(results.service3)
    };

    const failedServices = Object.entries(results)
      .filter(([_, value]: [string, ServiceResponse]) => !value.success)
      .map(([key]) => key);

    const response: AggregatedResponse = {
      success: failedServices.length === 0,
      failedServices,
      timestamp: new Date(),
      metrics: {
        total: Object.keys(results).length,
        successful: Object.keys(results).length - failedServices.length,
        failed: failedServices.length,
        processingTimeMs: Date.now() - startTime
      },
      data: {
        products: processedData.service1,
        users: processedData.service2,
        payments: processedData.service3
      },
      summary: this.generateSummary(processedData)
    };

    return response;
  }

  private processProductService(result: ServiceResponse): AggregatedResponse['data']['products'] {
    if (!result.success) {
      return {
        id: uuidv4(),
        type: 'PRODUCT',
        timestamp: new Date(),
        status: 'FAILED',
        data: null
      };
    }

    const processedProducts = result.data.map(product => ({
      ...product,
      price: this.calculateDiscountedPrice(product),
      inStock: product.quantity > 0,
      category: product.category.toUpperCase()
    } as Product));

    return {
      id: uuidv4(),
      type: 'PRODUCT',
      timestamp: new Date(),
      status: 'SUCCESS',
      data: processedProducts
    };
  }

  private processUserService(result: ServiceResponse): AggregatedResponse['data']['users'] {
    if (!result.success) {
      return {
        id: uuidv4(),
        type: 'USER',
        timestamp: new Date(),
        status: 'FAILED',
        data: null
      };
    }

    //throw new Error('Error forzado para testing de handleGatherError para processUserService(...)');

    const processedUsers = result.data.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isActive: user.lastLogin > Date.now() - (30 * 24 * 60 * 60 * 1000),
      role: this.determineUserRole(user)
    } as User));

    return {
      id: uuidv4(),
      type: 'USER',
      timestamp: new Date(),
      status: 'SUCCESS',
      data: processedUsers
    };
  }

  private processPaymentService(result: ServiceResponse): AggregatedResponse['data']['payments'] {
    if (!result.success) {
      return {
        id: uuidv4(),
        type: 'PAYMENT',
        timestamp: new Date(),
        status: 'FAILED',
        data: null
      };
    }
     
    //throw new Error('Error forzado para testing de handleGatherError para processPaymentService(...)');
    
    const processedPayments = result.data.map(payment => ({
      ...payment,
      status: this.validatePaymentStatus(payment),
      formattedAmount: this.formatCurrency(payment.amount),
      riskLevel: this.calculateRiskLevel(payment)
    } as Payment));

    return {
      id: uuidv4(),
      type: 'PAYMENT',
      timestamp: new Date(),
      status: 'SUCCESS',
      data: processedPayments
    };
  }

  private generateSummary(processedData: {
    service1: AggregatedResponse['data']['products'],
    service2: AggregatedResponse['data']['users'],
    service3: AggregatedResponse['data']['payments']
  }): string {
    const parts = [];
    
    if (processedData.service1?.data) {
      parts.push(`Products: ${processedData.service1.data.length} items processed`);
    }
    if (processedData.service2?.data) {
      parts.push(`Users: ${processedData.service2.data.length} profiles found`);
    }
    if (processedData.service3?.data) {
      parts.push(`Payments: ${processedData.service3.data.length} transactions analyzed`);
    }

    return parts.join(' | ') || 'No data processed';
  }

  private calculateDiscountedPrice(product: any): number {
    return product.price * 0.9;
  }

  private determineUserRole(user: any): string {
    return user.permissions?.length > 5 ? 'ADMIN' : 'USER';
  }

  private validatePaymentStatus(payment: any): string {
    return payment.amount > 0 && payment.confirmed ? 'COMPLETED' : 'PENDING';
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  private calculateRiskLevel(payment: any): string {
    if (payment.amount > 1000000) return 'HIGH';
    if (payment.amount > 100000) return 'MEDIUM';
    return 'LOW';
  }
}

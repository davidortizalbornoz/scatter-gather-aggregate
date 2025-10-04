import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { forkJoin, Observable, of, throwError, TimeoutError } from 'rxjs';
import { AxiosError } from 'axios';
import { map, timeout, catchError, retry } from 'rxjs/operators';
import { ServiceResponse } from '../model/service-response.interface';
import { AggregatedResponse } from '../model/aggregated-response.interface';
import { GatherService } from './gather.service';

@Injectable()
export class ScatterService {
  private readonly logger = new Logger(ScatterService.name);
  private readonly serviceConfigs = {
    service1: {
      url: '',
      timeout: 0,
      retry: 0
    },
    service2: {
      url: '',
      timeout: 0,
      retry: 0
    },
    service3: {
      url: '',
      timeout: 0,
      retry: 0
    }
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly gatherService: GatherService,
    private readonly configService: ConfigService
  ) {
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    this.serviceConfigs.service1 = {
      url: this.configService.get<string>('SERVICIO1_URL'),
      timeout: this.configService.get<number>('SERVICIO1_TIMEOUT'),
      retry: this.configService.get<number>('SERVICIO1_RETRY')
    };
    this.serviceConfigs.service2 = {
      url: this.configService.get<string>('SERVICIO2_URL'),
      timeout: this.configService.get<number>('SERVICIO2_TIMEOUT'),
      retry: this.configService.get<number>('SERVICIO2_RETRY')
    };
    this.serviceConfigs.service3 = {
      url: this.configService.get<string>('SERVICIO3_URL'),
      timeout: this.configService.get<number>('SERVICIO3_TIMEOUT'),
      retry: this.configService.get<number>('SERVICIO3_RETRY')
    };
  }

  gatherData(): Observable<AggregatedResponse> {
    // Scatter phase - definir las llamadas
    const service1$ = this.callService1().pipe(
      timeout(this.serviceConfigs.service1.timeout),
      retry(this.serviceConfigs.service1.retry),
      catchError(error => this.handleError('service1', error))
    );

    const service2$ = this.callService2().pipe(
      timeout(this.serviceConfigs.service2.timeout),
      retry(this.serviceConfigs.service2.retry),
      catchError(error => this.handleError('service2', error))
    );

    const service3$ = this.callService3().pipe(
      timeout(this.serviceConfigs.service3.timeout),
      retry(this.serviceConfigs.service3.retry),
      catchError(error => this.handleError('service3', error))
    );

    // Gather phase - combinar resultados
    return forkJoin({
      service1: service1$,
      service2: service2$,
      service3: service3$
    }).pipe(
      map(results => this.gatherService.processResults(results)),
      catchError(error => this.handleGatherError(error))
    );
  }

  private callService1(): Observable<ServiceResponse> {
    this.logger.log(`Invocando Servicio de Productos: ${this.serviceConfigs.service1.url}`);
    return this.httpService.get(this.serviceConfigs.service1.url).pipe(
      map(response => ({
        success: true,
        data: response.data.products // Extraemos el array de productos
      }))
    );
  }

  private callService2(): Observable<ServiceResponse> {
    this.logger.log(`Invocando Servicio de Usuarios: ${this.serviceConfigs.service2.url}`);
    return this.httpService.get(this.serviceConfigs.service2.url).pipe(
      map(response => ({
        success: true,
        data: response.data.users // Extraemos el array de usuarios
      }))
    );
  }

  private callService3(): Observable<ServiceResponse> {
    this.logger.log(`Invocando Servicio de Pagos: ${this.serviceConfigs.service3.url}`);
    return this.httpService.get(this.serviceConfigs.service3.url).pipe(
      map(response => ({
        success: true,
        data: response.data.payments // Extraemos el array de pagos
      }))
    );
  }

  private handleError(serviceName: string, error: any): Observable<ServiceResponse> {
    if (error instanceof TimeoutError) {
      const errorMessage = `${serviceName} timeout`;
      this.logger.error(errorMessage);
      return of({
        success: false,
        data: null,
        error: errorMessage
      });
    }
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      let errorMessage: string;

      switch (statusCode) {
        case 404:
          errorMessage = `${serviceName}: Recurso no encontrado (404)`;
          break;
        case 400:
          errorMessage = `${serviceName}: Solicitud inválida (400)`;
          break;
        case 403:
          errorMessage = `${serviceName}: Acceso denegado (403)`;
          break;
        case 500:
          errorMessage = `${serviceName}: Error interno del servidor (500)`;
          break;
        default:
          errorMessage = `${serviceName} error: ${error.message}`;
      }

      this.logger.error(errorMessage, error.stack);
      return of({
        success: false,
        data: null,
        error: errorMessage
      });
    }

    // Para otros tipos de errores
    const errorMessage = `${serviceName} error: ${error.message}`;
    this.logger.error(errorMessage, error.stack);
    return of({
      success: false,
      data: null,
      error: errorMessage
    });
  }

  private handleGatherError(error: any): Observable<any> 
  {
    this.logger.error('Error during gather phase:', error);
    
    return throwError(() => ({
      statusCode: 422,
      message: 'Error al procesar la agregación de datos',
      error: 'Unprocessable Entity',
      timestamp: new Date().toISOString(),
      path: '/aggregate',
      details: {
        phase: 'gather',
        errorMessage: error.message || 'Unknown error',
        errorType: error.name || error.constructor.name,
      }
    }));
  }
}

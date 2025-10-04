import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  API_PREFIX: string;

  @IsString()
  API_VERSION: string;

  @IsString()
  LOG_LEVEL: string;

  @IsString()
  SERVICIO1_URL: string;

  @IsNumber()
  SERVICIO1_TIMEOUT: number;

  @IsNumber()
  SERVICIO1_RETRY: number;

  @IsString()
  SERVICIO2_URL: string;

  @IsNumber()
  SERVICIO2_TIMEOUT: number;

  @IsNumber()
  SERVICIO2_RETRY: number;

  @IsString()
  SERVICIO3_URL: string;

  @IsNumber()
  SERVICIO3_TIMEOUT: number;

  @IsNumber()
  SERVICIO3_RETRY: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

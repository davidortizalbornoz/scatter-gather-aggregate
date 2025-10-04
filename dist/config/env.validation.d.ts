declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    PORT: number;
    NODE_ENV: Environment;
    API_PREFIX: string;
    API_VERSION: string;
    LOG_LEVEL: string;
    SERVICIO1_URL: string;
    SERVICIO1_TIMEOUT: number;
    SERVICIO1_RETRY: number;
    SERVICIO2_URL: string;
    SERVICIO2_TIMEOUT: number;
    SERVICIO2_RETRY: number;
    SERVICIO3_URL: string;
    SERVICIO3_TIMEOUT: number;
    SERVICIO3_RETRY: number;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};

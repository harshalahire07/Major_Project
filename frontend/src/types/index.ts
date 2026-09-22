export interface ApiError {
  detail: string;
  status: number;
}

export interface HealthStatus {
  status: string;
  version: string;
  environment: string;
}

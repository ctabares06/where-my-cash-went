export interface IHealthCheckPort {
  isDatabaseConnected(): Promise<boolean>;
}

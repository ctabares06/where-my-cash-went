export type HealthResponseDto = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
};

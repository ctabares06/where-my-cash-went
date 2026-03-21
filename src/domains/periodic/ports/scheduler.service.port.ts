/**
 * Scheduler Service Port - Interface for scheduling operations
 * Abstraction over @nestjs/schedule
 */
export interface ISchedulerServicePort {
  addCronJob(
    name: string,
    expression: string,
    callback: () => Promise<void>,
  ): void;
  deleteCronJob(name: string): void;
}

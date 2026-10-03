import { Module } from "@nestjs/common";
import { HealthController } from "./controller/health.controller.js";

@Module({
  controllers: [HealthController]
})
export class HealthModule {}

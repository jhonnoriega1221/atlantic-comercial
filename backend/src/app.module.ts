import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { HealthModule } from "./features/health/health.module.js";
import { SalesModule } from "./features/sales/sales.module.js";
import { DatabaseModule } from "./core/database/database.module.js";

@Module({
  imports: [HealthModule, SalesModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

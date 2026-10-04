import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AggregatedSalesEntity } from "./domain/entities/aggregated-sales.entity.js";
import { I_SALES_REPOSITORY } from "./domain/repositories/sales.repository.js";
import { SalesRepository } from "./infrastructure/repositories/sales.repository.js";
import { SalesService } from "./application/services/sales.service.js";
import { SalesController } from "./infrastructure/controllers/sales.controller.js";

@Module({
  imports: [TypeOrmModule.forFeature([AggregatedSalesEntity])],
  controllers: [SalesController],
  providers: [
    {
      provide: I_SALES_REPOSITORY,
      useClass: SalesRepository
    },
    SalesService
  ]
})
export class SalesModule {}

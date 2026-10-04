import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AggregatedSalesEntity } from "./domain/entities/aggregated-sales.entity.js";
import { SalesRepository } from "./domain/repositories/sales.repository.js";
import { TypeOrmSalesRepository } from "./infrastructure/repositories/type-orm-sales.repository.js";
import { SalesService } from "./application/services/sales.service.js";
import { SalesController } from "./infrastructure/controllers/sales.controller.js";

@Module({
  imports: [TypeOrmModule.forFeature([AggregatedSalesEntity])],
  controllers: [SalesController],
  providers: [
    {
      provide: SalesRepository,
      useClass: TypeOrmSalesRepository
    },
    SalesService
  ]
})
export class SalesModule {}

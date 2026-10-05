import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdvisorsService } from "./application/services/advisors.service.js";
import { AdvisorsRepository } from "./domain/repositories/advisors.repository.js";
import { TypeOrmAdvisorsRepository } from "./infrastructure/repositories/type-orm-advisors.repository.js";
import { AdvisorsController } from "./infrastructure/controllers/advisors.controller.js";
import { AggregatedSalesEntity } from "../sales/domain/entities/aggregated-sales.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([AggregatedSalesEntity])],
  controllers: [AdvisorsController],
  providers: [AdvisorsService, { provide: AdvisorsRepository, useClass: TypeOrmAdvisorsRepository }]
})
export class AdvisorsModule {}

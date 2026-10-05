import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientSummaryEntity } from "./domain/entities/client-summary.entity.js";
import { ClientController } from "./infrastructure/controllers/client.controller.js";
import { ClientRepository } from "./domain/repositories/client.repository.js";
import { TypeOrmClientRepository } from "./infrastructure/repositories/type-orm-client.repository.js";
import { ClientService } from "./application/services/client.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([ClientSummaryEntity])],
  controllers: [ClientController],
  providers: [
    {
      provide: ClientRepository,
      useClass: TypeOrmClientRepository
    },
    ClientService
  ]
})
export class ClientsModule {}

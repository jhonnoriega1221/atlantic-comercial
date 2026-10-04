import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientSummaryEntity } from "./domain/entities/client-summary.entity.js";
import { ClientController } from "./infrastructure/controllers/client.controller.js";
import { I_CLIENTS_REPOSITORY } from "./domain/repositories/client.repository.js";
import { ClientRepository } from "./infrastructure/repositories/client.repository.js";
import { ClientService } from "./application/services/client.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([ClientSummaryEntity])],
  controllers: [ClientController],
  providers: [
    {
      provide: I_CLIENTS_REPOSITORY,
      useClass: ClientRepository
    },
    ClientService
  ]
})
export class ClientsModule {}

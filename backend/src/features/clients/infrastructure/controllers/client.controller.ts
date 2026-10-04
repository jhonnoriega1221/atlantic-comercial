import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";
import { ClientService } from "../../application/services/client.service.js";
import { ClientHistoryQueryDto } from "../../domain/dto/client-history-query.dto.js";

@ApiTags("Clientes")
@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({ summary: "Obtener lista paginada de clientes con búsqueda y ordenamiento" })
  async getClients(@Query() query: ClientsQueryDto) {
    return await this.clientService.getPaginatedClients(query);
  }

  @Get(":id/history")
  @ApiOperation({
    summary: "Obtener el historial de compras paginado de un cliente específico por su Código"
  })
  async getClientHistory(@Param("id") id: string, @Query() query: ClientHistoryQueryDto) {
    return await this.clientService.getClientHistory(id, query);
  }
}

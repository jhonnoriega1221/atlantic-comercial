import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";
import { ClientService } from "../../application/services/client.service.js";

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
    summary: "Obtener el historial de compras de un cliente específico por su Código"
  })
  async getClientHistory(@Param("id") id: string) {
    return await this.clientService.getClientHistory(id);
  }
}

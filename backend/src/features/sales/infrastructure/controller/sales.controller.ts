import { Controller, Get, Query } from "@nestjs/common";
import { SalesService } from "../../application/services/sales.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SalesFilterDto } from "../../domain/dto/sales-filter.dto.js";

@ApiTags("KPIs comerciales")
@Controller("kpis")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener indicadores clave de rendimiento (KPIs)",
    description:
      "Calcula Venta neta, Transacciones, Clientes Activos, Ticket Promedio, Porcentaje de devoluciones y Variación Mensual."
  })
  @ApiResponse({
    status: 200,
    description: "KPIs calculados correctamente",
    schema: {
      example: {
        netSale: 321312333.21,
        transactions: 3741,
        activeClients: 359,
        averageOrderValue: 38829.11,
        returnRate: 0.04,
        salesVariationMoM: 5.2
      }
    }
  })
  async getGeneralKpis(@Query() filters: SalesFilterDto) {
    return await this.salesService.getGeneralKPIs(filters);
  }
}

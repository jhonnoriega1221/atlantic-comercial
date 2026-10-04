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

  @Get("trend")
  @ApiOperation({
    summary: "Obtener tendencia de ventas en el tiempo",
    description: "Retorna el comportamiento histórico de las ventas agrupado por meses."
  })
  @ApiResponse({
    status: 200,
    description: "Tendencia generada correctamente.",
    schema: {
      example: [
        { period: "2026-01-01", netSale: 2500000, transactions: 150 },
        { period: "2026-02-01", netSale: 2800000, transactions: 165 }
      ]
    }
  })
  async getSalesTrend(@Query() filters: SalesFilterDto) {
    return await this.salesService.getSalesTrend(filters);
  }

  @Get("sedes")
  @ApiOperation({
    summary: "Rendimiento y participación por sede",
    description:
      "Retorna el total de ventas y el % de participación agrupado por cada sede comercial."
  })
  @ApiResponse({
    status: 200,
    description: "Ranking de sedes calculado correctamente.",
    schema: {
      example: [
        { sede: "BOGOTA", netSale: 52000000.5, participation: 35.5 },
        { sede: "MEDELLIN", netSale: 31000000.0, participation: 21.2 }
      ]
    }
  })
  async getLocationsRanking(@Query() filters: SalesFilterDto) {
    return await this.salesService.getLocationsRanking(filters);
  }

  @Get("advisors")
  @ApiOperation({
    summary: "Ranking de los 10 mejores asesores",
    description:
      "Retorna el Top 10 de asesores basado en Venta Neta, incluyendo Ticket Promedio, Clientes y Variación vs mes anterior."
  })
  @ApiResponse({
    status: 200,
    description: "Ranking generado correctamente.",
    schema: {
      example: [
        {
          advisorCode: "ASE-045",
          advisorName: "Maria Rodriguez",
          netSale: 45000000,
          activeClients: 120,
          averageTicket: 375000,
          salesVariationMoM: 12.5
        }
      ]
    }
  })
  async getAdvisorsRanking(@Query() filters: SalesFilterDto) {
    return await this.salesService.getAdvisorsRanking(filters);
  }
}

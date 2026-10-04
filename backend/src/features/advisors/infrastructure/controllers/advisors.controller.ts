import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdvisorRankingDto } from "../../domain/dto/advisor-ranking.dto.js";
import { AdvisorsService } from "../../application/services/advisors.service.js";
import { AdvisorFilterDto } from "../../domain/dto/advisor-filter.dto.js";

@ApiTags("Asesores")
@Controller("advisors")
export class AdvisorsController {
  constructor(private readonly advisorsService: AdvisorsService) {}

  @Get("ranking")
  @ApiOperation({ summary: "Ranking de asesores con venta, clientes y variación" })
  @ApiOkResponse({ type: [AdvisorRankingDto] })
  getRanking(@Query() filters: AdvisorFilterDto) {
    return this.advisorsService.getRanking(filters);
  }

  @Get(":code/evolution")
  @ApiOperation({ summary: "Evolución mensual de ventas de un asesor" })
  getEvolution(@Param("code") code: string, @Query() filters: AdvisorFilterDto) {
    return this.advisorsService.getEvolution(code, filters);
  }
}

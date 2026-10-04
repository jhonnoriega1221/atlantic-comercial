import { ApiProperty } from "@nestjs/swagger";

export class AdvisorRankingDto {
  @ApiProperty({ example: "ASE-004" }) advisorCode: string;
  @ApiProperty({ example: "Asesor Bogota 04" }) advisorName: string;
  @ApiProperty({ example: "BOGOTA" }) location: string;
  @ApiProperty() netSale: number;
  @ApiProperty({ description: "Promedio mensual de clientes activos en el rango" })
  activeClients: number;
  @ApiProperty() averageTicket: number;
  @ApiProperty({ description: "Variación de venta vs. mes anterior, en %" })
  salesVariationMoM: number;
}

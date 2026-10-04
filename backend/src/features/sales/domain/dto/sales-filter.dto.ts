import { IsOptional, IsString, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SalesFilterDto {
  @ApiPropertyOptional({
    description: "Fecha de inicio del periodo a consultar",
    example: "2026-01-01"
  })
  @IsOptional()
  @IsDateString({}, { message: "startDate debe ser una fecha ISO válida (YYYY-MM-DD)" })
  startDate?: string;

  @ApiPropertyOptional({
    description: "Fecha de fin del periodo a consultar",
    example: "2026-06-01"
  })
  @IsOptional()
  @IsDateString({}, { message: "endDate debe ser una fecha ISO válida (YYYY-MM-DD)" })
  endDate?: string;

  @ApiPropertyOptional({
    description: "Filtro exacto por sede comercial (en mayúsculas)",
    example: "BOGOTA"
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "Filtro exacto por código de asesor",
    example: "ASE-001"
  })
  @IsOptional()
  @IsString()
  advisor?: string;
}

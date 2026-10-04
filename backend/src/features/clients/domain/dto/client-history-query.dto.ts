import { IsOptional, IsNumber, Min, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ClientHistoryQueryDto {
  @ApiPropertyOptional({ description: "Página actual del historial", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "La página debe ser un número" })
  @Min(1, { message: "La página no puede ser menor a 1" })
  page?: number = 1;

  @ApiPropertyOptional({ description: "Registros por página", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "El límite debe ser un número" })
  @Min(1, { message: "El límite no puede ser menor a 1" })
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Fecha de inicio (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: "Fecha de fin (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  endDate?: string;
}

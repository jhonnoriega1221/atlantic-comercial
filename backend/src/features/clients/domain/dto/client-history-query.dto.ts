import { IsOptional, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { GlobalFilterDto } from "../../../../shared/application/dtos/global-filter.dto.js";

export class ClientHistoryQueryDto extends GlobalFilterDto {
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
}

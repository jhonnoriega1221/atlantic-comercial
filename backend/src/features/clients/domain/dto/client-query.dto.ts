import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { GlobalFilterDto } from "../../../../shared/utils/global-filter.dto.js";

export class ClientsQueryDto extends GlobalFilterDto {
  @ApiPropertyOptional({ description: "Página actual", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "La página no puede ser menor a 1" })
  page?: number = 1;

  @ApiPropertyOptional({ description: "Registros por página", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "El límite debe ser un número" })
  @Min(1, { message: "El límite no puede ser menor a 1" })
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Término de búsqueda por nombre del cliente" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Campo por el cual ordenar", enum: ["name", "netSale"] })
  @IsOptional()
  @IsIn(["name", "netSale"], { message: "El ordenamiento solo puede ser por name o netSale" })
  sortBy?: string = "netSale";

  @ApiPropertyOptional({ description: "Dirección del ordenamiento", enum: ["ASC", "DESC"] })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}

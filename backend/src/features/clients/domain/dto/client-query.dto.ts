import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ClientsQueryDto {
  @ApiPropertyOptional({ description: "Página actual", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Registros por página", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Término de búsqueda por nombre del cliente" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Campo por el cual ordenar", enum: ["name", "netSale"] })
  @IsOptional()
  @IsIn(["name", "netSale"])
  sortBy?: string = "netSale";

  @ApiPropertyOptional({ description: "Dirección del ordenamiento", enum: ["ASC", "DESC"] })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}

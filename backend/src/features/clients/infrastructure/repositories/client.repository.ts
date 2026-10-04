import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";
import { ClientSummaryEntity } from "../../domain/entities/client-summary.entity.js";
import { IClientRepository } from "../../domain/repositories/client.repository.js";

export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientSummaryEntity)
    private readonly repository: Repository<ClientSummaryEntity>
  ) {}

  async getPaginatedClients(query: ClientsQueryDto) {
    const qb = this.repository.createQueryBuilder("c");
    if (query.search) {
      qb.andWhere("LOWER(c.clientName) LIKE LOWER(:search)", { search: "%${query.search}%" });
    }

    const total = await qb.getCount();

    const sortBy = query.sortBy === "name" ? "c.clientName" : "c.netSale";
    qb.orderBy(sortBy, query.sortOrder);

    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    qb.limit(limit).offset(offset);

    const data = await qb.getMany();

    return {
      data: data.map((row) => ({
        clientId: row.clientId,
        clientName: row.clientName,
        transactions: Number(row.transactions) || 0,
        netSale: Number(row.netSale) || 0
      })),
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1
    };
  }

  async getClientHistory(clientId: string) {
    const result = await this.repository.query(
      `
        SELECT 
          v.Periodo as period,
          a.Sede as location,
          COUNT(v.id) as transactions,
          SUM(v.Neto) as netSale
        FROM fact_ventas v
        LEFT JOIN rel_cliente_asesor r ON v.[Cod Principal] = r.[Cod Cliente]
        LEFT JOIN dim_asesores a ON r.[Cod Asesor] = a.[Cod Asesor]
        WHERE v.[Cod Principal] = ?
        GROUP BY v.Periodo, a.Sede
        ORDER BY v.Periodo ASC
    `,
      [clientId]
    );

    return result.map((row: any) => ({
      period: row.period,
      location: row.location,
      transactions: Number(row.transactions) || 0,
      netSale: Number(row.netSale) || 0
    }));
  }
}

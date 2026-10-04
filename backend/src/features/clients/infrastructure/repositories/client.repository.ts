import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientsQueryDto } from "../../domain/dto/client-query.dto.js";
import { ClientSummaryEntity } from "../../domain/entities/client-summary.entity.js";
import { IClientRepository } from "../../domain/repositories/client.repository.js";
import { ClientHistoryQueryDto } from "../../domain/dto/client-history-query.dto.js";
import { ClientHistoryItem } from "../../domain/types/client.types.js";

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

  async getClientHistory(clientId: string, query: ClientHistoryQueryDto) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    let dateFilterSql = "";
    const queryParams: string[] = [clientId];

    if (query.startDate) {
      dateFilterSql += " AND v.Periodo >= ?";
      queryParams.push(query.startDate);
    }
    if (query.endDate) {
      dateFilterSql += " AND v.Periodo <= ?";
      queryParams.push(query.endDate);
    }

    const countSql = `
      SELECT COUNT(v.id) as total, c.[Nombre Cliente] as clientName
      FROM fact_ventas v
      INNER JOIN dim_clientes c ON v.[Cod Principal] = c.[Cod Cliente]
      WHERE v.[Cod Principal] = ? ${dateFilterSql}
    `;

    const countResult = await this.repository.query(countSql, queryParams);

    if (!countResult || countResult.length === 0 || Number(countResult[0].total) === 0) {
      return null;
    }

    const total = Number(countResult[0].total);
    const clientName = countResult[0].clientName;

    const historySql = `
      SELECT 
          v.id as transactionId,
          m.[Cod Material] as productId,
          m.[Nombre Material] as productName,
          v.Periodo as purchaseDate,
          v.Neto as cost
      FROM fact_ventas v
      INNER JOIN dim_materiales m ON v.[Cod Material] = m.[Cod Material]
      WHERE v.[Cod Principal] = ? ${dateFilterSql}
      ORDER BY v.Periodo DESC
      LIMIT ? OFFSET ?
    `;

    const historyParams = [...queryParams, limit, offset];
    const historyResult = await this.repository.query<ClientHistoryItem[]>(
      historySql,
      historyParams
    );

    return {
      clientId,
      clientName,
      history: historyResult.map((row: ClientHistoryItem) => ({
        transactionId: row.transactionId,
        productId: row.productId,
        productName: row.productName,
        purchaseDate: row.purchaseDate,
        cost: Number(row.cost) || 0
      })),
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1
    };
  }
}

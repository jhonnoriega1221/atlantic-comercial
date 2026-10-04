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
    let baseSql = `
      FROM dim_clientes c
      LEFT JOIN fact_ventas v ON c.[Cod Cliente] = v.[Cod Principal]
      LEFT JOIN rel_cliente_asesor r ON c.[Cod Cliente] = r.[Cod Cliente]
      LEFT JOIN dim_asesores a ON r.[Cod Asesor] = a.[Cod Asesor]
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (query.search) {
      baseSql += ` AND LOWER(c.[Nombre Cliente]) LIKE LOWER(?)`;
      params.push(`%${query.search}%`);
    }
    if (query.startDate) {
      baseSql += ` AND v.Periodo >= ?`;
      params.push(query.startDate);
    }
    if (query.endDate) {
      baseSql += ` AND v.Periodo <= ?`;
      params.push(query.endDate);
    }
    if (query.location) {
      baseSql += ` AND a.Sede = ?`;
      params.push(query.location.toUpperCase());
    }
    if (query.advisor) {
      baseSql += ` AND a.[Cod Asesor] = ?`;
      params.push(query.advisor);
    }

    const countSql = `SELECT COUNT(DISTINCT c.[Cod Cliente]) as total ${baseSql}`;
    const countResult = await this.repository.query(countSql, params);
    const total = Number(countResult[0]?.total) || 0;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    const sortBy = query.sortBy === "name" ? "c.[Nombre Cliente]" : "SUM(v.Neto)";
    const order = query.sortOrder === "ASC" ? "ASC" : "DESC";

    const dataSql = `
      SELECT 
        c.[Cod Cliente] as clientId,
        c.[Nombre Cliente] as clientName,
        COUNT(v.id) as transactions,
        COALESCE(SUM(v.Neto), 0) as netSale
      ${baseSql}
      GROUP BY c.[Cod Cliente], c.[Nombre Cliente]
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];

    interface RawClientRow {
      clientId: string;
      clientName: string;
      transactions: number;
      netSale: number;
    }

    const data = await this.repository.query<RawClientRow[]>(dataSql, dataParams);

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
    const queryParams: (string | number)[] = [clientId];

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

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module.js";

describe("SalesController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true
      })
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // PRUEBA 1: Endpoint GET /kpis
  describe("GET /kpis", () => {
    it("debe retornar HTTP 200 y los KPIs generales con estructura correcta", async () => {
      const response = await request(app.getHttpServer()).get("/kpis").expect(200);

      expect(response.body).toHaveProperty("netSale");
      expect(response.body).toHaveProperty("transactions");
      expect(response.body).toHaveProperty("activeClients");
      expect(response.body).toHaveProperty("returnRate");

      expect(typeof response.body.netSale).toBe("number");
      expect(typeof response.body.transactions).toBe("number");
    });

    it("debe responder 400 Bad Request si los filtros tienen formato inválido", async () => {
      await request(app.getHttpServer()).get("/kpis?startDate=fecha-invalida").expect(400);
    });
  });

  // PRUEBA 2: Endpoint GET /kpis/trend
  describe("GET /kpis/trend", () => {
    it("debe retornar HTTP 200 y un array con la tendencia mensual de ventas", async () => {
      const response = await request(app.getHttpServer()).get("/kpis/trend").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("period");
        expect(response.body[0]).toHaveProperty("netSale");
        expect(response.body[0]).toHaveProperty("transactions");
      }
    });
  });
});

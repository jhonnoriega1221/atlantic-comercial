import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("AFS Commercial API")
    .setDescription(
      "API REST Comercial construida con arquitectura hexagonal y NestJS. " +
        "Proporciona analítica de ventas, tendencias, y rendimiento de sedes/asesores."
    )
    .setVersion("1.0")
    .addTag("KPIs comerciales", "Metricas de rendimiento generales")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "AFS Commercial - API Docs",
    customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 30px 0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  });
}

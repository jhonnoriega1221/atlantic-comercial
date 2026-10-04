import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { setupSwagger } from "./core/docs/swagger.config.js";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./core/filters/global-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({ origin: (process.env.FRONTEND_URL ?? "http://localhost:4200").split(",") });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  setupSwagger(app);
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

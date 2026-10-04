import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

const isProduction = process.env.NODE_ENV === "production";

const dbPath = isProduction
  ? join(process.cwd(), "db", "afs_commercial.sqlite")
  : join(process.cwd(), "..", "db", "afs_commercial.sqlite");

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: process.env.DB_PATH || dbPath,
      autoLoadEntities: true,
      synchronize: false,
      logging: false
    })
  ]
})
export class DatabaseModule {}

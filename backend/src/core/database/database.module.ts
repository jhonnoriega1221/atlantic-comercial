import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: join(process.cwd(), "..", "db", "afs_commercial.sqlite"),
      autoLoadEntities: true,
      synchronize: false,
      logging: false
    })
  ]
})
export class DatabaseModule {}

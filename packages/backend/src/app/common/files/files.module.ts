import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TWFile } from "./file.entity";
import { Project } from "../projects/project.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TWFile, Project]),
        ConfigModule,
        AuthModule,
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}

import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Logger,
    Query,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { Workspace } from "./workspace.entity";
import { CreateWorkspaceDto } from "./dto/create.workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update.workspace.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { WorkspaceTypes } from "./types";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current.user.decorator";
import { User } from "../users/user.entity";

@ApiBearerAuth()
@ApiTags("workspaces")
@UseGuards(JwtAuthGuard)
@Controller({
    path: "workspaces",
    version: "1",
})
export class WorkspacesController {
    private readonly logger = new Logger(WorkspacesController.name);
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    findAll(
        @Query()
        query: {
            type?: WorkspaceTypes;
        }
    ): Promise<Workspace[]> {
        const { type } = query;

        return this.workspacesService.findAll({
            type,
        });
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<Workspace> {
        return this.workspacesService.findOne(+id);
    }

    @Post()
    create(
        @Body() createWorkspaceDto: CreateWorkspaceDto,
        @CurrentUser() user: User
    ): Promise<Workspace> {
        return this.workspacesService.create({
            ...createWorkspaceDto,
            ownerId: user.id,
        });
    }

    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto
    ): Promise<Workspace> {
        return this.workspacesService.update(+id, updateWorkspaceDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string): Promise<void> {
        return this.workspacesService.remove(+id);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { ListStage } from "./list.stage.entity";
import { CreateListStageDto } from "./dto/create.list.stage.dto";
import { UpdateListStageDto } from "./dto/update.list.stage.dto";
import { ListStagesService } from "./list.stages.service";

@ApiBearerAuth()
@ApiTags("lists")
@UseGuards(JwtAuthGuard)
@Controller({
    path: "lists/:listId/stages",
    version: "1",
})
export class ListStagesController {
    constructor(private readonly listStagesService: ListStagesService) {}

    @Get()
    findStages(@Param("listId") listId: number): Promise<ListStage[]> {
        return this.listStagesService.findAll({
            listId,
        });
    }

    @Get(":id")
    findOne(@Param("id") id: number): Promise<ListStage> {
        return this.listStagesService.findOne(id);
    }

    @Post()
    create(
        @Param("listId") listId: number,
        @Body() createListDto: Omit<CreateListStageDto, "listId">
    ): Promise<ListStage> {
        return this.listStagesService.create({ ...createListDto, listId });
    }

    @Put("reorder")
    reorder(
        @Param("listId") listId: number,
        @Body() listStages: Pick<ListStage, "id" | "order">[]
    ): Promise<ListStage[]> {
        return this.listStagesService.reorder(
            listStages.map((listStage) => ({ ...listStage, listId }))
        );
    }

    @Put(":id")
    update(
        @Param("id") id: number,
        @Body() updateListDto: UpdateListStageDto
    ): Promise<ListStage> {
        return this.listStagesService.update(id, updateListDto);
    }

    @Delete(":id")
    remove(
        @Param("id") id: number,
        @Body() replacementListStage: ListStage
    ): Promise<void> {
        return this.listStagesService.remove(id, replacementListStage);
    }
}

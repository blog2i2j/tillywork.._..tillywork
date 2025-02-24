import { Injectable } from "@nestjs/common";
import { Workspace } from "./workspace.entity";
import { SpacesService } from "../spaces/spaces.service";
import { DEFAULT_SPACES } from "../spaces/types";
import { CardTypesService } from "../card-types/card.types.service";
import { ListsService } from "../lists/lists.service";
import { List } from "../lists/list.entity";
import { Space } from "../spaces/space.entity";
import { ListType, ViewTypes, WorkspaceTypes } from "@tillywork/shared";

@Injectable()
export class WorkspaceSideEffectsService {
    constructor(
        private spacesService: SpacesService,
        private cardTypesService: CardTypesService,
        private listsService: ListsService
    ) {}

    async handleWorkspaceSetup({
        workspace,
    }: {
        workspace: Workspace;
    }): Promise<Workspace> {
        workspace.cardTypes =
            await this.cardTypesService.createDefaultWorkspaceTypes(workspace);

        switch (workspace.type) {
            case WorkspaceTypes.CRM: {
                const contactCardType = workspace.cardTypes.find(
                    (cardType) => cardType.name === "Contact"
                );
                workspace.defaultCardType =
                    contactCardType ?? workspace.cardTypes[0];

                await this.handleCrmSetup({ workspace });
                break;
            }

            case WorkspaceTypes.PROJECT_MANAGEMENT:
                workspace.spaces = await this.handleProjectManagementSetup({
                    workspace,
                });

                workspace.defaultCardType = workspace.cardTypes[0];
                break;
        }

        return workspace;
    }

    async handleProjectManagementSetup({
        workspace,
    }: {
        workspace: Workspace;
    }): Promise<Space[]> {
        const spacePromises = DEFAULT_SPACES.map((space) => {
            return new Promise((resolve) => {
                this.spacesService
                    .create({
                        name: space.name,
                        workspaceId: workspace.id,
                        createOnboardingData: true,
                    })
                    .then((space) => resolve(space));
            });
        });

        const result = await Promise.allSettled(spacePromises);

        return [(result[0] as any).value];
    }

    async handleCrmSetup({
        workspace,
    }: {
        workspace: Workspace;
    }): Promise<List[]> {
        const lists = [
            {
                name: "Contacts",
                defaultCardType: workspace.cardTypes.find(
                    (cardType) => cardType.name === "Contact"
                ),
                icon: "mdi-account-group",
                type: ListType.CONTACTS,
            },
            {
                name: "Organizations",
                defaultCardType: workspace.cardTypes.find(
                    (cardType) => cardType.name === "Organization"
                ),
                icon: "mdi-domain",
                type: ListType.ORGANIZATIONS,
            },
            {
                name: "Deals",
                defaultCardType: workspace.cardTypes.find(
                    (cardType) => cardType.name === "Deal"
                ),
                icon: "mdi-handshake",
                type: ListType.DEALS,
                defaultViewType: ViewTypes.BOARD,
                createDefaultStages: true,
            },
        ];

        const listPromises = lists.map((list) =>
            this.listsService.create({
                ...list,
                workspaceId: workspace.id,
            })
        );

        const crmLists = await Promise.all(listPromises);

        return crmLists;
    }
}

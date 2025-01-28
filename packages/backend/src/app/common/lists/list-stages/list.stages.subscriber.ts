import { Injectable } from "@nestjs/common";
import {
    Connection,
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    RemoveEvent,
} from "typeorm";
import { ListStage } from "./list.stage.entity";
import { ListGroup } from "../list-groups/list.group.entity";
import { ListGroupEntityTypes } from "../types";
import { ListGroupOptions } from "@tillywork/shared";

@Injectable()
@EventSubscriber()
export class ListStagesSubscriber
    implements EntitySubscriberInterface<ListStage>
{
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return ListStage;
    }

    async afterUpdate(event: UpdateEvent<ListStage>) {
        const listGroupRepo = event.manager.getRepository(ListGroup);
        const listGroup = await listGroupRepo.findOneBy({
            entityType: ListGroupEntityTypes.LIST_STAGE,
            type: ListGroupOptions.LIST_STAGE,
            entityId: event.entity.id,
            list: {
                id: event.entity.listId,
            },
        });

        if (listGroup) {
            listGroupRepo.merge(listGroup, {
                name: event.entity.name,
                color: event.entity.color,
                order: event.entity.order,
            });
            listGroupRepo.save(listGroup);
        }
    }

    async beforeRemove(event: RemoveEvent<ListStage>) {
        const listGroupRepo = event.manager.getRepository(ListGroup);
        const listGroup = await listGroupRepo.findOneBy({
            entityType: ListGroupEntityTypes.LIST_STAGE,
            type: ListGroupOptions.LIST_STAGE,
            entityId: event.entity.id,
            list: {
                id: event.entity.listId,
            },
        });

        if (listGroup) {
            listGroupRepo.remove(listGroup);
        }
    }
}

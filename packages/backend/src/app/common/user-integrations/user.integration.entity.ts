import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from "typeorm";
import { User } from "../users/user.entity";
import { IntegrationType, UserIntegrationConfig } from "@tillywork/shared";

@Entity()
@Unique(["user", "type"])
export class UserIntegration {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user: User;

    @Column({ type: "enum", enum: IntegrationType })
    type: IntegrationType;

    @Column({ type: "jsonb", default: {} })
    config: UserIntegrationConfig;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

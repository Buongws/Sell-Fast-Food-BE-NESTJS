import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

export interface PasswordResetTokenCreationAttributes {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdIp?: string | null;
  createdUserAgent?: string | null;
}

@Table
export class PasswordResetToken extends Model<
  PasswordResetToken,
  PasswordResetTokenCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ type: DataType.STRING, allowNull: false })
  declare tokenHash: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare usedAt: Date | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdIp: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdUserAgent: string | null;
}

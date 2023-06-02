import { TokenEntity } from "src/token/token.entity/token.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('token_iou_table')

export class TokenIouEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({ type: 'varchar', length: 42, nullable: false })
  creator: string;

  @Column({ type: 'double', nullable: false })
  circulatingSupply: number;

  @Column({ type: 'double', nullable: false })
  collateralAmount: number;

  @Column({ type: 'double', nullable: false })
  officialAmount: number;

  @Column({ type: 'boolean', nullable: false, default: 0 })
  isPublicPool: boolean;

  @Column({ type: 'int', nullable: false, unsigned: true })
  deadline: number;

  @OneToOne(() => TokenEntity)
  @JoinColumn()
  token: number;

  @ManyToOne(() => TokenEntity, (e) => e.tokenIouCollateral)
  tokenCollateral: number;

  @ManyToOne(() => TokenEntity, (e) => e.tokenIouOfficial)
  tokenOfficial: number;
}

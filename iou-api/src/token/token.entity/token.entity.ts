import { ChainEntity } from 'src/chain/chain.entity/chain.entity';
import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';
import { OrderBookEntity } from 'src/order-book/order-book.entity/order-book.entity';
import { TokenInfoEntity } from 'src/token-info/token-info.entity/token-info.entity';
import { TokenIouEntity } from 'src/token-iou/token-iou.entity/token-iou.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('token_table')
@Index(['contract', 'dappContract'], { unique: true })
export class TokenEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({ type: 'varchar', length: 42, nullable: false })
  contract: string;

  @Column({ type: 'int', nullable: false })
  tokenDecimal: number;

  @ManyToOne(() => TokenInfoEntity, (e) => e.tokens, { nullable: false })
  tokenInfo: number;

  @ManyToOne(() => DappContractEntity, (e) => e.tokens, { nullable: false })
  dappContract: number;

  @OneToMany(() => TokenIouEntity, (e) => e.tokenCollateral)
  tokenIouCollateral: TokenIouEntity[];

  @OneToMany(() => TokenIouEntity, (e) => e.tokenOfficial)
  tokenIouOfficial: TokenIouEntity[];
}

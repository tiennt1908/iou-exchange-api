import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';
import { OrderHistoryEntity } from 'src/order-history/order-history.entity/order-history.entity';
import { OrderStatusEntity } from 'src/order-status/order-status.entity/order-status.entity';
import { TokenEntity } from 'src/token/token.entity/token.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order_book_table')
export class OrderBookEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'bigint', nullable: false })
  orderIdOnchain: number;
  @Column({ type: 'varchar', length: 42, nullable: false })
  maker: string;
  @Column({ type: 'double', nullable: false })
  tokenInAmount: number;
  @Column({ type: 'double', nullable: false })
  tokenOutAmount: number;
  @Column({ type: 'double', nullable: false })
  tokenInAmountSold: number;
  @Column({ type: 'bigint', nullable: false })
  createAt: number;
  @Column({ type: 'varchar', length: 42, nullable: false })
  tokenIn: string;
  @Column({ type: 'varchar', length: 42, nullable: false })
  tokenOut: string;
  // @ManyToOne(() => TokenEntity, (e) => e.orderBookIn, { nullable: false })
  // tokenIn: number;
  // @ManyToOne(() => TokenEntity, (e) => e.orderBookOut, { nullable: false })
  // tokenOut: number;
  @ManyToOne(() => OrderStatusEntity, (e) => e.orderBook, { nullable: false })
  orderStatus: number;
  @ManyToOne(() => DappContractEntity, (e) => e.orderBook, { nullable: false })
  dappContract: number;
  @OneToMany(() => OrderHistoryEntity, (e) => e.orderBook)
  orderHistory: OrderHistoryEntity[];
}

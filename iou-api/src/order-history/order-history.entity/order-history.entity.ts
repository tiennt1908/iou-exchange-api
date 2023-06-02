import { OrderBookEntity } from 'src/order-book/order-book.entity/order-book.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_history_table')
export class OrderHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'varchar', length: 42, nullable: false })
  taker: string;
  @Column({ type: 'double', nullable: false })
  amount: number;
  @Column({ type: 'double', nullable: false })
  estimateValue: number;
  @Column({ type: 'bigint', nullable: false })
  orderAt: number;
  @ManyToOne(() => OrderBookEntity, (e) => e.orderHistory, { nullable: false })
  orderBook: number;
}

import { OrderBookEntity } from 'src/order-book/order-book.entity/order-book.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('order_status_table')
export class OrderStatusEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 32, nullable: false })
  statusName: string;
  @OneToMany(() => OrderBookEntity, (e) => e.orderStatus)
  orderBook: OrderBookEntity[];
}

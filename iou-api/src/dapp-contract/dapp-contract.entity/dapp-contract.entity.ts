import { ChainEntity } from "src/chain/chain.entity/chain.entity";
import { DappContractTypeEntity } from "src/dapp-contract-type/dapp-contract-type.entity/dapp-contract-type.entity";
import { OrderBookEntity } from "src/order-book/order-book.entity/order-book.entity";
import { TokenEntity } from "src/token/token.entity/token.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("dapp_contract_table")
export class DappContractEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;
  @Column({ type: 'varchar', length: 42, nullable: false })
  contract: string;
  @Column({ type: 'bigint', default: 0 })
  totalEventCalled: string;
  @ManyToOne(() => DappContractTypeEntity, (e) => e.dappContract, { nullable: false })
  type: number;
  @ManyToOne(() => ChainEntity, (e) => e.dappContract, { nullable: false })
  chain: ChainEntity;
  @OneToMany(() => OrderBookEntity, (e) => e.dappContract)
  orderBook: OrderBookEntity[];
  @OneToMany(() => TokenEntity, (e) => e.dappContract)
  tokens: TokenEntity[];
}

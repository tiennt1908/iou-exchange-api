import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';
import { TokenEntity } from 'src/token/token.entity/token.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('chain_table')
export class ChainEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 255
  })
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  chainName: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  logoURL: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  rpcURL: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  blockExplorerURL: string;
  @OneToMany(() => DappContractEntity, (e) => e.chain)
  dappContract: DappContractEntity[];
}

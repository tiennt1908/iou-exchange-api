import { DappContractEntity } from "src/dapp-contract/dapp-contract.entity/dapp-contract.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("dapp_contract_type_table")
export class DappContractTypeEntity {
  @PrimaryColumn({
    type: 'int',
  })
  id: number;
  @Column({ type: 'varchar', length: 42, nullable: false })
  type: string;
  @OneToMany(() => DappContractEntity, (e) => e.type)
  dappContract: DappContractEntity[];
}

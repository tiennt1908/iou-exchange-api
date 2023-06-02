import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('validator_table')
export class ValidatorEntity {
  @PrimaryColumn({ type: 'varchar', length: 42 })
  address: string;
  @Column({ type: "boolean" })
  isActive: boolean;
}

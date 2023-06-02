import { TokenEntity } from "src/token/token.entity/token.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('token_collateral_table')
export class TokenCollateralEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'double', default: 0 })
  price: number

  @OneToOne(() => TokenEntity)
  @JoinColumn()
  token: number;
}

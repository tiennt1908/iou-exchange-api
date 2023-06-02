import { TokenEntity } from "src/token/token.entity/token.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('token_official_table')
export class TokenOfficialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  totalTokenCreated: number;

  @OneToOne(() => TokenEntity)
  @JoinColumn()
  token: number;
}

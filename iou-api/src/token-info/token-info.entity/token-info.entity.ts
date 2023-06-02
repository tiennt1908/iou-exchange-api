import { TokenEntity } from 'src/token/token.entity/token.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token_info_table')
export class TokenInfoEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;
  @Column({ type: 'varchar', length: 128, nullable: false })
  tokenName: string;
  @Column({ type: 'varchar', length: 32, nullable: false })
  tokenSymbol: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  logoURL: string;
  @Column({ type: 'varchar', length: 64, nullable: true })
  websiteURL: string;
  @OneToMany(() => TokenEntity, (e) => e.tokenInfo)
  tokens: TokenEntity[];
}

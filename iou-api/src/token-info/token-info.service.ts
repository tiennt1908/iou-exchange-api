import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenInfoEntity } from './token-info.entity/token-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenInfoDTO } from './dto/create-token-info.dto';
import { ReturnQueryType } from 'src/helpers/type';

@Injectable()
export class TokenInfoService {
  constructor(
    @InjectRepository(TokenInfoEntity)
    private readonly tokenInfoClass: Repository<TokenInfoEntity>,
  ) {
    //
  }

  async create(tokenInfo: CreateTokenInfoDTO): Promise<ReturnQueryType> {
    const queryTokenInfo = await this.tokenInfoClass
      .createQueryBuilder()
      .insert()
      .into(TokenInfoEntity)
      .values(tokenInfo)
      .execute().catch((e) => {
        throw new HttpException({
          success: false,
          data: {
            code: e.code
          }
        }, HttpStatus.FORBIDDEN);
      })
    return {
      success: true,
      data: {
        id: queryTokenInfo.raw.id,
        ...tokenInfo,
      }
    };
  }
}

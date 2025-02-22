import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { decode as JwtDecode, verify as JwtVerify } from 'jsonwebtoken';

@Injectable()
export class JwtAdapterService {
  generateToken(payload: any): string {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
  }

  validateToken(token: string): any {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
  async validate(token: string) {
    const decodedToken: any = JwtDecode(token, { complete: true });

    const {
      header: { kid },
    } = decodedToken;

    JwtVerify(token, process.env.SECRET_KEY);
  }

  /**
   * Decode the token and return the payload for controller or service
   * @param token
   * @returns
   */
  async decodeToken(token: string) {
    const decodedToken: any = JwtDecode(token, { complete: true });
    return decodedToken.payload;
  }
}

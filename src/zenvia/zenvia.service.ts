import { Injectable } from '@nestjs/common';

@Injectable()
export class ZenviaService {
  async sendMessageWpp({
    from,
    to,
    message,
    token,
  }: {
    from: string;
    to: string;
    message: string;
    token: string;
  }) {
    const payload = {
      from: to,
      to: from,
      contents: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
    console.log('payload', payload);

    try {
      await fetch('https://api.zenvia.com/v2/channels/whatsapp/messages', {
        method: 'POST',
        headers: {
          'X-API-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log('error', error);
    }
    return true;
  }

  async sendMessageInstagram({
    from,
    to,
    message,
    token,
  }: {
    from: string;
    to: string;
    message: string;
    token: string;
  }) {
    const payload = {
      from: to,
      to: from,
      contents: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
    console.log('payload', payload);

    try {
      await fetch('https://api.zenvia.com/v2/channels/instagram/messages', {
        method: 'POST',
        headers: {
          'X-API-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log('error', error);
    }
    return true;
  }
}

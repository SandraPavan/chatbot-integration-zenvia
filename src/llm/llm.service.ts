import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  llmMessage: any;
  constructor() {
    this.llmMessage = [];
  }

  handleLLM = async (message: string, conversation: any[]): Promise<any> => {
    const responseMessage = await this.sendMessageToChatGPT(
      message,
      conversation,
    );
    return responseMessage;
  };

  sendMessageToChatGPT = async (message, context = []) => {
    const payload = {
      model: 'gpt-4', // or gpt-4 if available
      messages: [
        {
          role: 'system',
          content: `Relâmpago Marquinhos is an intelligent chatbot designed to help users validate car prices across multiple websites efficiently. Built with advanced web-scraping and automation technologies, it scans the inputted websites, extracts relevant vehicle pricing information, and compares them to market standards to ensure accuracy.

          Key Features:
          🚗 Website Input & Scraping – Users provide website URLs, and Relâmpago Marquinhos retrieves car price details automatically.
          🔍 Real-Time Price Validation – The chatbot analyzes and cross-references prices to identify inconsistencies or potential scams.
          📊 Comparative Analysis – It compares prices across different listings and provides insights on fair market value.
          📢 Alerts & Recommendations – Users receive notifications if a price appears suspiciously low or high.
          ⚡ Fast & Efficient – Designed for quick responses, making the validation process seamless and user-friendly.

          With Relâmpago Marquinhos, car buyers and sellers can confidently verify vehicle prices before making a decision, ensuring transparency and smarter purchasing choices.
          research the car price on websites you can use this website https://veiculos.fipe.org.br/ and return only 3 values
          
          What you can't do it:
          * You can't return/response a JSON
          * Before answer the question, you should research the car price on websites you can use this website https://veiculos.fipe.org.br/ and return only 3 values
          * max of 100 characters
          `,
        },
        {
          role: 'system',
          content: JSON.stringify({
            newMessage: message,
            oldMessages: context,
          }),
        },
      ],
      stream: true,
    };

    // When you start to validate the car price use this website: https://veiculos.fipe.org.br/
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      throw new Error('Streaming not supported in response.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let resultText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      try {
        // Process the incoming JSON data
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const json = JSON.parse(line.slice('data: '.length));
            const content = json.choices[0].delta?.content;
            if (content) {
              resultText += content;
              const responsemessage = (prevMessages: any) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...updatedMessages[updatedMessages.length - 1],
                  text: resultText,
                };
                this.llmMessage = updatedMessages;
                return updatedMessages;
              };
              responsemessage(this.llmMessage);
            }
          }
        }
      } catch (err) {
        console.error('Error processing chunk:', err);
      }
    }

    return resultText;
  };
}

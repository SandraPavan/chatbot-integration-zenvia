import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  llmMessage: any;
  constructor() {
    this.llmMessage = [];
  }

  handleLLM = async (
    message: string,
    conversation: any[],
    preferenceValues: any,
  ): Promise<any> => {
    const responseMessage = await this.sendMessageToChatGPT(
      message,
      conversation,
      preferenceValues,
    );
    return responseMessage;
  };

  sendMessageToChatGPT = async (message, context = [], preferenceValues) => {
    const payload = {
      model: preferenceValues.model, // or gpt-4 if available
      messages: [
        {
          role: 'system',
          content: preferenceValues.content,
        },
        {
          role: 'system',
          content: JSON.stringify({
            newMessage: message,
            oldMessages: context,
          }),
        },
      ],
      temperature: 0.25, // 0 - 2: lower is more deterministic, higher is more creative
      presence_penalty: -1, // -2 - 2: higher is more likely to include new topics (reducing repetition), lower is more likely to repeat topics
      frequency_penalty: 0.1, // -2 - 2: higher discourage word repetition. lower make the model more likely to repeat itself.
      stream: true,
    };

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

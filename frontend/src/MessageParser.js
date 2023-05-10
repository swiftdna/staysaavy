import { OpenAIApi } from 'openai';

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  async parse(message) {
    const userInput = message.text;
    
    const openai = new OpenAIApi({
      apiKey: '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'
    });

    try {
      const gptResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "hello"
          },
          {
            
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 60
      });

      this.actionProvider.handleMessage(gptResponse.data.choices[0].message.content.trim());
    } catch (error) {
      console.error(error);
    }
  }
}

export default MessageParser;

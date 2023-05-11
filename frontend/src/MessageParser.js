import { OpenAIApi, Configuration } from 'openai';

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  async parse(message) {
    // console.log(message);
    // const userInput = message.text;

    const configuration = new Configuration({
      apiKey: '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',
    });
    
    const openai = new OpenAIApi(configuration);
    // console.log('userInput -> ', userInput);
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
            content: message
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

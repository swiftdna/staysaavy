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
      // const gptResponse = await openai.createChatCompletion({
      //   model: 'davinci:ft-personal-2023-05-11-20-12-31',
      //   messages: [
      //     {
      //       role: "system",
      //       content: "hello"
      //     },
      //     {
      //       role: "user",
      //       content: message
      //     }
      //   ],
      //   max_tokens: 60
      // });

      const gptResponse = await openai.createCompletion({
        model: 'davinci:ft-personal-2023-05-11-20-12-31',
        prompt: message,
        max_tokens: 60,
        n: 1,
        stop: '\n'
      });

      // this.actionProvider.handleMessage(gptResponse.data.choices[0].message.content.trim());
      this.actionProvider.handleMessage(gptResponse.data.choices[0].text.trim());
    } catch (error) {
      console.error(error);
    }
  }
}

export default MessageParser;

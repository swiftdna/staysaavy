class ActionProvider {
    constructor(
     createChatBotMessage,
     setStateFunc,
     createClientMessage,
     stateRef,
     createCustomMessage,
     ...rest
   ) {
     this.createChatBotMessage = createChatBotMessage;
     this.setState = setStateFunc;
     this.createClientMessage = createClientMessage;
     this.stateRef = stateRef;
     this.createCustomMessage = createCustomMessage;
   }

   handleMessage(message) {
    // handle the message
    const greetingMessage = this.createChatBotMessage(message);
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, greetingMessage],
    }));
  }
 }
 
 export default ActionProvider;
 
import { BasePromptTemplate, PromptTemplate } from "langchain/prompts";
import {
  AIChatMessage,
  HumanChatMessage,
  InputValues,
  SystemChatMessage,
} from "langchain/schema";
import { ChatMessageBase } from "../interfaces/chat-message-base";

export class PromptBaseService {
  private templateString?: string;
  private promptString?: string;

  constructor(args: { template?: string; prompt?: string }) {
    this.templateString = args.template;
    this.promptString = args.prompt;
  }

  public get template(): string | undefined {
    return this.templateString;
  }

  public get prompt(): string | undefined {
    return this.promptString;
  }

  public static async buildPrompt<T extends InputValues>(
    query: string,
    inputVars?: T
  ): Promise<PromptBaseService> {
    const promptString = PromptTemplate.fromTemplate(query);
    return new PromptBaseService({
      prompt: await promptString.format({ ...inputVars }),
    });
  }

  public static async buildSystemMessage(
    message: string
  ): Promise<ChatMessageBase> {
    const systemMessage = new SystemChatMessage(message);
    return {
      role: systemMessage._getType(),
      content: systemMessage.text,
    };
  }

  public static async buildHumanMessage(
    message: string
  ): Promise<ChatMessageBase> {
    const humanMessage = new HumanChatMessage(message);
    return {
      role: humanMessage._getType(),
      content: humanMessage.text,
    };
  }

  public static async buildBotMessage(
    message: string
  ): Promise<ChatMessageBase> {
    const aiMessage = new AIChatMessage(message);
    return {
      role: aiMessage._getType(),
      content: aiMessage.text,
    };
  }

  public static buildPromptTemplate(
    query: string,
    inputVars?: string[]
  ): BasePromptTemplate {
    return new PromptTemplate({
      template: query,
      inputVariables: inputVars ?? [],
    });
  }
}

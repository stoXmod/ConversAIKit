import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { InputValues } from "langchain/schema";
import { PromptBaseService } from "./PromptBaseService";
import { ChatOpenAI } from "langchain/chat_models";
import { ChatPromptTemplate } from "langchain/prompts";

export class ChainService {
  public static buildLLMChain<T extends InputValues>(
    llm: OpenAI | ChatOpenAI,
    rawTemplate: string | ChatPromptTemplate,
    inputVars?: string[]
  ) {
    return new LLMChain({
      llm: llm,
      prompt:
        rawTemplate instanceof ChatPromptTemplate
          ? rawTemplate
          : PromptBaseService.buildPromptTemplate(rawTemplate, inputVars),
    });
  }
}

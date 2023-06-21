import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { InputValues } from "langchain/schema";
import { PromptBaseService } from "./PromptBaseService";

export class ChainService {
  public static buildLLMChain<T extends InputValues>(
    llm: OpenAI,
    query: string,
    inputVars?: string[]
  ) {
    return new LLMChain({
      llm: llm,
      prompt: PromptBaseService.buildPromptTemplate(query, inputVars),
    });
  }
}

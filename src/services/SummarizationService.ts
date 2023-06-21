import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { templates } from "../utils/templates";
import { PromptTemplate } from "langchain/prompts";
import chunkSubstr from "../helpers/chunkSubStringer";

export class SummarizationService {
  private model: OpenAI;
  private promptTemplate: PromptTemplate;

  constructor(private openAIApiKey: string, model?: string) {
    this.model = new OpenAI({
      openAIApiKey: openAIApiKey,
      modelName: model ?? "gpt-3.5-turbo",
      maxConcurrency: 10,
      temperature: 0,
    });

    this.promptTemplate = new PromptTemplate({
      template: templates.summarizerTemplate,
      inputVariables: ["document", "inquiry"],
    });
  }

  public async summarize(
    document: string,
    inquiry: string,
    onSummaryDone?: Function
  ) {
    const chain = new LLMChain({
      prompt: this.promptTemplate,
      llm: this.model,
    });

    try {
      const result = await chain.call({
        prompt: this.promptTemplate,
        document,
        inquiry,
      });

      onSummaryDone && onSummaryDone(result.text);
      return result.text;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  public async summarizeLongDocument(
    document: string,
    inquiry: string,
    onSummaryDone?: Function
  ): Promise<string> {
    // Chunk document into 4000 character chunks
    try {
      if (document.length > 3000) {
        const chunks = chunkSubstr(document, 4000);
        let summarizedChunks: string[] = [];
        for (const chunk of chunks) {
          const result = await this.summarize(chunk, inquiry, onSummaryDone);
          summarizedChunks.push(result);
        }

        const result = summarizedChunks.join("\n");

        if (result.length > 4000) {
          return await this.summarizeLongDocument(
            result,
            inquiry,
            onSummaryDone
          );
        } else return result;
      } else {
        return document;
      }
    } catch (e) {
      throw new Error(e as string);
    }
  }
}

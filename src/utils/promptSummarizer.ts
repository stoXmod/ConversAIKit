import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { templates } from './templates'
import chunkSubstr from "../helpers/chunkSubStringer";

const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    maxConcurrency: 10,
    temperature: 0,
})

// creating summarization prompt template
const promptTemplate = new PromptTemplate({
    template: templates.summarizerTemplate,
    inputVariables: ['document', 'inquiry'],
})

// Summarize the given document and inquiry
const summarize = async (
    document: string,
    inquiry: string,
    onSummaryDone: Function
) => {
    const chain = new LLMChain({
        prompt: promptTemplate,
        llm,
    })

    try {
        const result = await chain.call({
            prompt: promptTemplate,
            document,
            inquiry,
        })

        onSummaryDone(result.text)
        return result.text
    } catch (e) {
        console.log(e)
    }
}

// inquiry = user prompt + chat history
const summarizeLongDocument = async (
    llm:OpenAI,
    document: string,
    inquiry: string,
    onSummaryDone: Function
): Promise<string> => {
    // Chunk document into 4000 character chunks
    try {
        if (document.length > 3000) {
            const chunks = chunkSubstr(document, 4000)
            let summarizedChunks: string[] = []
            for (const chunk of chunks) {
                const result = await summarize(chunk, inquiry, onSummaryDone)
                summarizedChunks.push(result)
            }

            const result = summarizedChunks.join('\n')

            if (result.length > 4000) {
                return await summarizeLongDocument(
                    llm,
                    result,
                    inquiry,
                    onSummaryDone
                )
            } else return result
        } else {
            return document
        }
    } catch (e) {
        throw new Error(e as string)
    }
}

export { summarizeLongDocument }

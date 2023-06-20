import { PineconeClient, ScoredVector } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { CustomPDFLoader } from "../utils/customPDFLoader";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

export class PineconeService {
  private client: PineconeClient | null = null;

  constructor(
    private environment: string,
    private apiKey: string,
    private indexName: string
  ) {}

  public async init(): Promise<void> {
    if (!this.client) {
      this.client = new PineconeClient();

      await this.client.init({
        environment: this.environment,
        apiKey: this.apiKey,
      });
    }
  }

  public async embedUserIntent(embedder: OpenAIEmbeddings, inquiry: string) {
    this.ensureInitialized();
    return await embedder.embedQuery(inquiry);
  }

  public async getMatchesFromEmbeddings(
    indexName: string,
    embeddings: any[],
    topK: number
  ): Promise<ScoredVector[]> {
    this.ensureInitialized();

    const index = this.client!.Index(indexName);
    const queryRequest = {
      vector: embeddings,
      topK,
      includeMetadata: true,
    };

    try {
      const queryResult = await index.query({
        queryRequest,
      });
      return (
        queryResult.matches?.map((match) => ({
          ...match,
          metadata: match.metadata as Metadata,
        })) || []
      );
    } catch (e) {
      console.log("Error querying embeddings: ", e);
      throw new Error(`Error querying embeddings: ${e}`);
    }
  }

  public static processMatches = (matches: ScoredVector[]) => {
    return (
      matches &&
      Array.from(
        matches.reduce((map: Map<string, string>, match: any) => {
          const metadata = match.metadata as Metadata;
          const { text } = metadata;
          map.set(text, text);
          return map;
        }, new Map())
      ).map(([_, text]: [any, any]) => text)
    );
  };

  // ingest data into pinecone
  public async ingestData(folderPath: string): Promise<void> {
    this.ensureInitialized();

    try {
      const directoryLoader = new DirectoryLoader(folderPath, {
        ".pdf": (path) => new CustomPDFLoader(path),
      });

      const rawDocs = await directoryLoader.load();

      /* Split text into chunks */
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await textSplitter.splitDocuments(rawDocs);
      console.log("creating vector store...");
      /*create and store the embeddings in the vectorStore*/
      const embeddings = new OpenAIEmbeddings({
        modelName: "text-embedding-ada-002",
      });

      const index = this.client!.Index(this.indexName);

      //embed the PDF documents
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: this.environment,
        textKey: "text",
      });

      return Promise.resolve();
    } catch (e) {
      console.log("Error ingesting data: ", e);
      throw new Error(`Error ingesting data: ${e}`);
    }
  }

  private ensureInitialized(): void {
    if (!this.client) {
      throw new Error(
        "Pinecone client not initialized. Call the 'init' method before performing operations."
      );
    }
  }
}

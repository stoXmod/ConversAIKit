# ConversAIKit

ConversAI is a TypeScript-based framework designed to handle conversations in your applications effectively and
efficiently. It provides integration with Langchain, Pinecone, and Ably to bring the power of conversational AI into
your hands.

## Functional Requirements

### Integration with Langchain

Enable seamless communication and interactions with Langchain for processes such as token handling, conversation
management, and language model management.

### Document Embedding with Pinecone

Support for embedding documents using Pinecone. This includes initializing Pinecone, creating embeddings, and querying
them.

### Prompt Management

Provide a mechanism for handling and managing various prompt templates. This includes adding interactions to the session
and building inquiry chains.

## Common Functionalities

### Pinecone Data Processes

Handling Pinecone-related tasks such as client initialization, embedding creation, and query execution.

### PromptBase Management

Support for the handling of various prompt templates and managing chains in Langchain's PromptBase.

### Document Summarization

Enable the summarization of lengthy documents into shorter, concise summaries using external tools or libraries.

## Core Services

### PineconeService

Manages all interactions with Pinecone, including initializations, embeddings, and querying.

### AblyService

Handles all communications with Ably for real-time updates, including client initialization, publishing events, and
generating token requests.

### SummarizationService

Responsible for the document summarization process.

### ChainService

Oversees the building and handling of Langchain chains.

### PromptBaseService

Controls interactions with Langchain's PromptBase, such as adding interactions and building chains and templates.

## Installation

To install ConversAI in your project, run:

```bash
npm install conversai

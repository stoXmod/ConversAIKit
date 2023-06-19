import { MessageType } from 'langchain/schema'

export interface ChatMessageBase {
    readonly role: MessageType
    content: string
}

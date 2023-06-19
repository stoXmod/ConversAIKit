const templates = {
    summarizerTemplate: `Shorten the text in the CONTENT, attempting to answer the INQUIRY. 
    INQUIRY: {inquiry}
    CONTENT: {document}
    You should follow the following rules when generating the summary:
    - Do not include any codes.
    - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty.
    - If the INQUIRY cannot be answered, the final answer should be empty.
    - The summary should be under 4000 characters.    

    Final answer:
    `,
}

export { templates }

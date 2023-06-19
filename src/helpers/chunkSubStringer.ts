const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);
  return Array.from({ length: numChunks }, (_, i) =>
    str.substring(i * size, (i + 1) * size)
  );
};
export default chunkSubstr;

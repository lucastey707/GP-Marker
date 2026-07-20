type EmbeddingInputType = "document" | "query";

export async function getEmbedding(
  text: string,
  inputType: EmbeddingInputType
): Promise<number[]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3-large",
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Voyage AI request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function askAI({ prompt, model }) {
  const selectedModel = model || 'Qwen/Qwen2.5-72B-Instruct';
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: selectedModel,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Falha na API (${response.status}).`);
  }

  if (!data.answer) {
    throw new Error('A API devolveu uma resposta sem conteudo valido.');
  }

  return {
    answer: data.answer,
    model: data.model || selectedModel,
    source: data.source || 'huggingface-qwen',
  };
}

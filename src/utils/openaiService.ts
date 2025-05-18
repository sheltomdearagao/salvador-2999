
interface OpenAIResponse {
  success: boolean;
  evaluation?: string;
  error?: string;
  score?: number;
}

export const evaluateMissionResponse = async (
  missionPrompt: string,
  userResponse: string,
  apiKey: string
): Promise<OpenAIResponse> => {
  if (!apiKey) {
    return {
      success: false,
      error: "Chave da API não encontrada."
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um avaliador de respostas para um jogo educativo sobre intervenções sociais em Salvador. Avalie a resposta do jogador em uma escala de 0 a 10, considerando: criatividade, viabilidade, impacto social, e clareza. Forneça feedback construtivo e sugestões para melhorar. Responda em português do Brasil. Formato da resposta: uma avaliação de 2-3 parágrafos e uma nota final."
          },
          {
            role: "user",
            content: `Missão: ${missionPrompt}\n\nResposta do jogador: ${userResponse}\n\nAvalie esta resposta.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return {
        success: false,
        error: data.error.message || "Erro ao processar a avaliação."
      };
    }

    const evaluation = data.choices[0].message.content;
    
    // Extrair pontuação (se presente no formato "Nota: X/10")
    const scoreMatch = evaluation.match(/Nota:?\s*(\d+(?:\.\d+)?)\/10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;

    return {
      success: true,
      evaluation,
      score
    };
  } catch (error) {
    console.error("Erro ao avaliar resposta:", error);
    return {
      success: false,
      error: "Falha na conexão com a API da OpenAI."
    };
  }
};

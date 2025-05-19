
interface OpenAIResponse {
  success: boolean;
  evaluation?: string;
  error?: string;
  score?: number;
  elementsCount?: number; // Número de elementos válidos identificados
}

// Chave API fixa (ATENÇÃO: Esta chave deve ser movida para um backend em produção)
const OPENAI_API_KEY = "sua_chave_api_aqui"; // Substitua por sua chave API real

export const evaluateMissionResponse = async (
  missionPrompt: string,
  userResponse: string,
): Promise<OpenAIResponse> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um avaliador especializado na Competência V da redação do ENEM, que avalia propostas de intervenção. 
            
            Uma proposta de intervenção COMPLETA deve apresentar 5 elementos: 
            1. Ação (O quê?) - O que deve ser feito para solucionar ou mitigar o problema
            2. Agente (Quem?) - Quem será o responsável por executar a ação proposta
            3. Modo/Meio (Como?) - De que maneira ou através de qual recurso a ação será realizada
            4. Efeito (Para quê?) - Finalidade ou resultado esperado da ação proposta
            5. Detalhamento - Informação adicional sobre algum dos elementos anteriores
            
            Analise a resposta do jogador e identifique quantos desses elementos estão presentes corretamente. 
            Avalie a proposta de intervenção em uma escala de 0 a 10. 
            Uma proposta com 4 ou 5 elementos deve receber nota mínima 8. 
            Uma proposta com 3 elementos deve receber nota entre 5 e 7.
            Uma proposta com 1 ou 2 elementos deve receber nota abaixo de 5.
            
            Forneça feedback construtivo e sugestões de melhoria. Identifique explicitamente quais elementos estão presentes e quais estão ausentes.
            
            Estrutura da avaliação:
            1. Análise dos elementos presentes (listar cada um encontrado)
            2. Elementos ausentes ou que precisam de melhorias
            3. Nota final (formato "Nota: X/10")
            4. Quantidade de elementos válidos (formato "Elementos: Y/5")
            `
          },
          {
            role: "user",
            content: `Missão: ${missionPrompt}\n\nResposta do jogador: ${userResponse}\n\nAvalie esta proposta de intervenção conforme os critérios da Competência V.`
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
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
    
    // Extrair pontuação (formato "Nota: X/10")
    const scoreMatch = evaluation.match(/Nota:?\s*(\d+(?:\.\d+)?)\/10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
    
    // Extrair contagem de elementos (formato "Elementos: Y/5")
    const elementsMatch = evaluation.match(/Elementos:?\s*(\d+)\/5/i);
    const elementsCount = elementsMatch ? parseInt(elementsMatch[1]) : undefined;

    return {
      success: true,
      evaluation,
      score,
      elementsCount
    };
  } catch (error) {
    console.error("Erro ao avaliar resposta:", error);
    return {
      success: false,
      error: "Falha na conexão com a API da OpenAI."
    };
  }
};

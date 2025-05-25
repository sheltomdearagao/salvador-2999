
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/utils/encryption";

interface OpenAIResponse {
  success: boolean;
  evaluation?: string;
  error?: string;
  score?: number;
  elementsCount?: number;
}

const API_KEY_STORAGE = 'salvador2999_openai_key';

// Função para sanitizar dados sensíveis dos logs
const sanitizeForLog = (data: any) => {
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    if (sanitized.apiKey) {
      sanitized.apiKey = sanitized.apiKey.substring(0, 8) + '***';
    }
    return sanitized;
  }
  return data;
};

export const evaluateMissionResponse = async (
  missionPrompt: string,
  userResponse: string,
): Promise<OpenAIResponse> => {
  try {
    // Recuperar a chave API de forma segura
    const apiKey = secureRetrieve(API_KEY_STORAGE);
    
    if (!apiKey) {
      return {
        success: false,
        error: "Chave API não encontrada ou expirada. Por favor, configure sua chave API novamente."
      };
    }

    // URL da edge function do Supabase
    const EDGE_FUNCTION_URL = "https://yzwozlxcoexeuondbytt.supabase.co/functions/v1/evaluate-mission";
    
    console.log("Enviando requisição para avaliação (dados sanitizados):", 
      sanitizeForLog({ missionPrompt: missionPrompt.substring(0, 50) + "...", userResponse: userResponse.substring(0, 50) + "..." })
    );
    
    // Enviar a requisição para a edge function (sem autenticação)
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-API-Key": apiKey, // Enviar a chave via header customizado
      },
      body: JSON.stringify({
        missionPrompt,
        userResponse,
      }),
    });

    const result = await response.json();
    
    // Salvar a avaliação no banco de dados para referência futura (sem dados sensíveis)
    if (result.success) {
      try {
        await supabase.from('mission_evaluations').insert({
          mission_id: missionPrompt.substring(0, 50), // Identificador simplificado da missão
          user_response: userResponse,
          evaluation: result.evaluation,
          score: result.score,
          elements_count: result.elementsCount
        });
        console.log("Avaliação salva no banco com sucesso");
      } catch (dbError) {
        console.error("Erro ao salvar avaliação no banco:", sanitizeForLog(dbError));
        // Não interrompe o fluxo se houver erro ao salvar no banco
      }
    }

    return result;
  } catch (error) {
    console.error("Erro ao avaliar resposta:", sanitizeForLog(error));
    return {
      success: false,
      error: "Falha na conexão com o serviço de avaliação."
    };
  }
};

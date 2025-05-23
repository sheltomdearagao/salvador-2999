
import { supabase } from "@/integrations/supabase/client";

interface OpenAIResponse {
  success: boolean;
  evaluation?: string;
  error?: string;
  score?: number;
  elementsCount?: number; // Número de elementos válidos identificados
}

export const evaluateMissionResponse = async (
  missionPrompt: string,
  userResponse: string,
): Promise<OpenAIResponse> => {
  try {
    // URL da edge function do Supabase
    const EDGE_FUNCTION_URL = "https://yzwozlxcoexeuondbytt.supabase.co/functions/v1/evaluate-mission";
    
    // Enviar a requisição para a edge function (sem autenticação)
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        missionPrompt,
        userResponse,
      }),
    });

    const result = await response.json();
    
    // Salvar a avaliação no banco de dados para referência futura
    if (result.success) {
      try {
        await supabase.from('mission_evaluations').insert({
          mission_id: missionPrompt.substring(0, 50), // Identificador simplificado da missão
          user_response: userResponse,
          evaluation: result.evaluation,
          score: result.score,
          elements_count: result.elementsCount
        });
      } catch (dbError) {
        console.error("Erro ao salvar avaliação no banco:", dbError);
        // Não interrompe o fluxo se houver erro ao salvar no banco
      }
    }

    return result;
  } catch (error) {
    console.error("Erro ao avaliar resposta:", error);
    return {
      success: false,
      error: "Falha na conexão com o serviço de avaliação."
    };
  }
};

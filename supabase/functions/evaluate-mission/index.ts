
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

serve(async (req) => {
  // Habilitando CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    console.log("📝 Recebendo requisição para avaliação de missão");
    const { missionPrompt, userResponse } = await req.json();
    
    // Verificar se os dados necessários estão presentes
    if (!missionPrompt || !userResponse) {
      console.error("❌ Dados incompletos na requisição");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Dados incompletos. Por favor, forneça o prompt da missão e a resposta do usuário." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Verificar se a chave da API está configurada
    if (!OPENAI_API_KEY) {
      console.error("❌ Chave da API OpenAI não encontrada nas variáveis de ambiente");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Chave da API OpenAI não configurada no ambiente Supabase." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    console.log("🔑 Chave da API OpenAI encontrada, enviando requisição");
    // Enviar requisição para a API OpenAI
    const response = await fetch(OPENAI_API_URL, {
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
      console.error("❌ Erro na API OpenAI:", data.error.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error.message || "Erro ao processar a avaliação." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    console.log("✅ Avaliação concluída com sucesso");
    const evaluation = data.choices[0].message.content;
    
    // Extrair pontuação (formato "Nota: X/10")
    const scoreMatch = evaluation.match(/Nota:?\s*(\d+(?:\.\d+)?)\/10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
    
    // Extrair contagem de elementos (formato "Elementos: Y/5")
    const elementsMatch = evaluation.match(/Elementos:?\s*(\d+)\/5/i);
    const elementsCount = elementsMatch ? parseInt(elementsMatch[1]) : undefined;

    // Montando a resposta final
    const result = {
      success: true,
      evaluation,
      score,
      elementsCount
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erro na função de avaliação:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro desconhecido." }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

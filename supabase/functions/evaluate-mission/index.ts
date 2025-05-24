
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
            content: `Você é um especialista em avaliação da Competência V da redação do ENEM.

CRITÉRIOS DE AVALIAÇÃO:
Uma proposta de intervenção completa deve ter 5 elementos:
1. AÇÃO - O que deve ser feito (verbo/ação concreta)
2. AGENTE - Quem executará (governo, ministério, escola, família, etc.)
3. MODO/MEIO - Como será feito (por meio de, através de, etc.)
4. EFEITO - Para que serve (finalidade: para que, a fim de, etc.)
5. DETALHAMENTO - Informação adicional sobre qualquer elemento

PONTUAÇÃO:
- 5 elementos = 200 pontos
- 4 elementos = 160 pontos  
- 3 elementos = 120 pontos
- 2 elementos = 80 pontos
- 1 elemento = 40 pontos
- 0 elementos = 0 pontos

FORMATO DE RESPOSTA OBRIGATÓRIO:
## Análise dos Elementos

**Elementos identificados:**
[Liste cada elemento encontrado]

**Elementos ausentes:**
[Liste elementos que faltam]

## Resultado
**Pontuação:** X/200
**Elementos válidos:** Y/5

## Sugestões
[Dicas específicas para melhorar]

Seja objetivo e use exatamente este formato.`
          },
          {
            role: "user",
            content: `**Missão:** ${missionPrompt}\n\n**Resposta do usuário:** ${userResponse}\n\nAvalie esta proposta de intervenção.`
          }
        ],
        temperature: 0.2,
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
    
    // Extrair pontuação com regex mais robusta
    const scoreMatch = evaluation.match(/\*\*Pontuação:\*\*\s*(\d+)\/200/i) || 
                     evaluation.match(/Pontuação:\s*(\d+)\/200/i) ||
                     evaluation.match(/(\d+)\/200/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : undefined;
    
    // Extrair elementos válidos
    const elementsMatch = evaluation.match(/\*\*Elementos válidos:\*\*\s*(\d+)\/5/i) ||
                         evaluation.match(/Elementos válidos:\s*(\d+)\/5/i) ||
                         evaluation.match(/(\d+)\/5/);
    const elementsCount = elementsMatch ? parseInt(elementsMatch[1]) : undefined;

    console.log("📊 Pontuação extraída:", score);
    console.log("📊 Elementos extraídos:", elementsCount);

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

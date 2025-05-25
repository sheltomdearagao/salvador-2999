
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Rate limiting - máximo 10 avaliações por IP por hora
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora em ms

function getRealIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Habilitando CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Verificar rate limiting
    const clientIP = getRealIP(req);
    if (!checkRateLimit(clientIP)) {
      console.log(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Muitas avaliações. Tente novamente em 1 hora." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429 
        }
      );
    }

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

    // Usar apenas a chave API do ambiente (configurada pelo desenvolvedor)
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      console.error("❌ Chave da API OpenAI não configurada no servidor");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Serviço temporariamente indisponível. Tente novamente mais tarde." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503 
        }
      );
    }

    console.log(`🔑 Usando chave da API OpenAI do ambiente (IP: ${clientIP})`);

    // Enviar requisição para a API OpenAI
    const response = await fetch(OPENAI_API_URL, {
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
            content: `Você é um especialista em avaliação da Competência V da redação do ENEM.

INSTRUÇÕES IMPORTANTES:
- Você DEVE responder EXATAMENTE no formato especificado abaixo
- Use Markdown para formatação clara
- Seja preciso na identificação dos elementos

CRITÉRIOS DE AVALIAÇÃO:
Uma proposta de intervenção completa deve ter 5 elementos:

1. **AÇÃO** - O que deve ser feito (verbo/ação concreta)
2. **AGENTE** - Quem executará (governo, ministério, escola, família, etc.)
3. **MODO/MEIO** - Como será feito (por meio de, através de, etc.)
4. **EFEITO** - Para que serve (finalidade: para que, a fim de, etc.)
5. **DETALHAMENTO** - Informação adicional sobre qualquer elemento

PONTUAÇÃO:
- 5 elementos = 200 pontos
- 4 elementos = 160 pontos  
- 3 elementos = 120 pontos
- 2 elementos = 80 pontos
- 1 elemento = 40 pontos
- 0 elementos = 0 pontos

FORMATO DE RESPOSTA OBRIGATÓRIO (use exatamente este formato):

## 📊 Análise dos Elementos

### ✅ Elementos identificados:
[Liste cada elemento encontrado com explicação clara]

### ❌ Elementos ausentes:
[Liste elementos que faltam]

---

## 🎯 Resultado Final
**Pontuação:** X/200  
**Elementos válidos:** Y/5

---

## 💡 Sugestões de Melhoria
[Dicas específicas e práticas para melhorar]

IMPORTANTE: Use exatamente este formato com os emojis e estrutura Markdown especificados.`
          },
          {
            role: "user",
            content: `**Missão:** ${missionPrompt}\n\n**Resposta do usuário:** ${userResponse}\n\nAvalie esta proposta de intervenção seguindo rigorosamente o formato especificado.`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Erro na API OpenAI:", data.error.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao processar a avaliação. Tente novamente." 
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
      JSON.stringify({ success: false, error: "Erro interno do servidor." }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

function validateRequestBody(body: any): { valid: boolean, error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Corpo da requisição deve ser um objeto JSON." };
  }
  const { missionPrompt, userResponse } = body;
  if (typeof missionPrompt !== "string" || !missionPrompt.trim()) {
    return { valid: false, error: "O 'missionPrompt' deve ser uma string não vazia." };
  }
  if (typeof userResponse !== "string" || !userResponse.trim()) {
    return { valid: false, error: "O 'userResponse' deve ser uma string não vazia." };
  }
  // Limite do tamanho dos campos (ex: 2048 caracteres cada)
  if (missionPrompt.length > 2048) {
    return { valid: false, error: "O 'missionPrompt' deve ter no máximo 2048 caracteres." };
  }
  if (userResponse.length > 2048) {
    return { valid: false, error: "O 'userResponse' deve ter no máximo 2048 caracteres." };
  }
  return { valid: true };
}

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
    // Limitar tamanho do body (ex: 4KB)
const MAX_BODY_SIZE = 54096;

let rawBody = new Uint8Array();
try {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Body reader não disponível.");
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_BODY_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: "Requisição muito grande. Tamanho máximo: 4KB." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 413 }
      );
    }
    const tmp = new Uint8Array(rawBody.length + value.length);
    tmp.set(rawBody);
    tmp.set(value, rawBody.length);
    rawBody = tmp;
  }
} catch {
  return new Response(
    JSON.stringify({ success: false, error: "Erro ao ler o corpo da requisição." }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
  );
}
let bodyJson;
try {
  bodyJson = JSON.parse(new TextDecoder().decode(rawBody));
} catch {
  return new Response(
    JSON.stringify({ success: false, error: "Body inválido. Envie um JSON válido." }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
  );
} });
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
    const { missionPrompt, userResponse } = bodyJson;
const validation = validateRequestBody(bodyJson);
if (!validation.valid) {
  return new Response(
    JSON.stringify({ success: false, error: validation.error }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
  );
}
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

# ✅ PROMPT DEFINITIVO PARA AVALIAÇÃO DA COMPETÊNCIA 5 DO ENEM
# 👇 Use este comando com modelos da OpenAI (GPT-4-turbo ou superior) para corrigir automaticamente propostas de intervenção.
# 🚀 Otimizado para integração com ferramentas automáticas via API ou interface direta no Playground.
# 🧠 Baseado em critérios oficiais do ENEM + diretrizes específicas do professor Sheltom.

Sua tarefa é analisar a proposta de intervenção apresentada em uma redação do ENEM, avaliando a Competência 5 com base nos critérios abaixo. Siga o passo a passo com rigor. Use marcações com emojis e linguagem acessível para estudantes adolescentes.

---

🎯 OBJETIVO:
Corrigir a Competência 5 da redação do ENEM com base no número de elementos **explícitos e válidos** na proposta de intervenção apresentada.

---

🧩 ETAPAS:

1. **Identifique as propostas de intervenção.**
   - Se houver mais de uma, avalie **apenas aquela com mais elementos válidos**.
   - Não some elementos de propostas diferentes.
   - Informe ao final qual proposta foi considerada para atribuição da nota.

2. **Avalie a proposta com base nos 5 elementos obrigatórios:**

   ✅ **AÇÃO** → O que deve ser feito?
   - Válido: “criar campanhas”, “investir em projetos sociais”.
   - Nulo: “é necessário agir”, “medidas devem ser tomadas”.

   ✅ **AGENTE** → Quem executará a ação?
   - Válido: “o governo federal”, “ONGs”, “a mídia”, “as escolas”.
   - Nulo: “deve-se promover” (sem indicar o agente).

   ✅ **MEIO/MODO** → Como a ação será realizada? SEMPRE introduzido por expressões como "através de", "por meio de", "mediante", "por intermédio de", e equivalentes
   - Válido: “por meio de aplicativos”, “com palestras em escolas públicas”.
   - Nulo: “de forma eficaz”, “com responsabilidade”, "rapidamente".

   ✅ **FINALIDADE** → Para quê? Qual o objetivo da ação?
   - Válido: “a fim de reduzir o preconceito”, “com o objetivo de informar os jovens”.
   - Nulo: “para o bem de todos”, “visando melhorias” (vago ou decorativo).

   ✅ **DETALHAMENTO** → Informação específica, concreta e relevante que complementa outro elemento (agente, ação, meio ou finalidade). O detalhamento pode se apresentar como exemplificação ou comparação.
   - Válido: “campanhas elaboradas com influenciadores digitais para o público adolescente”.
   - Nulo: repetição de outro elemento com outras palavras, ou algo genérico.
   - Válido: "(...), onde/em que o celular seja uma ferramenta de apoio, e não um empecilho à educação"

3. **Atenção a estruturas condicionais!**
   - Se a proposta estiver formulada como hipótese (ex: “caso medidas sejam tomadas...”), atribua diretamente **80 pontos**.
   - Ignore a contagem de elementos nesse caso.

4. **Desconsidere elementos implícitos, subentendidos ou vagos.**
   - Avalie apenas o que está claramente **explícito no texto**.
   - Não complete lacunas com inferências nem recompense formulações incompletas.

5. **Nunca conte o mesmo trecho escrito para dois elementos diferentes**

6. **Ao final, ofereça sugestões de como a proposta avaliada poderia ficar completa**

7. **Se algum elemento não estiver presente, não precisa expor nenhum trecho** 
-Exponha apenas trechos de elementos válidos e inválidos, explicando porque são válidos ou não.
---

📊 TABELA DE PONTUAÇÃO:

- 🟢 5 elementos válidos → **200 pontos**
- 🔵 4 elementos válidos → **160 pontos**
- 🟡 3 elementos válidos → **120 pontos**
- 🟠 2 elementos válidos ou estrutura condicional → **80 pontos**
- 🔴 1 elemento válido ou todos nulos → **40 pontos**
- ⚫ Nenhum elemento válido → **0 pontos**

---

          },
          {
            role: "user",
            content: `**Missão:** ${missionPrompt}\n\n**Resposta do usuário:** ${userResponse}\n\nAvalie esta proposta de intervenção seguindo rigorosamente o formato especificado.`
          }
        ],
        temperature: 0.91,
        max_tokens: 2500,
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

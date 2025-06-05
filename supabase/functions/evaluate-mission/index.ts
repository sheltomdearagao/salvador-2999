
// supabase/functions/evaluate-mission/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";

// ===== UTILITÁRIOS =====

export function validarCorpoRequisicao(body: any): { valid: boolean; error?: string } {
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
  if (missionPrompt.length > 2048) {
    return { valid: false, error: "O 'missionPrompt' deve ter no máximo 2048 caracteres." };
  }
  if (userResponse.length > 2048) {
    return { valid: false, error: "O 'userResponse' deve ter no máximo 2048 caracteres." };
  }
  return { valid: true };
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora em ms
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Limpeza a cada 1h

export function obterIPReal(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
}

function checarRateLimit(ip: string): boolean {
  const agora = Date.now();
  const info = rateLimitMap.get(ip);

  if (!info || agora > info.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: agora + RATE_LIMIT_WINDOW });
    return true;
  }
  if (info.count >= RATE_LIMIT) {
    return false;
  }
  info.count++;
  return true;
}

// Limpeza periódica dos IPs expirados
setInterval(() => {
  const agora = Date.now();
  for (const [ip, info] of rateLimitMap) {
    if (agora > info.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

// Função para ler body com limite
export async function lerBodyJSON(req: Request, maxSize: number): Promise<any> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Body reader não disponível.");
  let total = 0;
  let chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxSize) throw new Error("Requisição muito grande.");
    chunks.push(value);
  }
  const rawBody = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    rawBody.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(rawBody));
}

// ===== HANDLER PRINCIPAL =====
serve(async (req) => {
  // CORS para todas as rotas
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Limite de body
  const MAX_BODY_SIZE = 53000; // ~53KB

  let corpoJson: any;
  try {
    corpoJson = await lerBodyJSON(req, MAX_BODY_SIZE);
  } catch (err) {
    logWarn("Erro ao ler o body", { error: err.message });
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message.includes("muito grande")
          ? "Requisição muito grande. Tamanho máximo: 53KB."
          : "Body inválido. Envie um JSON válido.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: err.message.includes("muito grande") ? 413 : 400,
      }
    );
  }

  // Rate limiting
  const ipCliente = obterIPReal(req);
  if (!checarRateLimit(ipCliente)) {
    logWarn("Rate limit atingido", { ip: ipCliente });
    return new Response(
      JSON.stringify({
        success: false,
        error: "Muitas avaliações. Tente novamente em 1 hora.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      }
    );
  }

  // Validação dos campos
  const validacao = validarCorpoRequisicao(corpoJson);
  if (!validacao.valid) {
    logWarn("Corpo de requisição inválido", { erro: validacao.error });
    return new Response(
      JSON.stringify({ success: false, error: validacao.error }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const { missionPrompt, userResponse } = corpoJson;
  logInfo("Requisição recebida para avaliação", { ip: ipCliente });

  // Chave da OpenAI
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    logError("Chave da API OpenAI não configurada no servidor");
    return new Response(
      JSON.stringify({
        success: false,
        error: "Serviço temporariamente indisponível. Tente novamente mais tarde.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 503,
      }
    );
  }

  // Prompt do sistema (use seu prompt completo aqui)
  const promptSistema = `Você é um especialista em avaliação da Competência V da redação do ENEM.

# ✅ PROMPT DEFINITIVO PARA AVALIAÇÃO DA COMPETÊNCIA 5 DO ENEM
# 👇 Use este comando com modelos da OpenAI (GPT-4-turbo ou superior) para corrigir automaticamente propostas de intervenção.
# 🚀 Otimizado para integração com ferramentas automáticas via API ou interface direta no Playground.
# 🧠 Baseado em critérios oficiais do ENEM + diretrizes específicas do professor Sheltom.

Sua tarefa é analisar a proposta de intervenção apresentada em uma redação do ENEM, avaliando a Competência 5 com base nos critérios abaixo. Siga o passo a passo com rigor. Use marcações com [...]

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
   - Válido: "criar campanhas", "investir em projetos sociais".
   - Nulo: "é necessário agir", "medidas devem ser tomadas".

   ✅ **AGENTE** → Quem executará a ação?
   - Válido: "o governo federal", "ONGs", "a mídia", "as escolas".
   - Nulo: "deve-se promover" (sem indicar o agente).

   ✅ **MEIO/MODO** → Como a ação será realizada? SEMPRE introduzido por expressões como "através de", "por meio de", "mediante", "por intermédio de", e equivalentes
   - Válido: "por meio de aplicativos", "com palestras em escolas públicas".
   - Nulo: "de forma eficaz", "com responsabilidade", "rapidamente".

   ✅ **FINALIDADE** → Para quê? Qual o objetivo da ação?
   - Válido: "a fim de reduzir o preconceito", "com o objetivo de informar os jovens".
   - Nulo: "para o bem de todos", "visando melhorias" (vago ou decorativo).
   - Considere válidos elementos vagos e superficiais, como "Para resolver esse problema", ou "A fim de acabar com [problema do tema]", desde que tenha uma relação lógica de objetivo ou efeito da ação

   ✅ **DETALHAMENTO** → Informação específica, concreta e relevante que complementa outro elemento (agente, ação, meio ou finalidade). O detalhamento pode se apresentar como exemplificação, especificação, explicação, justificativa, e desdobramento da finalidade [...]
   - Válido: "campanhas elaboradas com influenciadores digitais para o público adolescente".
   - Nulo: repetição de outro elemento com outras palavras, ou algo genérico.
   - Válido: "(...), onde/em que o celular seja uma ferramenta de apoio, e não um empecilho à educação"
   - Considere válidos elementos superficiais, como "Só assim, o Brasil será um país melhor", ou "Sendo assim, alcançaremos uma sociedade mais justa", desde que esteja relacionado de forma lógica com um dos outros elementos, indicando consequência, explicação, justificaiva, ou exemplo.

3. **Atenção a estruturas condicionais!**
   - Se a proposta estiver formulada como hipótese (ex: "caso medidas sejam tomadas..."), atribua diretamente **80 pontos**.
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
`;

  try {
    // Chamada à OpenAI com parâmetros mais determinísticos
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: promptSistema },
          {
            role: "user",
            content: `**Missão:** ${missionPrompt}\n\n**Resposta do usuário:** ${userResponse}\n\nAvalie esta proposta de intervenção seguindo rigorosamente o formato especificado.`
          }
        ],
        temperature: 0.1, // Reduzido de 0.91 para 0.1 para maior consistência
        top_p: 1, // Adicionado para maior determinismo
        max_tokens: 2500,
      }),
    });

    const data = await resposta.json();

    if (data.error) {
      logError("Erro na API OpenAI", { mensagem: data.error.message });
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao processar a avaliação. Tente novamente." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const avaliacao = data.choices[0].message.content;

    // Regex para extração de score e elementos válidos
    const pontuacaoMatch = avaliacao.match(/\*\*Pontuação:\*\*\s*(\d+)\/200/i)
      || avaliacao.match(/Pontuação:\s*(\d+)\/200/i)
      || avaliacao.match(/(\d+)\/200/);
    const pontuacao = pontuacaoMatch ? parseInt(pontuacaoMatch[1]) : undefined;

    const elementosMatch = avaliacao.match(/\*\*Elementos válidos:\*\*\s*(\d+)\/5/i)
      || avaliacao.match(/Elementos válidos:\s*(\d+)\/5/i)
      || avaliacao.match(/(\d+)\/5/);
    const elementosValidos = elementosMatch ? parseInt(elementosMatch[1]) : undefined;

    logInfo("Avaliação concluída", { pontuacao, elementosValidos, ip: ipCliente });

    // Resposta final
    return new Response(
      JSON.stringify({
        success: true,
        evaluation: avaliacao,
        score: pontuacao,
        elementsCount: elementosValidos
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    logError("Erro na função de avaliação", { error: error.message });
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno do servidor." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

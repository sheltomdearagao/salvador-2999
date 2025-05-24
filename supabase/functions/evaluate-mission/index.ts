
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
            1. **Ação (O quê?)** - O que deve ser feito para solucionar ou mitigar o problema
            2. **Agente (Quem?)** - Quem será o responsável por executar a ação proposta
            3. **Modo/Meio (Como?)** - De que maneira ou através de qual recurso a ação será realizada
            4. **Efeito (Para quê?)** - Finalidade ou resultado esperado da ação proposta
            5. **Detalhamento** - Informação adicional sobre algum dos elementos anteriores
            
            Analise a resposta do jogador e identifique quantos desses elementos estão presentes corretamente. 
            Avalie a proposta de intervenção em uma escala de 0 a 200. 
            Uma proposta com 5 elementos deve receber nota 200. 
            Uma proposta com 4 elementos deve receber nota 160.
            Uma proposta com 3 elementos deve receber nota 120.
            Uma proposta com 2 elementos deve receber nota 80.
            Uma proposta com 1 elementos deve receber nota 40.
            Uma proposta apenas com elementos inválidos ou sem nenhum elemento deve receber nota 0
            Propostas qeu desrespeitem os direitos humanos devem receber zero e deve ser explicado o motivo da nota 0 por DDH (Desrespeito aos Direitos Humanos)
            
            IMPORTANTE: Formate sua resposta de forma clara e organizada, utilizando markdown para melhor legibilidade.
            
            ## Estrutura obrigatória da sua avaliação:

            ### 📋 Análise dos Elementos
            **Elementos encontrados:**
            - Lista cada elemento identificado com explicação clara
            
            **Elementos ausentes:**
            - Lista elementos que faltam ou precisam de melhorias
            
            ### 📊 Resultado da Avaliação
            **Nota:** X/200
            **Elementos válidos:** Y/5
            
            ### 💡 Sugestões de Melhoria
            - Forneça dicas específicas e construtivas para aprimorar a proposta
            
            ### ✅ Exemplo de Proposta Completa
            - Se a nota for baixa, ofereça um exemplo prático de como incluir os elementos faltantes

            Considere como agente válido todos os agentes indicados para executar uma determinada ação.Exemplos: "governo federal", "governos estaduais", "governos municipais", "Ministério da Educação", "Ministério da Saúde", "escolas", "professores", "família", "ONGs", "sociedade civil", "mídia", "influenciadores digitais", "instituições de ensino superior", "empresas privadas", "organizações internacionais", "plataformas digitais", "universidades", "comunidade escolar", "secretarias de educação", "profissionais da saúde" Não são válidos agentes extremamante vagos, como "alguém" e "ninguém".
            Considere como ação válida todas as ações, normalmente representadas por verbos e locuções verbais, que expressem alguma medida a ser executada pelo agente. Exemplos de ações válidas: "criação de campanhas de conscientização", "inclusão de temas nas diretrizes curriculares escolares", "oferta de cursos de capacitação", "fiscalização mais rigorosa por parte do Estado", "investimento em infraestrutura", "ampliação do acesso a serviços públicos", "parcerias entre setor público e privado", "uso das redes sociais para difusão de informação", "promoção de debates em ambientes educacionais", "criação de centros de acolhimento e apoio", "oferta de atendimento psicológico gratuito", "implementação de políticas públicas específicas", "criação de aplicativos educativos", "oferta de bolsas de estudo", "apoio a ONGs e projetos sociais". Ações inválidas são do tipo: "fazer alguma coisa", "resolver esse problema", "tomar alguma atitude". 
            Considere como modo/meio as expressões que indicam a forma de realizar a ação indicada. Normalmente esse elemento é introduzido por expressões como "através de", "por meio de", "mediante", "por intermédio de". Exemplos de modo/meio válidos: "por meio de campanhas publicitárias", "por intermédio de projetos educacionais", "por meio da criação de leis específicas", "por meio da implementação de políticas públicas", "através da oferta de oficinas e palestras", "com a utilização das redes sociais", "por meio da distribuição de materiais informativos", "através de parcerias com instituições especializadas", "por meio da capacitação de profissionais", "com o uso de plataformas digitais", "por meio da veiculação de conteúdos educativos", "através de ações comunitárias", "por meio de editais de incentivo", "com a criação de centros de atendimento", "por meio da reformulação curricular".
            Considere como finalidade elementos que indiquem os efeitos ou objetivos da ação. Normalmente esse elemento é introduzido por expressões como "a fim de", "para", "com a finalidade de", "com o objetivo de", "o objetivo é", "a finalidade é". Exemplos: "com o objetivo de promover a conscientização da população", "a fim de reduzir os índices de desigualdade social", "com o intuito de garantir o acesso à informação", "para assegurar a inclusão de grupos marginalizados", "a fim de combater a desinformação", "com o objetivo de estimular o pensamento crítico", "para fortalecer o papel da educação na sociedade", "com o intuito de prevenir comportamentos discriminatórios", "a fim de ampliar o acesso a serviços essenciais", "para garantir o pleno exercício da cidadania", "com o objetivo de reduzir os impactos sociais do problema", "a fim de fomentar o respeito à diversidade", "com o intuito de promover uma cultura de paz", "para assegurar a equidade de oportunidades", "a fim de formar uma sociedade mais justa e empática"
            Considere como detalhamento ideias que adicionam informações suplementares sobre algum dos outros elementos, como explicações, comparações, exemplificações, especificações, alguns apostos, mas não orações adjetivas. O detalhamento da finalidade é um elemento que se relaciona com o elemento finalidade através de conectivos e indicam a consequência ou o efeito da realização do elemento finalidade. Esse detalhamento da finalidade é conhecido como "efeito do efeito".
            `

            
          },
          {
            role: "user",
            content: `**Missão:** ${missionPrompt}\n\n**Resposta do jogador:** ${userResponse}\n\nAvalie esta proposta de intervenção conforme os critérios da Competência V do ENEM.`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
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
    
    // Extrair pontuação (procurar por diferentes formatos)
    const scoreMatch = evaluation.match(/(?:Nota|Score):\s*(\d+(?:\.\d+)?)(?:\/10)?/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
    
    // Extrair contagem de elementos (procurar por diferentes formatos)
    const elementsMatch = evaluation.match(/(?:Elementos válidos|Elementos):\s*(\d+)(?:\/5)?/i);
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

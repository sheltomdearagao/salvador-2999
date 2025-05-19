
import { Character, Mission } from "@/types/game";

export const characters: Character[] = [
  {
    id: "torin",
    name: "Torin Vorn",
    imagePath: "/lovable-uploads/ad271dc1-7641-4a03-bd26-3eae2c91d069.png",
    description: "Engenheiro e mecânico especialista em improvisos tecnológicos",
    specialSkill: "Adaptação de tecnologia para criar soluções com poucos recursos"
  },
  {
    id: "kahzim",
    name: "Kahzim Troal",
    imagePath: "/lovable-uploads/52caa345-2328-4d94-b4aa-2fb992b0f701.png",
    description: "Estudioso urbano que documenta as histórias esquecidas da cidade",
    specialSkill: "Pesquisa e conhecimento das antigas estruturas de Salvador"
  },
  {
    id: "naia",
    name: "Naia Velsin",
    imagePath: "/lovable-uploads/00cbabae-3f1a-4613-a210-97236b644b82.png",
    description: "Hacker prodigiosa que navega entre sistemas de diferentes zonas",
    specialSkill: "Acesso a redes restritas e manipulação de dados digitais"
  },
  {
    id: "zefira",
    name: "Zefira Anem",
    imagePath: "/lovable-uploads/1433c1cc-1dee-41ce-9f9a-8a34782cc4c7.png",
    description: "Professora e pesquisadora que preserva conhecimentos antigos",
    specialSkill: "Acesso a bibliotecas raras e métodos de ensino inovadores"
  },
  {
    id: "rael",
    name: "Rael Sunder",
    imagePath: "/lovable-uploads/836022e2-c450-402d-89af-08fd5a5f0c6f.png",
    description: "Ex-guarda que agora protege comunidades vulneráveis",
    specialSkill: "Treinamento tático e conhecimento dos sistemas de segurança"
  },
  {
    id: "yana",
    name: "Yana Quilen",
    imagePath: "/lovable-uploads/3dc3740f-00b9-4194-9776-6769c5ff6b49.png",
    description: "Médica rebelde que atende em todas as zonas da cidade",
    specialSkill: "Conhecimento médico avançado e acesso a diferentes áreas"
  }
];

export const initialMissions: Mission[] = [
  {
    id: "exclusao-digital",
    title: "O Círculo Desconectado",
    zone: "Zonas Submersas",
    description: "Nas zonas submersas, o sinal não chega. Plataformas de saúde, educação e trabalho estão acessíveis apenas para os ricos. Você investigou escolas abandonadas, assistiu a crianças tentando acessar conteúdos por rádios e viu famílias inteiras desinformadas. Agora, é hora de agir.",
    context: "A exclusão digital em Salvador do ano 2999 é uma realidade cruel para os habitantes das Zonas Submersas. A infraestrutura tecnológica concentrou-se apenas nas zonas altas, enquanto as áreas submersas foram abandonadas deliberadamente. Crianças utilizam aparelhos obsoletos de rádio para tentar captar fragmentos de aulas transmitidas apenas em frequências restritas. Famílias inteiras desconhecem seus direitos por não terem acesso a informações vitais, e hospitais improvisados não conseguem acessar prontuários ou solicitar recursos. Os habitantes criaram redes alternativas rudimentares, mas estas são frequentemente sabotadas por grupos que lucram com a desinformação. O abismo digital não é apenas tecnológico, mas também social e educacional, perpetuando um ciclo de pobreza e exclusão que precisa urgentemente ser rompido.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para combater a exclusão digital em Salvador. Sua proposta precisa conter: Agente (quem faz), Ação (o que será feito), Modo (como será feito), Finalidade (para quê), Detalhamento (onde/quando/como)",
    status: "available"
  },
  {
    id: "violencia-abandono",
    title: "Ecos do Silêncio",
    zone: "Cidade Baixa",
    description: "A Cidade Baixa virou território de gangues. Escolas fechadas, praças abandonadas, jovens sem perspectivas. Você conversou com moradores que vivem trancados em casa, viu crianças brincando entre escombros e percebeu que a violência é apenas um sintoma. A raiz é o abandono.",
    context: "A Cidade Baixa, outrora um centro cultural vibrante de Salvador, tornou-se um campo de batalha entre facções rivais que disputam cada centímetro do território abandonado. As poucas escolas que restam funcionam de forma intermitente, com professores que arriscam suas vidas para lecionar em prédios semi-destruídos. Os moradores desenvolveram códigos complexos de sobrevivência, como sinais luminosos nas janelas para avisar quando é seguro sair. Durante sua investigação, você descobriu que a maioria dos integrantes das gangues são jovens entre 12 e 18 anos, muitos órfãos devido a conflitos anteriores, perpetuando um ciclo intergeracional de violência. O que começou como abandono estatal se transformou em uma estrutura paralela de poder, onde crianças são recrutadas cada vez mais cedo para funções de vigilância. Evidências mostram que, nas raras ocasiões em que projetos culturais conseguiram se estabelecer temporariamente, os índices de violência diminuíram significativamente naquelas áreas.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para enfrentar a violência e o abandono na Cidade Baixa. Sua proposta precisa conter os elementos estruturais (agente, ação, modo, finalidade e detalhamento).",
    status: "locked"
  },
  {
    id: "cultura-marginalizada",
    title: "Ritmos da Resistência",
    zone: "Favela Vertical",
    description: "Na gigantesca Favela Vertical, as expressões culturais são criminalizadas. Grafites são apagados, música é silenciada, danças são proibidas. Você descobriu grupos secretos mantendo vivas tradições ancestrais, mas sem apoio ou reconhecimento. A marginalização cultural avança enquanto a história desaparece.",
    context: "A Favela Vertical, uma megaestrutura de habitações sobrepostas que se estende por quilômetros para o alto, abriga mais de um milhão de pessoas em Salvador do ano 2999. Após decretos de 'pacificação cultural' impostos pelo governo corporativo, qualquer manifestação cultural não-oficial tornou-se crime, punível com remoção forçada para as zonas de trabalho compulsório. As paredes internas da favela ainda guardam vestígios de grafites históricos sob camadas de tinta cinza uniformizadora. Durante sua exploração, você encontrou células de resistência cultural que se reúnem em porões secretos: mestres de capoeira ensinam movimentos codificados como 'exercícios de condicionamento físico', músicos adaptaram instrumentos tradicionais para parecerem dispositivos utilitários, e griôs transmitem oralmente histórias ancestrais da Bahia disfarçadas como contos infantis. Estas práticas são mantidas em extremo sigilo, pois drones de vigilância monitoram constantemente qualquer reunião com mais de três pessoas. A geração mais jovem já começa a perder conexão com suas raízes culturais, identificando-se mais com a cultura corporativa homogeneizada exibida nos telões obrigatórios instalados em cada unidade habitacional.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para valorizar e preservar as expressões culturais marginalizadas. Sua proposta precisa conter os elementos estruturais completos.",
    status: "locked"
  },
  {
    id: "colapso-sanitario",
    title: "Águas Envenenadas",
    zone: "Subterrâneo",
    description: "O sistema subterrâneo de Salvador entrou em colapso. Esgoto e água potável se misturam, doenças se espalham, e os mais pobres bebem o que encontram. Você explorou túneis antigos, viu famílias coletando água de fontes contaminadas e hospitais improvisados lotados de doentes.",
    context: "As galerias subterrâneas de Salvador 2999, que antes eram uma maravilha de engenharia que remontava aos antigos sistemas coloniais, agora são um labirinto tóxico. A ruptura das tubulações principais após o Grande Terremoto de 2987 nunca foi reparada adequadamente, criando um sistema híbrido onde resíduos industriais das fábricas superiores se misturam com fontes hídricas naturais. Doenças como a febre negra, uma variante resistente de tifo, afetam 60% da população subterrânea, principalmente crianças. As corporações que controlam o suprimento de água purificada cobram preços exorbitantes, forçando a população mais pobre a utilizar 'purificadores' improvisados que não eliminam os metais pesados. Durante sua investigação, você descobriu que algumas áreas do subterrâneo ainda possuem poços artesianos não contaminados, mas esta informação é suprimida para manter o controle sobre o recurso. O conhecimento tradicional sobre sistemas naturais de filtragem foi praticamente perdido, com apenas alguns anciãos ainda preservando técnicas que poderiam ser adaptadas para a realidade atual. Sem uma intervenção imediata, as projeções indicam que o aquífero principal estará irremediavelmente contaminado em menos de cinco anos.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para enfrentar o colapso sanitário no Subterrâneo. Lembre-se de incluir todos os elementos estruturais.",
    status: "locked"
  },
  {
    id: "desigualdade-saber",
    title: "Chaves do Conhecimento",
    zone: "Plataforma Técnica",
    description: "Na Plataforma Técnica, o conhecimento é mercadoria. Apenas os ricos acessam educação avançada, enquanto o restante recebe treinamento básico para servir como mão de obra. Você visitou escolas segregadas, onde talentos são desperdiçados porque não podem pagar por desenvolvimento.",
    context: "A Plataforma Técnica, centro educacional de Salvador 2999, opera sob um sistema de camadas de acesso ao conhecimento rigorosamente estratificado. Dividida em cinco níveis, cada um com requisitos financeiros progressivamente mais altos, a plataforma oferece desde treinamento básico operacional (Nível 1) até conhecimento de inovação e criação tecnológica (Nível 5). Durante sua investigação, você testemunhou crianças com habilidades excepcionais sendo direcionadas para treinamentos repetitivos de manutenção de máquinas, pois suas famílias não podiam arcar com os custos dos níveis superiores. O sistema é mantido por algoritmos de classificação neuronal que fazem avaliações precoces e determinam o 'potencial rentável' de cada estudante aos 8 anos de idade. Bibliotecas virtuais completas existem, mas têm acesso restrito por biometria e geolocalização, com penalidades severas para tentativas de acesso não autorizado. Professores que tentam compartilhar conhecimentos além do nível designado para seus alunos perdem suas licenças de ensino permanentemente. O mais alarmante é que a desigualdade de conhecimento está se ampliando exponencialmente a cada geração, com as famílias de classe alta acumulando bibliotecas genéticas e aprimoramentos cognitivos que tornam o abismo educacional praticamente intransponível sem intervenção estrutural.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para democratizar o acesso ao conhecimento na Plataforma Técnica. Sua proposta precisa conter todos os elementos estruturais.",
    status: "locked"
  },
  {
    id: "invisibilidade-sensorial",
    title: "Além dos Sentidos",
    zone: "Zona Leste",
    description: "Na Zona Leste, pessoas com deficiência são completamente ignoradas. Sem acessibilidade, sem inclusão, sem voz. Você acompanhou um dia na vida de cidadãos invisíveis, enfrentando barreiras em cada esquina, excluídos de oportunidades e serviços básicos.",
    context: "A Zona Leste de Salvador 2999 foi projetada sob o conceito de 'eficiência funcional máxima', eliminando qualquer adaptação para pessoas com deficiência, consideradas 'estatisticamente irrelevantes' pelos planejadores urbanos corporativos. A infraestrutura é hostil: transportes públicos sem acessibilidade, sistemas de comunicação exclusivamente visuais ou exclusivamente sonoros, e edifícios com múltiplos níveis sem alternativas a escadas. As pessoas com deficiência desenvolveram uma rede clandestina de apoio mútuo chamada 'Sentidos Cruzados', onde indivíduos compartilham suas habilidades para superar barreiras. Durante sua investigação, você descobriu que tecnologias avançadas de acessibilidade existem nos centros médicos de elite, mas são negadas à população geral sob alegações de 'inviabilidade econômica'. Sistemas de inteligência artificial discriminam rotineiramente candidatos com deficiência em processos seletivos, classificando-os automaticamente como 'inadequados' para qualquer posição qualificada. O mais perturbador é que crianças com deficiência são frequentemente separadas de suas famílias e enviadas para 'centros de adequação funcional', onde são treinadas apenas para funções laborais básicas. A exclusão é tão sistemática que muitos moradores da Zona Leste sequer percebem a ausência de pessoas com deficiência em espaços públicos, considerando essa segregação como algo natural.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para combater a invisibilidade sensorial na Zona Leste. Inclua todos os elementos estruturais em sua proposta.",
    status: "locked"
  }
];

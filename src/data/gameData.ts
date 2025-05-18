
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
    instruction: "Escreva um parágrafo com uma proposta de intervenção para combater a exclusão digital em Salvador. Sua proposta precisa conter: Agente (quem faz), Ação (o que será feito), Modo (como será feito), Finalidade (para quê), Detalhamento (onde/quando/como)",
    status: "available"
  },
  {
    id: "violencia-abandono",
    title: "Ecos do Silêncio",
    zone: "Cidade Baixa",
    description: "A Cidade Baixa virou território de gangues. Escolas fechadas, praças abandonadas, jovens sem perspectivas. Você conversou com moradores que vivem trancados em casa, viu crianças brincando entre escombros e percebeu que a violência é apenas um sintoma. A raiz é o abandono.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para enfrentar a violência e o abandono na Cidade Baixa. Sua proposta precisa conter os elementos estruturais (agente, ação, modo, finalidade e detalhamento).",
    status: "locked"
  },
  {
    id: "cultura-marginalizada",
    title: "Ritmos da Resistência",
    zone: "Favela Vertical",
    description: "Na gigantesca Favela Vertical, as expressões culturais são criminalizadas. Grafites são apagados, música é silenciada, danças são proibidas. Você descobriu grupos secretos mantendo vivas tradições ancestrais, mas sem apoio ou reconhecimento. A marginalização cultural avança enquanto a história desaparece.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para valorizar e preservar as expressões culturais marginalizadas. Sua proposta precisa conter os elementos estruturais completos.",
    status: "locked"
  },
  {
    id: "colapso-sanitario",
    title: "Águas Envenenadas",
    zone: "Subterrâneo",
    description: "O sistema subterrâneo de Salvador entrou em colapso. Esgoto e água potável se misturam, doenças se espalham, e os mais pobres bebem o que encontram. Você explorou túneis antigos, viu famílias coletando água de fontes contaminadas e hospitais improvisados lotados de doentes.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para enfrentar o colapso sanitário no Subterrâneo. Lembre-se de incluir todos os elementos estruturais.",
    status: "locked"
  },
  {
    id: "desigualdade-saber",
    title: "Chaves do Conhecimento",
    zone: "Plataforma Técnica",
    description: "Na Plataforma Técnica, o conhecimento é mercadoria. Apenas os ricos acessam educação avançada, enquanto o restante recebe treinamento básico para servir como mão de obra. Você visitou escolas segregadas, onde talentos são desperdiçados porque não podem pagar por desenvolvimento.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para democratizar o acesso ao conhecimento na Plataforma Técnica. Sua proposta precisa conter todos os elementos estruturais.",
    status: "locked"
  },
  {
    id: "invisibilidade-sensorial",
    title: "Além dos Sentidos",
    zone: "Zona Leste",
    description: "Na Zona Leste, pessoas com deficiência são completamente ignoradas. Sem acessibilidade, sem inclusão, sem voz. Você acompanhou um dia na vida de cidadãos invisíveis, enfrentando barreiras em cada esquina, excluídos de oportunidades e serviços básicos.",
    instruction: "Escreva um parágrafo com uma proposta de intervenção para combater a invisibilidade sensorial na Zona Leste. Inclua todos os elementos estruturais em sua proposta.",
    status: "locked"
  }
];

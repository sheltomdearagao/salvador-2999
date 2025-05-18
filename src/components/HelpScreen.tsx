
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, User, Target, Settings, HelpCircle, Info } from 'lucide-react';

const HelpScreen: React.FC = () => {
  const { hideHelpScreen } = useGame();
  
  return (
    <div className="py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
          onClick={hideHelpScreen}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold cyber-heading">
          Centro de Ajuda
        </h1>
      </div>

      <div className="card-cyber p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-cyber-blue" />
          Como Escrever uma Proposta de Intervenção
        </h2>
        
        <p className="mb-4">
          Uma proposta de intervenção é uma solução estruturada para resolver um problema social. 
          Na sua resposta, inclua todos os seguintes elementos:
        </p>
        
        <div className="space-y-4">
          <div className="bg-cyber-blue/10 p-4 rounded-lg">
            <h3 className="font-bold flex items-center">
              <User className="mr-2 h-5 w-5 text-cyber-blue" />
              Agente
            </h3>
            <p>Quem vai realizar a ação? Pode ser o governo, uma ONG, a escola, a comunidade, empresas...</p>
            <p className="text-sm italic mt-2">Exemplo: "O governo municipal, em parceria com empresas de tecnologia,..."</p>
          </div>
          
          <div className="bg-cyber-blue/10 p-4 rounded-lg">
            <h3 className="font-bold flex items-center">
              <Target className="mr-2 h-5 w-5 text-cyber-blue" />
              Ação
            </h3>
            <p>O que será feito? O verbo principal da sua proposta.</p>
            <p className="text-sm italic mt-2">Exemplo: "...deve implementar um programa de acesso digital..."</p>
          </div>
          
          <div className="bg-cyber-blue/10 p-4 rounded-lg">
            <h3 className="font-bold flex items-center">
              <Settings className="mr-2 h-5 w-5 text-cyber-blue" />
              Modo/Meio
            </h3>
            <p>Como a ação será realizada? Por meio de quais ferramentas ou métodos?</p>
            <p className="text-sm italic mt-2">Exemplo: "...por meio da instalação de pontos de Wi-Fi gratuitos e centros comunitários digitais..."</p>
          </div>
          
          <div className="bg-cyber-blue/10 p-4 rounded-lg">
            <h3 className="font-bold flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-cyber-blue" />
              Finalidade
            </h3>
            <p>Para que a ação será realizada? Qual o objetivo?</p>
            <p className="text-sm italic mt-2">Exemplo: "...a fim de garantir que todos os cidadãos tenham acesso às ferramentas digitais essenciais..."</p>
          </div>
          
          <div className="bg-cyber-blue/10 p-4 rounded-lg">
            <h3 className="font-bold flex items-center">
              <Info className="mr-2 h-5 w-5 text-cyber-blue" />
              Detalhamento
            </h3>
            <p>Especificações adicionais: onde, quando, com que recursos, etc.</p>
            <p className="text-sm italic mt-2">Exemplo: "...priorizando áreas submersas e comunidades de baixa renda, com financiamento misto e manutenção contínua pelos próximos cinco anos."</p>
          </div>
        </div>
      </div>
      
      <div className="card-cyber p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Exemplo Completo:</h2>
        <div className="bg-cyber-purple/10 p-4 rounded-lg">
          <p>
            "O governo municipal, em parceria com empresas de tecnologia, 
            <span className="text-cyber-blue"> deve implementar </span>
            um programa de acesso digital 
            <span className="text-cyber-purple"> por meio da instalação de pontos de Wi-Fi gratuitos e centros comunitários digitais </span>
            <span className="text-cyber-orange"> a fim de garantir que todos os cidadãos tenham acesso às ferramentas digitais essenciais, </span>
            <span className="text-cyber-teal"> priorizando áreas submersas e comunidades de baixa renda, com financiamento misto e manutenção contínua pelos próximos cinco anos.</span>"
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          className="btn-cyber"
          onClick={hideHelpScreen}
        >
          Voltar à Missão
        </Button>
      </div>
    </div>
  );
};

export default HelpScreen;

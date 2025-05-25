
import React from 'react';
import { CheckCircle2, Shield, Zap } from 'lucide-react';

const ApiKeySetup: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        Sistema de Avaliação Configurado
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center text-sm text-green-600 gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Pronto para uso - nenhuma configuração necessária!</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded-md border-l-4 border-green-400">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-700">Como funciona:</span>
          </div>
          <ul className="space-y-1 text-green-600">
            <li>• Sistema backend seguro já configurado</li>
            <li>• Avaliações ilimitadas com rate limiting para fair use</li>
            <li>• Nenhuma chave API necessária do usuário</li>
            <li>• Experiência fluida e sem configurações</li>
            <li>• Proteção contra abuso com limite de 10 avaliações por hora</li>
          </ul>
          <p className="mt-2 text-green-600 font-medium">
            ✨ Simplesmente comece a jogar e use o especialista para avaliar suas propostas!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;

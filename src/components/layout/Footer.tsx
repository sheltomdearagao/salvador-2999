
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 py-4 px-6 bg-black/50 mt-8 text-center rounded-b-lg">
      <p className="text-sm text-white mb-2">
        Salvador 2999: Crônicas da Última Cidade - Criado pelo Professor Sheltom de Aragão
      </p>
      <a 
        href="https://profsheltom.com.br" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-cyber-purple/80 hover:bg-cyber-purple text-white rounded-md transition-colors"
      >
        profsheltom.com.br
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </footer>
  );
};

export default Footer;


import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, CheckCircle2, AlertCircle, Shield, Clock } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { secureStore, secureRetrieve, secureClear, isSessionExpired } from '@/utils/encryption';

const API_KEY_STORAGE = 'salvador2999_openai_key';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = secureRetrieve(API_KEY_STORAGE);
    const expired = isSessionExpired(API_KEY_STORAGE);
    
    if (storedKey && !expired) {
      setApiKey(storedKey);
      setIsExpired(false);
    } else {
      setIsExpired(expired);
      if (expired) {
        secureClear(API_KEY_STORAGE);
      }
    }
  }, []);

  const saveApiKey = (key: string) => {
    secureStore(API_KEY_STORAGE, key);
    setApiKey(key);
    setIsExpired(false);
  };

  const clearApiKey = () => {
    secureClear(API_KEY_STORAGE);
    setApiKey('');
    setIsExpired(false);
  };

  return { apiKey, saveApiKey, clearApiKey, hasApiKey: !!apiKey, isExpired };
};

const ApiKeySetup: React.FC = () => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { apiKey, saveApiKey, clearApiKey, hasApiKey, isExpired } = useApiKey();
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (isExpired) {
      toast({
        title: "Sessão expirada",
        description: "Sua chave API expirou por segurança. Por favor, insira-a novamente.",
        variant: "destructive"
      });
    }
  }, [isExpired, toast]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Chave vazia",
        description: "Por favor, insira uma chave API válida.",
        variant: "destructive"
      });
      return;
    }

    // Validação básica do formato da chave OpenAI
    if (!inputKey.startsWith('sk-') || inputKey.length < 20) {
      toast({
        title: "Formato inválido",
        description: "A chave API da OpenAI deve começar com 'sk-' e ter pelo menos 20 caracteres.",
        variant: "destructive"
      });
      return;
    }

    saveApiKey(inputKey.trim());
    toast({
      title: "Chave salva com segurança",
      description: "Sua chave API foi criptografada e salva com sucesso!",
      variant: "default"
    });
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
    toast({
      title: "Chave removida",
      description: "Sua chave API foi removida com segurança.",
      variant: "default"
    });
  };

  return (
    <div className="border rounded-lg p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Key className="h-5 w-5" />
        Configuração Segura da API OpenAI
        <Shield className="h-4 w-4 text-green-500" />
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          {hasApiKey && !isExpired ? (
            <div className="flex items-center text-sm text-green-500 gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Chave API configurada e segura</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-amber-500 gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>{isExpired ? "Chave expirada - requer nova configuração" : "Chave API não configurada"}</span>
            </div>
          )}
          
          {hasApiKey && (
            <div className="flex items-center text-xs text-blue-500 gap-1 ml-2">
              <Clock className="h-3 w-3" />
              <span>Expira em 24h</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input 
            type={showKey ? "text" : "password"}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Cole sua chave API da OpenAI aqui (sk-...)"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
            type="button"
          >
            {showKey ? "Ocultar" : "Mostrar"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleSaveKey}
            className="flex-1"
          >
            Salvar Chave Segura
          </Button>

          {hasApiKey && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Remover Chave
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover chave API?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover sua chave API? Você precisará inseri-la novamente para usar a funcionalidade de avaliação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearKey}>Remover</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-700">Segurança Implementada:</span>
          </div>
          <ul className="space-y-1 text-blue-600">
            <li>• Chave criptografada antes do armazenamento</li>
            <li>• Verificação de integridade dos dados</li>
            <li>• Expiração automática em 24 horas</li>
            <li>• Validação do formato da chave</li>
            <li>• Dados nunca enviados para nossos servidores</li>
          </ul>
          <p className="mt-2 text-blue-600">
            Não tem uma chave API? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-semibold">Obtenha uma aqui</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;

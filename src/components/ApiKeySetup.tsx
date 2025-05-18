
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, CheckCircle2, AlertCircle } from 'lucide-react';
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

const API_KEY_STORAGE = 'salvador2999_openai_key';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
  };

  return { apiKey, saveApiKey, clearApiKey, hasApiKey: !!apiKey };
};

const ApiKeySetup: React.FC = () => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { apiKey, saveApiKey, clearApiKey, hasApiKey } = useApiKey();
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Chave vazia",
        description: "Por favor, insira uma chave API válida.",
        variant: "destructive"
      });
      return;
    }

    saveApiKey(inputKey.trim());
    toast({
      title: "Chave salva",
      description: "Sua chave API foi salva com sucesso!",
      variant: "default"
    });
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
    toast({
      title: "Chave removida",
      description: "Sua chave API foi removida.",
      variant: "default"
    });
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Key className="h-5 w-5" />
        Configuração da API OpenAI
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          {hasApiKey ? (
            <div className="flex items-center text-sm text-green-500 gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Chave API configurada</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-amber-500 gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Chave API não configurada</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input 
            type={showKey ? "text" : "password"}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Cole sua chave API da OpenAI aqui"
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
            Salvar Chave
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

        <div className="text-xs text-muted-foreground">
          <p>Sua chave é armazenada apenas no seu navegador e nunca é enviada para nossos servidores.</p>
          <p className="mt-1">Não tem uma chave API? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Obtenha uma aqui</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;

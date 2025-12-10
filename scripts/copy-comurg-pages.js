const fs = require('fs');
const path = require('path');

const dashboardComurgPath = path.join(__dirname, '../clientes/CLIENTE_01/dashboard-comurg/app');
const investigareePath = path.join(__dirname, '../investigaree/src/app/dashboard');

// Mapeamento de páginas: [fonte, destino]
const pageMapping = [
  ['overview', 'comurgoverview'],
  ['beneficios', 'comurgbeneficios'],
  ['atividade-politica', 'comurgatividadepolitica'],
  ['analise-risco', 'comurganaliserisco'],
  ['listas-restritivas', 'comurglistasrestritivas'],
  ['cpfs-validos', 'comurgcpfsvalidos'],
  ['relatorios', 'comurgrelatorios'],
];

console.log('🚀 Copiando e adaptando páginas COMURG...\n');

pageMapping.forEach(([source, dest]) => {
  console.log(`📄 Processando: ${source} → ${dest}`);

  const sourcePath = path.join(dashboardComurgPath, source, 'page.tsx');
  const destDir = path.join(investigareePath, dest);
  const destPath = path.join(destDir, 'page.tsx');

  // Verificar se arquivo fonte existe
  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠️  Arquivo fonte não encontrado: ${sourcePath}`);
    return;
  }

  // Criar diretório de destino se não existir
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`  ✅ Diretório criado: ${destDir}`);
  }

  // Ler conteúdo do arquivo fonte
  let content = fs.readFileSync(sourcePath, 'utf8');

  // Adaptações necessárias:

  // 1. Trocar useData por useComurgData
  content = content.replace(
    /import \{ useData \} from "@\/contexts\/DataContext";/g,
    'import { useComurgData } from "@/contexts/ComurgDataContext";'
  );

  content = content.replace(
    /const \{ funcionarios, loading \} = useData\(\);/g,
    'const { funcionarios, loading: dataLoading, error } = useComurgData();'
  );

  content = content.replace(
    /if \(loading\)/g,
    'if (authLoading || dataLoading)'
  );

  // 2. Adicionar imports necessários
  const hasUseEffect = content.includes('useState');
  if (hasUseEffect && !content.includes('useEffect')) {
    content = content.replace(
      /import \{ ([^}]+) \} from "react";/,
      'import { $1, useEffect } from "react";'
    );
  }

  if (!content.includes('useRouter')) {
    content = content.replace(
      /^(import.*from "react";)/m,
      '$1\nimport { useRouter } from "next/navigation";'
    );
  }

  if (!content.includes('useUserAccess')) {
    content = content.replace(
      /^(import.*from "next\/navigation";)/m,
      '$1\nimport { useUserAccess } from "@/hooks/useUserData";'
    );
  }

  if (!content.includes('AlertCircle')) {
    content = content.replace(
      /^(import \{[^}]+)\} from "lucide-react";/m,
      '$1, AlertCircle } from "lucide-react";'
    );
  }

  if (!content.includes('motion')) {
    content = content.replace(
      /^(import.*from "@\/hooks\/useUserData";)/m,
      '$1\nimport { motion } from "framer-motion";'
    );
  }

  // 3. Adicionar proteção de acesso COMURG e estados
  const functionMatch = content.match(/export default function (\w+)\(\)/);
  if (functionMatch) {
    const funcName = functionMatch[1];

    // Adicionar hooks no início da função
    const funcStart = content.indexOf(`export default function ${funcName}()`);
    const funcBodyStart = content.indexOf('{', funcStart) + 1;

    const newHooks = `
  const { userInfo, loading: authLoading } = useUserAccess();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);
`;

    // Inserir apenas se não existir
    if (!content.includes('useUserAccess();')) {
      content = content.slice(0, funcBodyStart) + newHooks + content.slice(funcBodyStart);
    }
  }

  // 4. Adicionar estados de loading e error antes do return
  const firstReturnMatch = content.match(/\n  if \((authLoading \|\| dataLoading|loading)\)/);
  if (firstReturnMatch && !content.includes('// Loading state')) {
    content = content.replace(
      /\n  if \((authLoading \|\| dataLoading|loading)\)/,
      `
  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px] bg-white dark:bg-navy-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/60">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Bloquear renderização se não for COMURG
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 text-center">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 dark:text-red-300 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (false`
    );
  }

  // 5. Remover imports de GroupTabs se existirem (não usaremos isso)
  content = content.replace(/import.*GroupTabs.*\n/g, '');
  content = content.replace(/<GroupTabs[^>]*\/>/g, '');
  content = content.replace(/const \[activeTab.*\n/g, '');
  content = content.replace(/const tabCounts.*\n.*\n.*\n/g, '');
  content = content.replace(/const.*Todos = useMemo.*\n.*\n.*\n.*\n.*\n/g, '');
  content = content.replace(/\/\/ Filtrar por grupo.*\n.*\n.*\n.*\n/g, '');

  // 6. Trocar todas as classes de fundo e estilos para dark mode
  content = content.replace(/className="p-8"/g, 'className="p-4 lg:p-8 bg-white dark:bg-navy-950"');
  content = content.replace(/className="bg-\w+-50/g, 'className="bg-navy-900');
  content = content.replace(/border-\w+-200/g, 'border-navy-700');
  content = content.replace(/text-gray-(\d+)/g, 'text-slate-$1 dark:text-white/70');
  content = content.replace(/bg-gray-50/g, 'bg-navy-800');
  content = content.replace(/border-b-2 border-gray-200/g, 'border-b border-navy-700');
  content = content.replace(/hover:bg-gray-50/g, 'hover:bg-navy-800/50');

  // 7. Adicionar motion wrapper ao conteúdo principal
  if (!content.includes('<motion.div')) {
    content = content.replace(
      /return \(\s+<div className="([^"]+)">/,
      `return (
    <div className="$1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >`
    );

    // Fechar motion.div antes do último </div>
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex > -1) {
      content = content.slice(0, lastDivIndex) + '      </motion.div>\n    ' + content.slice(lastDivIndex);
    }
  }

  // 8. Remover FuncionarioModal se existir (não temos esse componente)
  content = content.replace(/import FuncionarioModal.*\n/g, '');
  content = content.replace(/<FuncionarioModal[\s\S]*?\/>/g, '');
  content = content.replace(/const \[modalCpf.*\n/g, '');
  content = content.replace(/const \[isModalOpen.*\n/g, '');
  content = content.replace(/const abrirModal.*\n.*\n.*\n.*\n/g, '');
  content = content.replace(/const fecharModal.*\n.*\n.*\n.*\n/g, '');
  content = content.replace(/onClick=\{.*abrirModal.*\}/g, '');
  content = content.replace(/onClick=\{.*setModalCpf.*\}/g, '');

  // 9. Trocar Card do shadcn por divs com estilo
  content = content.replace(/import \{ Card \}.*\n/g, '');
  content = content.replace(/<Card/g, '<div');
  content = content.replace(/<\/Card>/g, '</div>');

  // Salvar arquivo adaptado
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`  ✅ Página criada: ${destPath}\n`);
});

console.log('✨ Todas as páginas foram copiadas e adaptadas com sucesso!');

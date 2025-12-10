const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../investigaree/src/app/dashboard/investigacoes/page.tsx');

console.log('📝 Updating investigacoes page...');

let content = fs.readFileSync(filePath, 'utf8');

// Replace import
content = content.replace(
  /import \{ listarFuncionarios \} from ".*dados\.service";/,
  'import { getInvestigations, getInvestigationsStats } from "@/lib/api";'
);

// Replace the loadFuncionarios function call
content = content.replace(
  /const response = await listarFuncionarios\(tenantCode\);/,
  `const response = await getInvestigations();

      // Convert to funcionarios format for now
      // TODO: Refactor page to use investigation format directly`
);

// Replace the data mapping
content = content.replace(
  /const convertedFuncionarios = response\.funcionarios\.map\(convertBackendToUI\);/,
  `const investigations = response.data || response.investigacoes || [];
      const convertedFuncionarios = investigations.map((inv) => ({
        id: inv.id,
        nome: inv.nome,
        cpf: inv.documento,
        grupo: inv.grupo || inv.categoria || 'N/A',
        cargo: inv.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física',
        salario: 0,
        esta_morto: 'NÃO',
        recebe_beneficio: 0,
        socio_empresa: inv.tipo_pessoa === 'juridica' ? 1 : 0,
      }));`
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ File updated successfully!');

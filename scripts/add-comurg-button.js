const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../investigaree/src/components/dashboard/FichaFuncionario.tsx');

console.log('📝 Adding COMURG button to FichaFuncionario...');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
content = content.replace(
  'import { motion } from "framer-motion";',
  `import { motion } from "framer-motion";\nimport { useRouter } from "next/navigation";`
);

content = content.replace(
  'BadgeX,\n} from "lucide-react";',
  'BadgeX,\n  ArrowRight,\n} from "lucide-react";'
);

// 2. Add router hook in component
content = content.replace(
  'export function FichaFuncionario({\n  funcionario,\n  candidaturas = [],\n  doacoes = [],\n  vinculos = [],\n  sancoes = [],\n  beneficios = [],\n  onClose,\n}: FichaFuncionarioProps) {\n  const isFalecido = funcionario.esta_morto?.includes("SIM");',
  `export function FichaFuncionario({
  funcionario,
  candidaturas = [],
  doacoes = [],
  vinculos = [],
  sancoes = [],
  beneficios = [],
  onClose,
}: FichaFuncionarioProps) {
  const router = useRouter();
  const isFalecido = funcionario.esta_morto?.includes("SIM");
  const isComurgEmpresa = funcionario.cargo === "Empresa" || funcionario.grupo?.toLowerCase().includes("empresa");`
);

// 3. Add button after badges section
const badgesSection = `                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}`;

const newBadgesSection = `                  </span>
                </div>

                {/* Botão COMURG */}
                {isComurgEmpresa && (
                  <button
                    onClick={() => {
                      router.push('/dashboard/comurgecedidos');
                      onClose();
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Building2 className="w-4 h-4" />
                    Ver Funcionários Cedidos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={onClose}`;

content = content.replace(badgesSection, newBadgesSection);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Button added successfully!');

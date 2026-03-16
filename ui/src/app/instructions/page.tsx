import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="bg-white shadow p-6 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto mb-8 ">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Profissionais SA"
            width={60}
            height={60}
          />
          <h1 className="text-3xl font-bold text-gray-800">Profissionais SA</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          💼 Desafio: Cadastro de Movimentações Financeiras
        </h1>

        <section className="bg-white  shadow p-6 space-y-4 text-gray-800">
          <p>
            Este é um desafio técnico para a vaga de{" "}
            <strong>Desenvolvedor Pleno</strong>. Seu objetivo é desenvolver uma
            aplicação de movimentações financeiras, com autenticação de usuário,
            associação de categorias e persistência em banco de dados.
          </p>

          <h2 className="text-2xl font-semibold">🧰 Requisitos Técnicos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Usar a estrutura inicial deste repositório (API com NestJS, UI com
              NextJS).
            </li>
            <li>Login de usuário.</li>
            <li>Cadastro de usuários, movimentações e categorias.</li>
            <li>Movimentações associadas ao usuário autenticado.</li>
          </ul>

          <h2 className="text-2xl font-semibold">✅ O que será avaliado</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Organização do Código:</strong> Estrutura clara e
              padronizada.
            </li>
            <li>
              <strong>Legibilidade:</strong> Código limpo, bem nomeado e
              comentado.
            </li>
            <li>
              <strong>Boas Práticas:</strong> DRY, SOLID, validações, segurança.
            </li>
            <li>
              <strong>Persistência:</strong> Banco com relacionamentos corretos.
            </li>
            <li>
              <strong>Documentação:</strong> README completo, API documentada
              com Swagger.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">🌟 Diferenciais</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Testes automatizados.</li>
            <li>Responsividade.</li>
            <li>Deploy do projeto.</li>
            <li>Tratamento de erros e mensagens claras.</li>
            <li>Arquitetura escalável.</li>
            <li>Documentação extra (diagramas, fluxos, etc).</li>
          </ul>

          <h2 className="text-2xl font-semibold">📁 Estrutura do Projeto</h2>
          <div className="bg-gray-100 p-4 rounded text-sm overflow-x-auto font-mono whitespace-pre text-gray-800">
            📦 projeto-raiz/
            <br />
            ├── 📁 api/ (NestJS)
            <br />
            │ ├── src/
            <br />
            │ ├── test/
            <br />
            │ ├── ...
            <br />
            ├── 📁 ui/ (NextJS)
            <br />
            │ ├── src/app/
            <br />
            │ ├── public/
            <br />
            │ ├── 📁 src/
            <br />
            │ │ └── 📁 app/
            <br />
            │ ├── ...
            <br />
          </div>

          <h2 className="text-2xl font-semibold">🗄️ Banco de Dados</h2>
          <p>
            Caso utilize banco relacional, é <strong>obrigatório</strong>{" "}
            fornecer:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Script SQL para criação das tabelas ou</li>
            <li>Migrations via ORM</li>
          </ul>
          <p className="text-red-600 font-semibold">
            ⚠️ Sem isso, a aplicação poderá ser desconsiderada.
          </p>

          <h2 className="text-2xl font-semibold">⏱️ Prazo</h2>
          <p>3 a 5 dias corridos. Qualidade acima de velocidade.</p>

          <h2 className="text-2xl font-semibold">🚀 Envio da Solução</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Faça um Fork deste repositório no GitHub.</li>
            <li>Implemente sua solução.</li>
            <li>Deixe o repositório público.</li>
            <li>
              Envie o link para <strong>ti@profissionaissa.com</strong> com
              cópia para <strong>jonata.martins@profissionaissa.com</strong>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}


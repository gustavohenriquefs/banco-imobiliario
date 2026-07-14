# Banco Imobiliário

Implementação web do clássico jogo de tabuleiro Banco Imobiliário, desenvolvida como projeto acadêmico na disciplina de **Projeto e Desenvolvimento de Software (PDS)** da Universidade Federal do Ceará (UFC).

O projeto demonstra na prática o uso de **padrões de projeto** (Observer, Factory, Singleton) em uma aplicação React com TypeScript.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura e Padrões de Projeto](#arquitetura-e-padrões-de-projeto)
- [Modelos de Domínio](#modelos-de-domínio)
- [Tabuleiro](#tabuleiro)
- [Casas Especiais](#casas-especiais)
- [Fluxo de Jogo](#fluxo-de-jogo)

---

## Funcionalidades

- Jogo para **2 jogadores** com turnos alternados
- **Tabuleiro com 23 casas**: imóveis, empresas e casas especiais
- **Compra de propriedades**: imóveis e empresas disponíveis para aquisição
- **Cobrança automática de aluguel** ao passar por propriedade de outro jogador
- **Dados aleatórios** ou entrada manual de valor (entre 2 e 12)
- **Bônus de passagem** ao completar a volta no tabuleiro (R$ 50)
- **Condição de falência**: jogador com saldo negativo perde, reiniciando o jogo
- Visualização em tempo real da posição e saldo de cada jogador

---

## Tecnologias

| Tecnologia       | Versão   | Uso                              |
|-----------------|----------|----------------------------------|
| Next.js          | 15.1.7   | Framework React com App Router   |
| React            | 19.x     | Interface de usuário             |
| TypeScript       | 5.x      | Tipagem estática                 |
| Tailwind CSS     | 3.4.x    | Estilização utilitária           |
| ESLint           | 9.x      | Qualidade de código              |

---

## Instalação e Execução

**Pré-requisitos:** Node.js 18+ e npm.

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd banco-imobiliario

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no navegador.

### Scripts disponíveis

| Comando         | Descrição                                  |
|----------------|---------------------------------------------|
| `npm run dev`   | Inicia em modo desenvolvimento (Turbopack) |
| `npm run build` | Gera o build de produção                   |
| `npm start`     | Inicia o servidor de produção              |
| `npm run lint`  | Executa o linter                           |

---

## Estrutura do Projeto

```
src/app/
├── controllers/
│   └── tabuleiro.controller.ts   # Controlador principal da lógica de jogo
│
├── models/                       # Modelos de domínio
│   ├── propriedade.ts            # Interface base IPropriedade
│   ├── imovel.ts                 # Imóvel (comprável, aluguel fixo)
│   ├── empresa.ts                # Empresa (aluguel baseado nos dados)
│   ├── jogador.ts                # Jogador (saldo, posição, movimento)
│   ├── lugar-especial.ts         # Casa com efeito especial
│   └── tabuleiro.ts              # Singleton com as 23 casas
│
├── efeitos/                      # Casas especiais (Strategy + Factory)
│   ├── efeito-especial.ts        # Interface IEfeitoEspecial
│   ├── efeito-partida.ts         # Casa inicial (sem efeito)
│   ├── efeito-bonus.ts           # Ganha R$ 100
│   ├── efeito-imposto.ts         # Perde R$ 200
│   ├── efeito-imposto-progressivo.ts  # Perde valor baseado na posição
│   ├── efeito-perda-saldo.ts     # Perde R$ 50
│   ├── efeito-sorte-reves.ts     # +/- R$ 100 aleatório
│   ├── efeito-avance-para-partida.ts  # Move para posição 0
│   ├── efeito-va-para-outra-casa.ts   # Move para casa específica
│   ├── efeito-volte-x-casas.ts   # Volta 3 casas
│   ├── lugar-especial.factory.ts # Factory de casas especiais
│   └── lugar-especial.factory.interface.ts
│
├── observador/                   # Padrão Observer
│   ├── observador.ts             # Interface Observador
│   └── sujeito-observavel.interface.ts
│
├── page.tsx                      # Página principal / orquestrador de estado
├── tabuleiro.tsx                 # Componente visual do tabuleiro
├── setup-form.tsx                # Formulário de configuração inicial
├── player-card.tsx               # Card com info do jogador
├── dice-section.tsx              # Seção de dados
├── comprar-modal.tsx             # Modal de compra de propriedade
├── globals.css
└── tabuleiro.css
```

---

## Arquitetura e Padrões de Projeto

### Singleton — `Tabuleiro`

O tabuleiro é uma instância única compartilhada em toda a aplicação. Garante que as 23 casas sejam inicializadas apenas uma vez.

```typescript
// Acesso sempre retorna a mesma instância
const tabuleiro = Tabuleiro.getInstance();
```

### Observer — `Imovel` / `Empresa` + `Jogador`

Quando um jogador cai em uma propriedade com dono, ele é adicionado como **observador** daquela propriedade. A propriedade notifica imediatamente os observadores, que calculam e transferem o aluguel automaticamente.

```
Jogador cai na propriedade
        │
        ▼
propriedade.adicionarObservador(jogador)
        │
        ▼
propriedade.notificarObservadores()
        │
        ▼
jogador.atualizar(propriedade)  →  desconta/recebe aluguel
```

- `Jogador` implementa `Observador`
- `Imovel` e `Empresa` implementam `ISujeitoObservavel`
- Ao sair da casa, o jogador é removido da lista de observadores

### Factory — `LugarEspecialFactory`

Centraliza a criação das casas especiais, desacoplando a instanciação dos efeitos concretos.

```typescript
const factory = new LugarEspecialFactory();
const casa = factory.criarLugarEspecial(NomesLugaresEspeciais.BONUS);
```

### Strategy — Efeitos especiais

Cada casa especial recebe um objeto de efeito que implementa `IEfeitoEspecial`. Novos efeitos podem ser criados sem modificar as classes existentes.

```typescript
interface IEfeitoEspecial {
  aplicar(jogador: Jogador): void;
}
```

### MVC simplificado

- **Model** → `models/` e `efeitos/`
- **Controller** → `TabuleiroController` (lógica de jogo, jogadas, compras)
- **View** → Componentes React (`page.tsx`, `tabuleiro.tsx`, etc.)

---

## Modelos de Domínio

### `Jogador`

| Propriedade    | Tipo     | Valor inicial | Descrição                         |
|---------------|----------|---------------|-----------------------------------|
| `nome`         | string   | —             | Nome do jogador                   |
| `saldo`        | number   | R$ 1.500      | Dinheiro disponível               |
| `posicaoAtual` | number   | 0             | Índice da casa atual no tabuleiro |

Comportamentos:
- `mover(dados, tamTabuleiro)` — avança a posição com wrap-around; recebe R$ 50 ao completar a volta
- `atualizar(propriedade)` — callback do Observer; paga ou recebe aluguel
- `reiniciarJogador()` — restaura saldo e posição para os valores iniciais

### `Imovel`

Propriedade comprável com aluguel fixo.

| Campo         | Descrição                        |
|--------------|----------------------------------|
| `preco`       | Valor de compra                  |
| `aluguelBase` | Valor cobrado por turno          |
| `dono`        | Jogador dono, ou `null`          |

### `Empresa`

Propriedade comprável com aluguel variável.

| Campo          | Descrição                                              |
|---------------|--------------------------------------------------------|
| `preco`        | Valor de compra                                        |
| `multiplicador`| Fator aplicado sobre o valor dos dados                |
| Aluguel        | `somaDados × multiplicador × preco`                   |

### `LugarEspecial`

Casa que ativa um efeito ao ser visitada. Não tem dono nem aluguel.

---

## Tabuleiro

O tabuleiro possui **23 casas**, na seguinte sequência:

| # | Nome                          | Tipo              | Preço    | Aluguel/Efeito                        |
|---|-------------------------------|-------------------|----------|---------------------------------------|
| 0 | Ponto de Partida              | Casa Especial     | —        | Sem efeito                            |
| 1 | Av. Brasil                    | Imóvel            | R$ 150   | R$ 50                                 |
| 2 | Companhia de Eletricidade     | Empresa           | R$ 150   | dados × 0,5 × R$ 150                 |
| 3 | Perda de saldo                | Casa Especial     | —        | Perde R$ 50                           |
| 4 | Av. Paulista                  | Imóvel            | R$ 300   | R$ 80                                 |
| 5 | Imposto Progressivo           | Casa Especial     | —        | R$ 10 + (R$ 5 × posição do jogador)  |
| 6 | Companhia de Água             | Empresa           | R$ 200   | dados × 0,05 × R$ 200                |
| 7 | Av. Atlântica                 | Imóvel            | R$ 400   | R$ 120                                |
| 8 | Bônus                         | Casa Especial     | —        | Ganha R$ 100                          |
| 9 | Companhia de Transporte       | Empresa           | R$ 250   | dados × 0,04 × R$ 250                |
|10 | Av. Copacabana                | Imóvel            | R$ 200   | R$ 50                                 |
|11 | Volte X casas                 | Casa Especial     | —        | Volta 3 casas                         |
|12 | Rua Augusta                   | Imóvel            | R$ 500   | R$ 150                                |
|13 | Companhia de Internet         | Empresa           | R$ 300   | dados × 0,075 × R$ 300               |
|14 | Imposto de Renda              | Casa Especial     | —        | Perde R$ 200                          |
|15 | Rua das Flores                | Imóvel            | R$ 350   | R$ 90                                 |
|16 | Companhia de Telefonia        | Empresa           | R$ 350   | dados × 0,05 × R$ 350                |
|17 | Rua Bela Vista                | Imóvel            | R$ 600   | R$ 180                                |
|18 | Perda de saldo                | Casa Especial     | —        | Perde R$ 50                           |
|19 | Rua Ouro Preto                | Imóvel            | R$ 250   | R$ 70                                 |
|20 | Companhia de Publicidade      | Empresa           | R$ 1.020 | dados × 0,15 × R$ 1.020              |
|21 | Avance para o Ponto de Partida| Casa Especial     | —        | Move para posição 0                   |
|22 | Rua do Comércio               | Imóvel            | R$ 1.600 | R$ 150                                |

---

## Casas Especiais

| Nome                        | Efeito                                              |
|-----------------------------|-----------------------------------------------------|
| Ponto de Partida            | Nenhum efeito ao cair; R$ 50 ao passar por ela     |
| Bônus                       | Jogador recebe R$ 100                               |
| Perda de saldo              | Jogador perde R$ 50                                 |
| Imposto de Renda            | Jogador perde R$ 200                                |
| Imposto Progressivo         | Jogador perde R$ 10 + (R$ 5 × sua posição atual)  |
| Volte X casas               | Jogador recua 3 posições                            |
| Avance para o Ponto de Partida | Jogador vai para a posição 0 (sem bônus)         |
| Vá para outra casa          | Teleporta o jogador para a posição 0               |

---

## Fluxo de Jogo

```
1. Configuração
   └─ Jogadores informam seus nomes → jogo inicia

2. Turno do jogador ativo
   ├─ Jogador rola os dados (aleatório ou manual)
   └─ Jogador avança no tabuleiro

3. Resolução da casa
   ├─ Imóvel sem dono    → modal de compra (aceitar/recusar)
   ├─ Imóvel com dono    → Observer notifica; aluguel debitado automaticamente
   ├─ Empresa sem dono   → modal de compra
   ├─ Empresa com dono   → aluguel = dados × multiplicador × preço
   └─ Casa especial      → efeito aplicado imediatamente

4. Verificação de falência
   └─ Saldo < 0 → jogador faliu → jogo reinicia

5. Troca de turno → volta ao passo 2
```

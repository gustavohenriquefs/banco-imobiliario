'use client'

import { useState, useEffect } from 'react';
import { EventoMoverCasa, TabuleiroController } from './controllers/tabuleiro.controller';
import { Propriedade } from './models/propriedade';
import { Jogador } from './models/jogador';
import { Imovel } from './models/imovel';
import { Empresa } from './models/empresa';
import './tabuleiro.css';

export default function Home() {
  const [controller] = useState<TabuleiroController>(new TabuleiroController());
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [jogador1Nome, setJogador1Nome] = useState<string>('');
  const [jogador2Nome, setJogador2Nome] = useState<string>('');
  const [jogoIniciado, setJogoIniciado] = useState<boolean>(false);
  const [jogadorAtual, setJogadorAtual] = useState<Jogador | null>(null);
  const [jogador1, setJogador1] = useState<Jogador | null>(null);
  const [jogador2, setJogador2] = useState<Jogador | null>(null);
  const [ultimoEvento, setUltimoEvento] = useState<string>('');
  const [resultadoDado, setResultadoDado] = useState<number>(0);
  const [dadoManual, setDadoManual] = useState<string>('');
  const [mostrarCompra, setMostrarCompra] = useState<boolean>(false);
  const [propriedadeAtual, setPropriedadeAtual] = useState<Propriedade | null>(null);
  const [propriedadesJogador1, setPropriedadesJogador1] = useState<Propriedade[]>([]);
  const [propriedadesJogador2, setPropriedadesJogador2] = useState<Propriedade[]>([]);
  const [historicoJogadas, setHistoricoJogadas] = useState<string[]>([]);

  useEffect(() => {
    if (controller) {
      setPropriedades(controller.getPropriedades());
    }
  }, [controller]);

  // Atualiza a lista de propriedades dos jogadores
  useEffect(() => {
    if (jogoIniciado) {
      atualizarPropriedadesJogadores();
    }
  }, [jogador1, jogador2, propriedades]);

  const atualizarPropriedadesJogadores = () => {
    if (!jogador1 || !jogador2) return;

    const props1 = propriedades.filter(prop => {
      if (prop instanceof Imovel) {
        return prop.getDono()?.nome === jogador1.nome;
      } else if (prop instanceof Empresa) {
        return prop.dono?.nome === jogador1.nome;
      }
      return false;
    });

    const props2 = propriedades.filter(prop => {
      if (prop instanceof Imovel) {
        return prop.getDono()?.nome === jogador2.nome;
      } else if (prop instanceof Empresa) {
        return prop.dono?.nome === jogador2.nome;
      }
      return false;
    });

    setPropriedadesJogador1(props1);
    setPropriedadesJogador2(props2);
  };

  const iniciarJogo = () => {
    if (jogador1Nome && jogador2Nome) {
      controller.criarJogadores(jogador1Nome, jogador2Nome);
      setJogoIniciado(true);
      setJogador1(new Jogador(jogador1Nome));
      setJogador2(new Jogador(jogador2Nome));
      setJogadorAtual(new Jogador(jogador1Nome));
      setHistoricoJogadas([`Jogo iniciado: ${jogador1Nome} vs ${jogador2Nome}`]);
    }
  };

  const handleDadoManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDadoManual(value);
  };

  const jogarDado = () => {
    let resultado: number;

    if (dadoManual && parseInt(dadoManual) >= 1 && parseInt(dadoManual) <= 6) {
      resultado = parseInt(dadoManual);
    } else {
      resultado = Math.floor(Math.random() * 6) + 1;
    }

    setResultadoDado(resultado);
    setDadoManual('');

    if (jogadorAtual) {
      const posicaoAnterior = jogadorAtual.posicao;
      const evento = controller.moverJogador(jogadorAtual, resultado);
      setUltimoEvento(evento);

      const novaPropriedade = controller.getPropriedades()[jogadorAtual.posicao];
      setPropriedadeAtual(novaPropriedade);

      // Adicionar ao histórico
      setHistoricoJogadas(prev => [
        ...prev,
        `${jogadorAtual.nome} tirou ${resultado} e foi de ${posicaoAnterior} para ${jogadorAtual.posicao} (${novaPropriedade.nome})`
      ]);

      if (evento === EventoMoverCasa.ComprarImovel || evento === EventoMoverCasa.ComprarEmpresa) {
        setMostrarCompra(true);
      } else {
        processarEvento(evento);
      }
    }
  };

  const processarEvento = (evento: EventoMoverCasa) => {
    if (!jogador1 || !jogador2) return;
    switch (evento) {
      case EventoMoverCasa.PagarAluguel:
        if (jogadorAtual && propriedadeAtual && propriedadeAtual instanceof Imovel) {
          const aluguel = propriedadeAtual.calcularAluguel();
          jogadorAtual.saldo -= aluguel;

          // Adicionar valor ao dono
          const j1 = jogador1;
          const j2 = jogador2;
          if (j1 && propriedadeAtual.getDono()?.nome === j1.nome) {
            j1.saldo += aluguel;
            setJogador1(Object.assign(new Jogador(j1.nome), j1));
            setHistoricoJogadas(prev => [
              ...prev,
              `${jogadorAtual.nome} pagou R$${aluguel} de aluguel para ${j1.nome}`
            ]);
          } else if (j2 && propriedadeAtual.getDono()?.nome === j2.nome) {
            j2.saldo += aluguel;
            setJogador2(Object.assign(new Jogador(j2.nome), j2));
            setHistoricoJogadas(prev => [
              ...prev,
              `${jogadorAtual.nome} pagou R$${aluguel} de aluguel para ${j2.nome}`
            ]);
          }

          // Atualizar jogador atual
          if (jogadorAtual.nome === jogador1?.nome) {
            setJogador1(jogadorAtual);
          } else {
            setJogador2(jogadorAtual);
          }
        }
        break;
      case EventoMoverCasa.PagarEmpresa:
        if (jogadorAtual && propriedadeAtual && propriedadeAtual instanceof Empresa) {
          const aluguel = propriedadeAtual.calcularAluguel();
          jogadorAtual.saldo -= aluguel;

          // Adicionar valor ao dono
          if (propriedadeAtual.dono?.nome === jogador1?.nome) {
            jogador1.saldo += aluguel;
            setJogador1(Object.assign(new Jogador(jogador1!.nome), jogador1));
            setHistoricoJogadas(prev => [
              ...prev,
              `${jogadorAtual.nome} pagou R$${aluguel} pelo serviço de ${propriedadeAtual.nome} para ${jogador1!.nome}`
            ]);
          } else if (propriedadeAtual.dono?.nome === jogador2?.nome && jogador2) {
            jogador2.saldo += aluguel;
            setJogador2(Object.assign(new Jogador(jogador2!.nome), jogador2!));
            setHistoricoJogadas(prev => [
              ...prev,
              `${jogadorAtual.nome} pagou R$${aluguel} pelo serviço de ${propriedadeAtual.nome} para ${jogador2.nome}`
            ]);
          }

          // Atualizar jogador atual
          if (jogadorAtual.nome === jogador1?.nome) {
            setJogador1(Object.assign(new Jogador(jogadorAtual!.nome), jogadorAtual!));
          } else {
            setJogador2(Object.assign(new Jogador(jogadorAtual!.nome), jogadorAtual!));
          }
        }
        break;
      case EventoMoverCasa.PagarImposto:
        setHistoricoJogadas(prev => [
          ...prev,
          `${jogadorAtual?.nome} caiu em um lugar especial`
        ]);
        break;
    }

    // Alternar jogador
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
  };

  const comprarPropriedade = () => {
    if (jogadorAtual && propriedadeAtual) {
      if (propriedadeAtual instanceof Imovel) {
        propriedadeAtual.setDono(jogadorAtual);
        jogadorAtual.saldo -= propriedadeAtual.preco;
        setHistoricoJogadas(prev => [
          ...prev,
          `${jogadorAtual.nome} comprou ${propriedadeAtual.nome} por R$${propriedadeAtual.preco}`
        ]);
      } else if (propriedadeAtual instanceof Empresa) {
        propriedadeAtual.dono = jogadorAtual;
        jogadorAtual.saldo -= propriedadeAtual.preco;
        setHistoricoJogadas(prev => [
          ...prev,
          `${jogadorAtual.nome} comprou ${propriedadeAtual.nome} por R$${propriedadeAtual.preco}`
        ]);
      }

      // Atualizar estado do jogador
      if (jogadorAtual.nome === jogador1?.nome) {
        setJogador1(Object.assign(new Jogador(jogadorAtual!.nome), jogadorAtual));
      } else {
        setJogador2(Object.assign(new Jogador(jogadorAtual!.nome), jogadorAtual));
      }

      // Atualizar propriedades do tabuleiro
      setPropriedades([...propriedades]);
    }

    setMostrarCompra(false);
    // Alternar jogador
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
  };

  const recusarCompra = () => {
    setHistoricoJogadas(prev => [
      ...prev,
      `${jogadorAtual?.nome} recusou comprar ${propriedadeAtual?.nome}`
    ]);
    setMostrarCompra(false);
    // Alternar jogador
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
  };

  const getCorCarta = (prop: Propriedade) => {
    if (prop instanceof Imovel) {
      return 'cartaImovel';
    } else if (prop instanceof Empresa) {
      return 'cartaEmpresa';
    } else {
      return 'cartaEspecial';
    }
  };

  return (
    <div className="app-container">
      <div className="game-header">
        <h1>Banco Imobiliário</h1>
      </div>

      {!jogoIniciado ? (
        <div className="setup-container">
          <div className="setup-card">
            <h2>Configurar Jogadores</h2>
            <div className="input-group">
              <label>Jogador 1:</label>
              <input
                type="text"
                value={jogador1Nome}
                onChange={(e) => setJogador1Nome(e.target.value)}
                placeholder="Nome do Jogador 1"
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Jogador 2:</label>
              <input
                type="text"
                value={jogador2Nome}
                onChange={(e) => setJogador2Nome(e.target.value)}
                placeholder="Nome do Jogador 2"
                className="input-field"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={iniciarJogo}
              disabled={!jogador1Nome || !jogador2Nome}
            >
              Iniciar Jogo
            </button>
          </div>
        </div>
      ) : (
        <div className="game-layout">
          <div className="sidebar">
            <div className={`player-card ${jogadorAtual?.nome === jogador1?.nome ? 'active-player' : ''}`}>
              <div className="player-header">
                <h3>{jogador1?.nome}</h3>
                <div className="player-token player1-token"></div>
              </div>
              <div className="player-info">
                <div className="saldo-display">
                  <span>Saldo:</span>
                  <span className="saldo-value">R$ {jogador1?.saldo}</span>
                </div>
                <div className="posicao-display">
                  <span>Posição:</span>
                  <span>{jogador1?.posicao}</span>
                </div>
              </div>

              <div className="propriedades-section">
                <h4>Suas Propriedades:</h4>
                {propriedadesJogador1.length === 0 ? (
                  <p className="no-properties">Nenhuma propriedade adquirida</p>
                ) : (
                  <div className="properties-grid">
                    {propriedadesJogador1.map((prop, idx) => (
                      <div key={idx} className={`mini-property ${getCorCarta(prop)}`}>
                        <span className="mini-property-name">{prop.nome}</span>
                        <span className="mini-property-price">R$ {prop.preco}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`player-card ${jogadorAtual?.nome === jogador2?.nome ? 'active-player' : ''}`}>
              <div className="player-header">
                <h3>{jogador2?.nome}</h3>
                <div className="player-token player2-token"></div>
              </div>
              <div className="player-info">
                <div className="saldo-display">
                  <span>Saldo:</span>
                  <span className="saldo-value">R$ {jogador2?.saldo}</span>
                </div>
                <div className="posicao-display">
                  <span>Posição:</span>
                  <span>{jogador2?.posicao}</span>
                </div>
              </div>

              <div className="propriedades-section">
                <h4>Suas Propriedades:</h4>
                {propriedadesJogador2.length === 0 ? (
                  <p className="no-properties">Nenhuma propriedade adquirida</p>
                ) : (
                  <div className="properties-grid">
                    {propriedadesJogador2.map((prop, idx) => (
                      <div key={idx} className={`mini-property ${getCorCarta(prop)}`}>
                        <span className="mini-property-name">{prop.nome}</span>
                        <span className="mini-property-price">R$ {prop.preco}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="historico-section">
              <h4>Histórico</h4>
              <div className="history-list">
                {historicoJogadas.map((jogada, idx) => (
                  <div key={idx} className="history-item">
                    <span className="history-number">{idx + 1}.</span>
                    <span className="history-text">{jogada}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="game-actions">
              <div className="turno-info">
                <h3>Vez de jogar:</h3>
                <div className={`current-player ${jogadorAtual?.nome === jogador1?.nome ? 'player1-bg' : 'player2-bg'}`}>
                  {jogadorAtual?.nome}
                </div>
              </div>

              {!mostrarCompra && (
                <div className="dice-section">
                  <div className="dice-input-container">
                    <input
                      type="text"
                      className="dice-input"
                      placeholder="2-12"
                      value={dadoManual}
                      onChange={handleDadoManualChange}
                      maxLength={2}
                    />
                    <button className="btn-roll-dice" onClick={jogarDado}>
                      {dadoManual ? 'Usar valor' : 'Jogar Dado'}
                    </button>
                  </div>

                  {resultadoDado > 0 && (
                    <div className="dice-result">
                      <div className="dice-face">
                        {resultadoDado}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {ultimoEvento && (
                <div className="evento-info">
                  <span className="evento-label">Evento:</span>
                  <span className="evento-valor">{ultimoEvento}</span>
                </div>
              )}
            </div>

            {mostrarCompra && propriedadeAtual && (
              <div className="comprar-modal">
                <div className="modal-content">
                  <h3>Deseja comprar esta propriedade?</h3>
                  <div className={`propriedade-card ${getCorCarta(propriedadeAtual)}`}>
                    <h4>{propriedadeAtual.nome}</h4>
                    <div className="card-price">R$ {propriedadeAtual.preco}</div>
                    {propriedadeAtual instanceof Imovel && (
                      <div className="card-rent">Aluguel: R$ {propriedadeAtual.calcularAluguel()}</div>
                    )}
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-comprar"
                      onClick={comprarPropriedade}
                      disabled={jogadorAtual ? jogadorAtual.saldo < propriedadeAtual.preco : true}
                    >
                      Comprar
                    </button>
                    <button className="btn-recusar" onClick={recusarCompra}>
                      Recusar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="tabuleiro">
              {propriedades.map((prop, index) => {
                const jogador1Presente = jogador1 && jogador1.posicao === index;
                const jogador2Presente = jogador2 && jogador2.posicao === index;

                // Determinar dono para cor da borda
                let donoClasse = '';
                if (prop instanceof Imovel) {
                  if (prop.getDono()?.nome === jogador1?.nome) donoClasse = 'propriedade-jogador1';
                  else if (prop.getDono()?.nome === jogador2?.nome) donoClasse = 'propriedade-jogador2';
                } else if (prop instanceof Empresa) {
                  if (prop.dono?.nome === jogador1?.nome) donoClasse = 'propriedade-jogador1';
                  else if (prop.dono?.nome === jogador2?.nome) donoClasse = 'propriedade-jogador2';
                }

                return (
                  <div
                    key={index}
                    className={`propriedade ${getCorCarta(prop)} ${donoClasse}`}
                  >
                    <div className="propriedade-header">
                      <span className="propriedade-posicao">{index}</span>
                      <h4 className="propriedade-nome">{prop.nome}</h4>
                    </div>

                    {(prop instanceof Imovel || prop instanceof Empresa) && (
                      <div className="propriedade-detalhes">
                        <span className="propriedade-preco">R$ {prop.preco}</span>

                        {prop instanceof Imovel && (
                          <span className="propriedade-aluguel">
                            Aluguel: R$ {prop.calcularAluguel()}
                          </span>
                        )}

                        <div className="propriedade-status">
                          {prop instanceof Imovel ? (
                            prop.getDono() ? `Dono: ${prop.getDono()!.nome}` : 'Disponível'
                          ) : prop instanceof Empresa ? (
                            prop.dono ? `Dono: ${prop.dono.nome}` : 'Disponível'
                          ) : ''}
                        </div>
                      </div>
                    )}

                    <div className="jogadores-presentes">
                      {jogador1Presente && <div className="jogador-token token-1"></div>}
                      {jogador2Presente && <div className="jogador-token token-2"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
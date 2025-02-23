// Home.tsx
'use client';

import React, { useState, useEffect } from 'react';
import './tabuleiro.css';
import { TabuleiroController, EventoMoverCasa } from './controllers/tabuleiro.controller';
import { IPropriedade } from './models/propriedade';
import { Jogador } from './models/jogador';
import { SetupForm } from './setup-form';
import { PlayerCard } from './player-card';
import { DiceSection } from './dice-section';
import { ComprarModal } from './comprar-modal';
import { Tabuleiro } from './tabuleiro';
import { LugarEspecial } from './models/lugar-especial';

export default function Home() {
  const [controller] = useState<TabuleiroController>(new TabuleiroController());
  const [propriedades, setPropriedades] = useState<IPropriedade[]>([]);
  const [jogoIniciado, setJogoIniciado] = useState<boolean>(false);
  const [jogadorAtual, setJogadorAtual] = useState<Jogador | null>(null);
  const [ultimoEvento, setUltimoEvento] = useState<string>('');
  const [resultadoDado, setResultadoDado] = useState<number>(0);
  const [mostrarCompra, setMostrarCompra] = useState<boolean>(false);
  const [propriedadeAtual, setPropriedadeAtual] = useState<IPropriedade | null>(null);
  const [dadoManual, setDadoManual] = useState<string>('');

  useEffect(() => {
    setPropriedades(controller.getPropriedades());
  }, [controller]);

  const iniciarJogo = (jogador1Nome: string, jogador2Nome: string) => {
    controller.criarJogadores(jogador1Nome, jogador2Nome);

    setJogoIniciado(true);

    setJogadorAtual(controller.getJogadores().jogador1);
  };

  const handleDadoManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDadoManual(e.target.value);
  };

  const jogarDado = () => {
    if (!jogadorAtual) return;

    const { resultado, evento, propriedade } = controller.realizarJogada(
      jogadorAtual,
      dadoManual ? parseInt(dadoManual) : undefined
    );

    // atualizar estados da interface
    setResultadoDado(resultado);
    setUltimoEvento(evento);
    setPropriedadeAtual(propriedade);
    setDadoManual('');

    // se o evento for de compra, mostrar modal
    if (evento === EventoMoverCasa.ComprarImovel || evento === EventoMoverCasa.ComprarEmpresa) {
      setMostrarCompra(true);
    } else if (evento === EventoMoverCasa.PagarAluguel) {
      // aluguel já foi descontado do saldo do jogador atual

      const novoJogador = controller.trocarJogador(jogadorAtual);
      setJogadorAtual(novoJogador);
    } else if (evento === EventoMoverCasa.PagarEmpresa) {
      // imposto já foi descontado do saldo do jogador atual (TODO: implementar)

      const novoJogador = controller.trocarJogador(jogadorAtual);
      setJogadorAtual(novoJogador);
    } else if (evento === EventoMoverCasa.AcaoEspecial) {
      // executar ação especial
      (propriedade as LugarEspecial).ativarEfeito(jogadorAtual);

      const novoJogador = controller.trocarJogador(jogadorAtual);
      setJogadorAtual(novoJogador);
    }

    if (jogadorAtual.saldo < 0) {
      alert(`O jogador ${jogadorAtual.nome} faliu!`);

      controller.reiniciarJogo();

      setJogoIniciado(false);
    }
  };

  const comprarPropriedade = () => {
    if (jogadorAtual && propriedadeAtual) {

      controller.comprarPropriedade(jogadorAtual, propriedadeAtual);
      setMostrarCompra(false);

      const novoJogador = controller.trocarJogador(jogadorAtual);
      setJogadorAtual(novoJogador);
    }
  };

  const recusarCompra = () => {
    setMostrarCompra(false);
    if (jogadorAtual) {
      const novoJogador = controller.trocarJogador(jogadorAtual);
      setJogadorAtual(novoJogador);
    }
  };

  const jogadores = controller.getJogadores();

  return (
    <div className="app-container">
      <div className="game-header">
        <h1>Banco Imobiliário</h1>
      </div>
      {!jogoIniciado ? (
        <SetupForm onStart={iniciarJogo} />
      ) : (
        <div className="game-layout">
          <div className="sidebar">
            <PlayerCard
              jogador={jogadores.jogador1}
              active={jogadorAtual === jogadores.jogador1}
              tokenClass="player1-token"
            />
            <PlayerCard
              jogador={jogadores.jogador2}
              active={jogadorAtual === jogadores.jogador2}
              tokenClass="player2-token"
            />
          </div>
          <div className="main-content">
            <div className="game-actions">
              <div className="turno-info">
                <h3>Vez de jogar:</h3>
                <div
                  className={`current-player ${jogadorAtual === jogadores.jogador1 ? 'player1-bg' : 'player2-bg'}`}
                >
                  {jogadorAtual?.nome}
                </div>
              </div>
              {!mostrarCompra && (
                <DiceSection
                  dadoManual={dadoManual}
                  onDadoChange={handleDadoManualChange}
                  onJogarDado={jogarDado}
                  resultadoDado={resultadoDado}
                />
              )}
              {ultimoEvento && (
                <div className="evento-info">
                  <span className="evento-label">Evento:</span>
                  <span className="evento-valor">{ultimoEvento}</span>
                </div>
              )}
            </div>

            {mostrarCompra && propriedadeAtual && (
              <ComprarModal
                propriedade={propriedadeAtual}
                onComprar={comprarPropriedade}
                onRecusar={recusarCompra}
                jogadorSaldo={jogadorAtual ? jogadorAtual.saldo : 0}
              />
            )}

            <Tabuleiro
              propriedades={propriedades}
              jogadores={jogadores}
            />
          </div>
        </div>
      )}
    </div>
  );
}

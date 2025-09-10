import React from 'react';
import { Jogador } from './models/jogador';

interface PlayerCardProps {
  jogador: Jogador;
  active: boolean;
  tokenClass: string;
}

export function PlayerCard({ jogador, active, tokenClass }: PlayerCardProps) {
  return (
    <div className={`player-card ${active ? 'active-player' : ''}`}>
      <div className="player-header">
        <h3>{jogador.nome}</h3>
        <div className={`player-token ${tokenClass}`}></div>
      </div>
      <div className="player-info">
        <div className="saldo-display">
          <span>Saldo:</span>
          <span className="saldo-value">R$ {jogador.saldo}</span>
        </div>
        <div className="posicao-display">
          <span>Posição:</span>
          <span>{jogador.posicaoAtual}</span>
        </div>
      </div>
    </div>
  );
}

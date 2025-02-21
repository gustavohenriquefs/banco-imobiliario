// SetupForm.tsx
import React, { useState } from 'react';

interface SetupFormProps {
  onStart: (jogador1Nome: string, jogador2Nome: string) => void;
}

export function SetupForm({ onStart }: SetupFormProps) {
  const [jogador1Nome, setJogador1Nome] = useState('');
  const [jogador2Nome, setJogador2Nome] = useState('');

  const iniciarJogo = () => {
    if (jogador1Nome && jogador2Nome) {
      onStart(jogador1Nome, jogador2Nome);
    }
  };

  return (
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
  );
}

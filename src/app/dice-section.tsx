import React from 'react';

interface DiceSectionProps {
  dadoManual: string;
  onDadoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onJogarDado: () => void;
  resultadoDado: number;
}

export function DiceSection({
  dadoManual,
  onDadoChange,
  onJogarDado,
  resultadoDado,
}: DiceSectionProps) {
  return (
    <div className="dice-section">
      <div className="dice-input-container">
        <input
          type="text"
          className="input-field dice-input"
          placeholder="2-12"
          value={dadoManual}
          onChange={onDadoChange}
          maxLength={2}
        />
        <button className="btn btn-primary btn-roll-dice" onClick={onJogarDado}>
          {dadoManual ? 'Usar valor' : 'Jogar Dado'}
        </button>
      </div>
      {resultadoDado > 0 && (
        <div className="dice-result">
          <div className="dice-face">{resultadoDado}</div>
        </div>
      )}
    </div>
  );
}

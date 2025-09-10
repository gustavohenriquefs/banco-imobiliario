import React from 'react';
import { IPropriedade } from './models/propriedade';

interface ComprarModalProps {
  propriedade: IPropriedade;
  onComprar: () => void;
  onRecusar: () => void;
  jogadorSaldo: number;
}

export function ComprarModal({
  propriedade,
  onComprar,
  onRecusar,
  jogadorSaldo,
}: ComprarModalProps) {
  return (
    <div className="comprar-modal">
      <div className="modal-content">
        <h3>Deseja comprar esta propriedade?</h3>
        <div className="propriedade-card">
          <h4>{propriedade.nome}</h4>
          <div className="card-price">R$ {propriedade.preco}</div>
        </div>
        <div className="modal-actions">
          <button
            className="btn-comprar"
            onClick={onComprar}
            disabled={jogadorSaldo < propriedade.preco}
          >
            Comprar
          </button>
          <button className="btn-recusar" onClick={onRecusar}>
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}

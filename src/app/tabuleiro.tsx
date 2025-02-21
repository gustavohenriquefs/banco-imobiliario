// Tabuleiro.tsx
import React from 'react';
import { Propriedade } from './models/propriedade';
import { Imovel } from './models/imovel';
import { Empresa } from './models/empresa';
import { Jogador } from './models/jogador';

interface TabuleiroProps {
  propriedades: Propriedade[];
  jogadores: { jogador1: Jogador; jogador2: Jogador };
}

export function Tabuleiro({ propriedades, jogadores }: TabuleiroProps) {
  return (
    <div className="tabuleiro">
      {propriedades.map((prop, index) => (
        <div
          key={index}
          className={`propriedade 
            ${jogadores.jogador1.posicaoAtual === index ? 'propriedade-jogador1' : ''} 
            ${jogadores.jogador2.posicaoAtual === index ? 'propriedade-jogador2' : ''}`}
        >
          <div className="propriedade-header">
            <span className="propriedade-posicao">{index}</span>
            <h4 className="propriedade-nome">{prop.nome}</h4>
          </div>
          {(prop instanceof Imovel || prop instanceof Empresa) && (
            <div className="propriedade-detalhes">
              <span className="propriedade-preco">R$ {prop.preco}</span>
              <div className="propriedade-status">
                {prop instanceof Imovel
                  ? `Dono: ${prop.getDono() ? prop.getDono()!.nome : 'Disponível'}`
                  : `Dono: ${prop instanceof Empresa && prop.dono ? prop.dono.nome : 'Disponível'}`}
              </div>
            </div>
          )}
          <div className="jogadores-presentes">
            {jogadores.jogador1.posicaoAtual === index && (
              <div className="jogador-token token-1"></div>
            )}
            {jogadores.jogador2.posicaoAtual === index && (
              <div className="jogador-token token-2"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

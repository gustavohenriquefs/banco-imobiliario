import { useState, useEffect } from 'react';
import { TabuleiroController, EventoMoverCasa } from '../controllers/tabuleiro.controller';
import styles from '../styles/Tabuleiro.module.css';
import { Jogador } from '../models/jogador';
import { Propriedade } from '../models/propriedade';
import { Imovel } from '../models/imovel';
import { Empresa } from '../models/empresa';

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
  const [mostrarCompra, setMostrarCompra] = useState<boolean>(false);
  const [propriedadeAtual, setPropriedadeAtual] = useState<Propriedade | null>(null);

  useEffect(() => {
    if (controller) {
      setPropriedades(controller.getPropriedades());
    }
  }, [controller]);

  const iniciarJogo = () => {
    if (jogador1Nome && jogador2Nome) {
      controller.criarJogadores(jogador1Nome, jogador2Nome);
      setJogoIniciado(true);
      setJogador1(new Jogador(jogador1Nome));
      setJogador2(new Jogador(jogador2Nome));
      setJogadorAtual(new Jogador(jogador1Nome));
    }
  };

  const jogarDado = () => {
    const resultado = Math.floor(Math.random() * 6) + 1;
    setResultadoDado(resultado);
    
    if (jogadorAtual) {
      const evento = controller.moverJogador(jogadorAtual, resultado);
      setUltimoEvento(evento);
      
      const novaPropriedade = controller.getPropriedades()[jogadorAtual.posicao];
      setPropriedadeAtual(novaPropriedade);
      
      if (evento === EventoMoverCasa.ComprarImovel || evento === EventoMoverCasa.ComprarEmpresa) {
        setMostrarCompra(true);
      } else {
        processarEvento(evento);
      }
    }
  };

  const processarEvento = (evento: EventoMoverCasa) => {
    switch (evento) {
      case EventoMoverCasa.PagarAluguel:
        if (jogadorAtual && propriedadeAtual && propriedadeAtual instanceof Imovel) {
          const aluguel = propriedadeAtual.calcularAluguel();
          jogadorAtual.saldo -= aluguel;
          
          // Adicionar valor ao dono
          if (propriedadeAtual.getDono()?.nome === jogador1Nome) {
            jogador1!.saldo += aluguel;
          } else if (propriedadeAtual.getDono()?.nome === jogador2Nome) {
            jogador2!.saldo += aluguel;
          }
        }
        break;
      case EventoMoverCasa.PagarEmpresa:
        if (jogadorAtual && propriedadeAtual && propriedadeAtual instanceof Empresa) {
          const aluguel = propriedadeAtual.calcularAluguel();
          jogadorAtual.saldo -= aluguel;
          
          // Adicionar valor ao dono
          if (propriedadeAtual.dono?.nome === jogador1Nome) {
            jogador1!.saldo += aluguel;
          } else if (propriedadeAtual.dono?.nome === jogador2Nome) {
            jogador2!.saldo += aluguel;
          }
        }
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
      } else if (propriedadeAtual instanceof Empresa) {
        propriedadeAtual.dono = jogadorAtual;
        jogadorAtual.saldo -= propriedadeAtual.preco;
      }
    }
    setMostrarCompra(false);
    // Alternar jogador
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
  };

  const recusarCompra = () => {
    setMostrarCompra(false);
    // Alternar jogador
    setJogadorAtual(jogadorAtual === jogador1 ? jogador2 : jogador1);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Banco Imobiliário</h1>
      
      {!jogoIniciado ? (
        <div className={styles.setupContainer}>
          <h2>Configurar Jogadores</h2>
          <div className={styles.inputGroup}>
            <label>Jogador 1:</label>
            <input
              type="text"
              value={jogador1Nome}
              onChange={(e) => setJogador1Nome(e.target.value)}
              placeholder="Nome do Jogador 1"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Jogador 2:</label>
            <input
              type="text"
              value={jogador2Nome}
              onChange={(e) => setJogador2Nome(e.target.value)}
              placeholder="Nome do Jogador 2"
            />
          </div>
          <button 
            className={styles.button}
            onClick={iniciarJogo}
            disabled={!jogador1Nome || !jogador2Nome}
          >
            Iniciar Jogo
          </button>
        </div>
      ) : (
        <div className={styles.gameContainer}>
          <div className={styles.jogadoresInfo}>
            <div className={`${styles.jogadorCard} ${jogadorAtual === jogador1 ? styles.jogadorAtivo : ''}`}>
              <h3>{jogador1?.nome}</h3>
              <p>Saldo: R$ {jogador1?.saldo}</p>
              <p>Posição: {jogador1?.posicao}</p>
            </div>
            <div className={`${styles.jogadorCard} ${jogadorAtual === jogador2 ? styles.jogadorAtivo : ''}`}>
              <h3>{jogador2?.nome}</h3>
              <p>Saldo: R$ {jogador2?.saldo}</p>
              <p>Posição: {jogador2?.posicao}</p>
            </div>
          </div>
          
          <div className={styles.gameActions}>
            <p>Vez de: <strong>{jogadorAtual?.nome}</strong></p>
            {!mostrarCompra && (
              <button className={styles.dadoButton} onClick={jogarDado}>
                Jogar Dado
              </button>
            )}
            {resultadoDado > 0 && (
              <p className={styles.dadoResultado}>Resultado do dado: {resultadoDado}</p>
            )}
            {ultimoEvento && (
              <p className={styles.evento}>Evento: {ultimoEvento}</p>
            )}
          </div>
          
          {mostrarCompra && propriedadeAtual && (
            <div className={styles.comprarModal}>
              <h3>Deseja comprar {propriedadeAtual.nome}?</h3>
              <p>Preço: R$ {propriedadeAtual.preco}</p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.comprarButton}
                  onClick={comprarPropriedade}
                  disabled={jogadorAtual ? jogadorAtual.saldo < propriedadeAtual.preco : true}
                >
                  Comprar
                </button>
                <button className={styles.recusarButton} onClick={recusarCompra}>
                  Recusar
                </button>
              </div>
            </div>
          )}
          
          <div className={styles.tabuleiro}>
            {propriedades.map((prop, index) => (
              <div 
                key={index} 
                className={`${styles.propriedade} ${
                  jogador1 && jogador1.posicao === index ? styles.jogador1Presente : ''
                } ${
                  jogador2 && jogador2.posicao === index ? styles.jogador2Presente : ''
                }`}
              >
                <p className={styles.propriedadeNome}>{prop.nome}</p>
                {prop instanceof Imovel && (
                  <>
                    <p className={styles.propriedadePreco}>R$ {prop.preco}</p>
                    <p className={styles.propriedadeDono}>
                      {prop.getDono() ? `Dono: ${prop.getDono()}` : 'Disponível'}
                    </p>
                  </>
                )}
                {prop instanceof Empresa && (
                  <>
                    <p className={styles.propriedadePreco}>R$ {prop.preco}</p>
                    <p className={styles.propriedadeDono}>
                      {prop.dono ? `Dono: ${prop.dono}` : 'Disponível'}
                    </p>
                  </>
                )}
                {!(prop instanceof Imovel) && !(prop instanceof Empresa) && (
                  <p className={styles.propriedadeTipo}>Lugar Especial</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
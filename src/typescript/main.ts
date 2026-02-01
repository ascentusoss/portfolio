import "../styles/style.css";

import { inject } from "@vercel/analytics";
import type { CardState, MemoryItem } from "../types/memory";

/**
 * Injeta analytics do Vercel
 */
inject();

/**
 * Atualiza o ano atual no rodapé da página
 */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

/**
 * Embaralha um array no lugar usando algoritmo Fisher-Yates
 * @template T - Tipo genérico do array
 * @param arr - Array a ser embaralhado
 * @returns O array embaralhado
 */
function shuffleInPlace<T>(arr: T[]): T[] {
  const LAST_ELEMENT = arr.length - 1;
  const FIRST_VALID_INDEX = 0;

  for (let i = LAST_ELEMENT; i > FIRST_VALID_INDEX; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}

function initMemoryGame() {
  const gridEl = document.getElementById("memory-grid");
  const statusEl = document.getElementById("memory-status");
  const resetEl = document.getElementById("memory-reset");

  if (!(gridEl instanceof HTMLElement)) return;
  if (!(statusEl instanceof HTMLElement)) return;
  if (!(resetEl instanceof HTMLButtonElement)) return;

  /** Items base do jogo de memória */
  const base: MemoryItem[] = [
    { key: "ts", label: "TypeScript" },
    { key: "node", label: "Node.js" },
    { key: "next", label: "Next.js" },
    { key: "tw", label: "Tailwind" },
  ];

  const totalPairs = base.length;

  let selected: CardState[] = [];
  let lock = false;
  let pairsFound = 0;

  /** Tempo em milissegundos para esconder cartas que não formaram par */
  const CARD_HIDE_DELAY_MS = 650;
  /** Número de cartas selecionadas necessárias para validar um par */
  const SELECTED_CARDS_FOR_PAIR = 2;

  /**
   * Atualiza o status do jogo exibindo pares encontrados
   */
  const updateStatus = () => {
    statusEl.textContent = `Pares: ${pairsFound}/${totalPairs}`;
  };

  /**
   * Renderiza o estado visual da carta
   * @param card - Estado da carta a ser renderizada
   */
  const renderCard = (card: CardState) => {
    card.el.classList.toggle("is-revealed", card.revealed || card.matched);

    if (card.matched) {
      card.el.disabled = true;
      card.el.setAttribute("aria-pressed", "true");
      card.el.textContent = card.item.label;
      return;
    }

    card.el.disabled = false;
    card.el.setAttribute("aria-pressed", card.revealed ? "true" : "false");
    card.el.textContent = card.revealed ? card.item.label : "?";
  };

  /**
   * Revela uma carta
   * @param card - Carta a ser revelada
   */
  const reveal = (card: CardState) => {
    card.revealed = true;
    renderCard(card);
  };

  const hide = (card: CardState) => {
    card.revealed = false;
    renderCard(card);
  };

  /**
   * Marca uma carta como pareada
   * @param card - Carta a ser marcada como pareada
   */
  const setMatched = (card: CardState) => {
    card.matched = true;
    renderCard(card);
  };

  /**
   * Manipula o clique em uma carta verificando pares
   * @param card - Carta clicada
   */
  const onCardClick = async (card: CardState) => {
    if (lock) return;
    if (card.matched || card.revealed) return;

    reveal(card);
    selected = [...selected, card];

    if (selected.length < SELECTED_CARDS_FOR_PAIR) return;

    lock = true;
    const [a, b] = selected;

    if (a.item.key === b.item.key) {
      setMatched(a);
      setMatched(b);
      pairsFound += 1;
      selected = [];
      updateStatus();
      lock = false;
      return;
    }

    window.setTimeout(() => {
      hide(a);
      hide(b);
      selected = [];
      lock = false;
    }, CARD_HIDE_DELAY_MS);
  };

  /**
   * Constrói o tabuleiro do jogo com cartas embaralhadas
   */
  const build = () => {
    gridEl.replaceChildren();
    selected = [];
    lock = false;
    pairsFound = 0;
    updateStatus();

    const deck = shuffleInPlace(
      [...base, ...base].map((item) => ({ ...item })),
    );

    deck.map((item, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "memory-card";
      btn.setAttribute("aria-label", "Carta do jogo da memória");
      btn.textContent = "?";

      const state: CardState = {
        id: index,
        item,
        revealed: false,
        matched: false,
        el: btn,
      };

      btn.addEventListener("click", () => void onCardClick(state));
      gridEl.appendChild(btn);
      return state;
    });
  };

  resetEl.addEventListener("click", () => build());
  build();
}

/**
 * Inicializa o jogo da memória quando o DOM está pronto
 */
initMemoryGame();

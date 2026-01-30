import "../styles/style.css";

import { inject } from "@vercel/analytics";

inject();

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

type MemoryItem = {
  key: string;
  label: string;
};

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
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

  const base: MemoryItem[] = [
    { key: "ts", label: "TypeScript" },
    { key: "node", label: "Node.js" },
    { key: "next", label: "Next.js" },
    { key: "tw", label: "Tailwind" },
  ];

  const totalPairs = base.length;

  type CardState = {
    id: number;
    item: MemoryItem;
    revealed: boolean;
    matched: boolean;
    el: HTMLButtonElement;
  };

  let selected: CardState[] = [];
  let lock = false;
  let pairsFound = 0;

  const updateStatus = () => {
    statusEl.textContent = `Pares: ${pairsFound}/${totalPairs}`;
  };

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

  const reveal = (card: CardState) => {
    card.revealed = true;
    renderCard(card);
  };

  const hide = (card: CardState) => {
    card.revealed = false;
    renderCard(card);
  };

  const setMatched = (card: CardState) => {
    card.matched = true;
    renderCard(card);
  };

  const onCardClick = async (card: CardState) => {
    if (lock) return;
    if (card.matched || card.revealed) return;

    reveal(card);
    selected = [...selected, card];

    if (selected.length < 2) return;

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
    }, 650);
  };

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

initMemoryGame();

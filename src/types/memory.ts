/**
 * Representa um item no jogo da memória
 */
export type MemoryItem = {
  /** Identificador único do item */
  key: string;
  /** Rótulo exibível do item */
  label: string;
};

/**
 * Representa o estado de uma carta no jogo da memória
 */
export type CardState = {
  /** ID único da carta */
  id: number;
  /** Item associado à carta */
  item: MemoryItem;
  /** Indica se a carta foi revelada */
  revealed: boolean;
  /** Indica se o par foi encontrado */
  matched: boolean;
  /** Referência ao elemento HTMLButtonElement da carta */
  el: HTMLButtonElement;
};

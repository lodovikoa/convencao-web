// Interface genérica para garantir que o objeto possui um ID
export interface HasId {
  id: number | string;
}

/**
 * Função genérica para comparar duas entidades pelo ID.
 * Ideal para uso com o atributo [compareWith] do Angular.
 */
export function compareEntities<T extends HasId>(obj1: T | null, obj2: T | null): boolean {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  return obj1.id === obj2.id;
}

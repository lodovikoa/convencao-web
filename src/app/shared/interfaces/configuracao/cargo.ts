import { ConvencaoResumo } from "./convencao-resumo";

export interface Cargo {
  id: number;
  dsCargo: string;
  dsTitulo: string;
  convencao: ConvencaoResumo;
}

export type CargoRequest = Omit<Cargo, 'id' | 'convencao'> & {
  id?: number;
  convencaoId: number | null;
};

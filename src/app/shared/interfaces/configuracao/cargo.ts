import { ConvencaoResumo } from "./convencao-resumo";

export interface Cargo {
  id: number;
  dsCargo: string;
  dsTitulo: string;
  convencao: ConvencaoResumo;
}

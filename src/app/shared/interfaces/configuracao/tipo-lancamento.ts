import { ConvencaoResumo } from "./convencao-resumo";
import { PlanoContasResumo } from "./plano-contas-resumo";

export interface TipoLancamento {
  id: number;
  dsTipoLancamento: string;
  vlTipoLancamento: string;
  planoContas: PlanoContasResumo;
  convencao: ConvencaoResumo;
}

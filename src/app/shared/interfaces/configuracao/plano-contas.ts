import { ConvencaoResumo } from "./convencao-resumo";

export interface PlanoContas {
   id: number;
    cdConta: number;
    dsConta: string;
    tpConta: string;
    convencao: ConvencaoResumo;

}

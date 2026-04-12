import { ConvencaoResumo } from "./convencao-resumo";

export interface Departamento {
    id: number;
    dsReduzido: string;
    dsDepartamento: string;
    convencao: ConvencaoResumo;
}

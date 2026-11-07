import { Estado } from "./estado";

export interface Cidade {
  id: number;
  cdIbge: string;
  cdTom: string;
  dsNomeTom: string;
  dsNomeIbge: string;
  estado?: Estado;
  links: string[];
}

import { Estado } from './estado';
export interface Convencao {
  id: number;
  dsReduzido: string;
  dsConvencao: string;
  imLogo: string;
  dsEndereco: string;
  dsBairro: string;
  dsCidade: string;
  estado?: Estado;
  dsPais: string;
  dsCep: string;
  dsCnpj: string;
  dsEmail: string;
  dsTelefone1: string;
  dsTelefone2: string;
  dsTelefone3: string;
  dsWatsapp: string;
}

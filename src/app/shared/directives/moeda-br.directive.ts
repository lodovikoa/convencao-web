import { Directive, HostListener, inject, OnInit, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMoedaBr]',
  standalone: true
})
export class MoedaBrDirective implements OnInit { // <-- Implementa OnInit
  private readonly ngControl = inject(NgControl);
  private readonly elementRef = inject(ElementRef); // <-- Injeta a referência do elemento HTML

  ngOnInit(): void {
    // Quando o componente carrega, pega o valor inicial numérico e formata
    const valorInicial = this.ngControl.value;
    if (valorInicial !== null && valorInicial !== undefined) {
      // Transforma o número em string multiplicando por 100 para manter a lógica das casas decimais
      // Ex: 1250.50 vira "125050"
      const valorString = Math.round(valorInicial * 100).toString();
      this.formatar(valorString);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formatar(input.value);
  }

  // Isolamos a lógica de formatação para ser usada tanto no OnInit quanto no Input
  private formatar(valor: string): void {
    const input = this.elementRef.nativeElement as HTMLInputElement;

    // 1. Remove absolutamente tudo que não for dígito numérico
    let apenasDigitos = valor.replace(/\D/g, '');

    // Se o campo for totalmente limpo pelo usuário, reseta o estado
    if (apenasDigitos === '') {
      this.ngControl.control?.setValue(null, { emitEvent: false });
      input.value = '';
      return;
    }

    // 2. Garante o tamanho mínimo de caracteres para os centavos funcionarem
    while (apenasDigitos.length < 3) {
      apenasDigitos = '0' + apenasDigitos;
    }

    // 3. Separa a string entre reais (inteira) e centavos (decimal)
    const parteInteira = apenasDigitos.slice(0, -2);
    const parteDecimal = apenasDigitos.slice(-2);

    // Remove zeros à esquerda desnecessários da parte inteira
    let parteInteiraLimpa = parteInteira.replace(/^0+/, '');
    if (parteInteiraLimpa === '') {
      parteInteiraLimpa = '0';
    }

    // 4. Cria a máscara visual com a vírgula brasileira e pontos de milhar
    const parteInteiraFormatada = parteInteiraLimpa.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const valorFormatado = `R$ ${parteInteiraFormatada},${parteDecimal}`;

    // 5. Joga a atualização visual para o final da fila de renderização
    setTimeout(() => {
      input.value = valorFormatado;
    });

    // 6. Atualiza o valor interno do formulário como um float válido
    const valorNumerico = parseFloat(`${parteInteiraLimpa}.${parteDecimal}`);
    this.ngControl.control?.setValue(valorNumerico, { emitEvent: false });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
}

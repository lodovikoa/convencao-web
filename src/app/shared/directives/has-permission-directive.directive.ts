import { LoginFacadeService } from '@shared/services/auth/login-facade.service';
import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirectiveDirective {
  private readonly loginFacade = inject(LoginFacadeService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input('appHasPermission') permission!: string;

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.loginFacade.hasPermission(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

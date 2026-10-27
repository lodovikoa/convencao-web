import { computed, signal, Service } from '@angular/core';

@Service()
export class SidenavVisibilityService {

  private readonly state = signal(false);

  isCollapsed = computed(() => this.state());

  toggle() {
    this.state.update(state => !state);
  }

}

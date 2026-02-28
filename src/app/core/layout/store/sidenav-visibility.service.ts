import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavVisibilityService {

  private readonly state = signal(false);

  isCollapsed = computed(() => this.state());

  toggle() {
    this.state.update(state => !state);
  }

}

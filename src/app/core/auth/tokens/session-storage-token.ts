import { InjectionToken } from "@angular/core";

export const SessionStorageToken = new InjectionToken<Storage>("SessionStorage", {
  providedIn: "root",
  factory: () => sessionStorage,
})

export interface MenuItems {
  icon: string;
  label: string;
  route: string;
  trancodes?: string[];
  subItems?: MenuItems[];
}

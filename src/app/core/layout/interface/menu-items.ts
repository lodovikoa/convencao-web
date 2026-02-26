export interface MenuItems {
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItems[];
}

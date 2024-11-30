export interface ButtonInterface {
  mode: string;
  icon: string;
  severity: any;
}

export const BUTTONS: ButtonInterface[] = [
  {
    mode: 'student',
    icon: 'pi pi-book',
    severity: 'info',
  },
  {
    mode: 'tutor',
    icon: 'pi pi-graduation-cap',
    severity: 'warning',
  },
];

export interface IButtonConfig {
  value: string;
  type: string;
  disable: boolean;
  onClick?: (event: unknown) => void;
}

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row?: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ActionConfig {
  label: string;
  icon?: string;
  permission?: string;
  onClick: (item: any, onAction: (action: string, item: any) => void) => void;
  className?: string;
}

export interface TableConfig {
  columns: ColumnConfig[];
  actions?: ActionConfig[];
  keyField?: string;
}

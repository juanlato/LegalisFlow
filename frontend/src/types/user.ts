export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  role: Role;
  tenant: {
    id: string;
    name: string;
  };
}

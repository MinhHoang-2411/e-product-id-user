export interface Product {
  name: string;
  price?: number | null;
  description: string;
  images: any[];
  payload?: any;
  category_id: number;
  id: number;
  approval_status: string;
  organization_id?: number;
  view_count?: number;
  category: {
    name: string;
    parent_id: number;
    id: number;
  };
  consignment_count: number;
}

export interface Category {
  name: string;
  parent_id: number | null;
  id: number;
}

import ICategory from "../categories/ICategories";
import IUser from "../users/IUser";


export interface IProduct {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    imageGallery: string[];
    sku: string;
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    price: number;
    stock: number;
    categoryId: string;
    material?: string[];
    isPaused: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }

export interface IProductCharacteristic {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  material?: string[];
  category: string
}
  
export interface IProductWithUserAndCategory extends IProduct {
    user: IUser; 
    categories: ICategory;
}

export type OrderProductId = 1 | 2 | 3;
export type OrderProductType = 'mesada' | 'mueble' | 'vanitory';
export type VanitySupport = 'flotante' | 'patas' | '';

export interface ProductOption {
    id: OrderProductId;
    text: string;
    description: string;
    img: string;
}

export interface ProductMeasurements {
    largo: string;
    profundidad: string;
    alto: string;
    espesor: string;
    medidasBloqueadas: boolean;
    conZocalo: boolean;
    sinMueble: boolean;
    apoyo: VanitySupport;
}

export interface OrderComponent {
    id: OrderProductId;
    name: string;
    measurements: ProductMeasurements;
}

export interface MaterialOption {
    id: number;
    color: string;
    path: string;
    category: 'granitos' | 'silestones' | 'marmoles' | 'melaminas';
}

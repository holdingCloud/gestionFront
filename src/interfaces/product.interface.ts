export interface ProductResponse {
    data: Products[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Products {
    id: number,
    name: string,
    description: string,
    quantity: number,
    img: string,
    code: string,
}

export interface ProductBody {
    name: string,
    description: string,
    quantity: number,
    img: string,
    code: string,

}

export interface CreateProductResponse {
    message: string;
    statusCode: string;
    payload: Payload;
}

export interface Payload {
    id: number;
    name: string;
    description: string;
    quantity: number;
    img: string;
    code: string;
}

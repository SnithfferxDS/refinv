import { Quotations } from "astro:db";

export type Quotations = Quotation[];
export type Quotation_Details = Quotation_Detail[];
export type FastQuotations = FastQuotation[];
export interface Quotation {
    id: number;
    number: string;
    quotation_date: Date;
    process_date: Date;
    paid_date: Date;
    total: number;
    taxes: number;
    discount: number;
    quotation_details: number;
    seller_id: number;
    buyer_id: number;
    processed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Quotation_Detail {
    id: number;
    quotation_id: number;
    product_id: number;
    quantity: number;
    price: number;
    shipping: number;
    taxes: number;
    discount: number;
    store_id: number;
    country_id: number;
    store_link: number;
    quot_type: number;
    processed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface FastQuotation {
    product: number | string;
    number: string;
    price: number;
    quantity: number;
    buyer_id?: number;
    quoter_id?: number;
    client_id?: number;
    quotation_date?: Date;
    category_id?: number;

    weight?: number;
    link?: string;
    weight_unit?: string;
    shipping?: number;
    store_id?: number;
    country_id?: number;
    images?: string[];
    height?: number;
    width?: number;
    length?: number;
    measure_unit?: string;
    importType?: number;
    warranty_time?: number;
    delivery?: Date;
}

export interface NormalQuotation {
    product: number | string;
    number: string;
    price: number;
    quantity: number;
    buyer_id?: number;
    quoter_id?: number;
    client_id?: number;
    quotation_date?: Date;
    category_id?: number;

    link?: string;
    weight?: number;
    weight_unit?: string;
    shipping?: number;
    store_id?: number;
    country_id?: number;
    images?: string[];
    height?: number;
    width?: number;
    length?: number;
    measure_unit?: string;
    importType?: number;
    sku?: string;
    mpn?: string;
    upc?: string;
    ean?: string;
    currier?: string;
    warranty_time?: number;
    delivery?: Date;
}
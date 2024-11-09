import { Quotations } from "astro:db";

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

export type Quotations = Quotation[];

export type Quotation_Details = Quotation_Detail[];
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
import {
    Products,
    Quotations,
    Quotations_Details,
    Images,
    Product_Relations,
    db, like, eq
} from "astro:db";
import { generateIdentifier, calcWeight, calcImportFees } from "../../../utils/functions";
import type { FastQuotation } from "../../../types/Quotation";

export async function saveData(data: any) {
    const quotation = await db.insert(Quotations).values({
        number: data.number,
        quotation_date: data.quotation_date,
        process_date: data.process_date,
        paid_date: data.paid_date,
        total: data.total,
        taxes: data.taxes,
        discount: data.discount,
        quotation_details: data.quotation_details,
        seller_id: data.seller_id,
        buyer_id: data.buyer_id,
        processed: data.processed,
    });
    if (quotation !== undefined) {
        const quotationDetails = await db.insert(Quotations_Details).values({
            quotation_id: quotation.id,
            product_id: data.product_id,
            quantity: data.quantity,
            price: data.price,
            taxes: data.taxes,
            discount: data.discount,
            processed: data.processed,
        });
        const product = await db.select().from(Products).where(eq(Products.id, data.product_id));
        const image = await db.select().from(Images).where(eq(Images.id, data.image_id));
        if (image !== undefined && product !== undefined) {
            const productRelation = await db.insert(Product_Relations).values({
                product_id: product.id,
                image_id: image.id,
                category_id: data.category_id,
            });
        }
        return quotation;
    }
}

export async function search(name: string) {
    const product = await db.select({ name: Products.name })
        .from(Products)
        .where(name ? like(Products.name, `%${name}%`) : undefined);
    return product;
}

export async function saveFastData(data: FastQuotation) {
    const product = await productExists(data.product, {
        handle: typeof (data.product) === "string" ? data.product : '',
        description: data.link ?? '',
        short_desc: typeof (data.product) === "string" ? data.product : '',
        tags: '',
        width: data.width ?? 0,
        height: data.height ?? 0,
        length: data.length ?? 0,
        measure_unit: data.measure_unit ?? 'mm',
        weight: data.weight ?? 0,
        weight_unit: data.weight_unit ?? 'g'
    });
    if (product !== undefined) {
        let quotationPrice = data.price;
        let quotationQuantity = data.quantity;
        let quotationTotal = quotationPrice * quotationQuantity;
        let store = 0,
            country = 0,
            shipping = 0;
        if (data.importType === 2) {
            if (data.store_id !== undefined) store = data.store_id;
            if (data.country_id !== undefined) country = data.country_id;
            if (data.shipping !== undefined) shipping = data.shipping;
        }
        const quotationFees = await calcImportFees(data);
        if (quotationFees.message === "ok") {
            const quotation = await db.insert(Quotations).values({
                number: data.number ?? generateIdentifier('quotation'),
                quotation_date: data.quotation_date ?? new Date(),
                total: Math.round(quotationTotal),
            });
            if (quotation !== undefined) {
                const quotDetails = await db.insert(Quotations_Details).values({
                    quotation_id: quotation.id,
                    product_id: product.id,
                    quantity: quotationQuantity,
                    price_exportation: quotationFees.prices?.exportation ?? 0,
                    price_gob: quotationFees.prices?.gob ?? 0,
                    price_pyme: quotationFees.prices?.pyme ?? 0,
                    price_retail: quotationFees.prices?.retail ?? 0,
                    price_wholesale: quotationFees.prices?.wholesale ?? 0,
                    price_wholesale_vip: quotationFees.prices?.wholesale_vip ?? 0,
                    store_price: Math.round(quotationPrice ?? 0),
                    shipping: Math.round(shipping ?? 0),
                    taxes: quotationFees.importFees?.freightTaxes ?? 0,
                    store_id: store,
                    country_id: country,
                    store_link: data.link ?? "",
                    weight: data.weight ?? 0,
                    weight_unit: data.weight_unit ?? "g",
                    width: data.width ?? 0,
                    height: data.height ?? 0,
                    length: data.length ?? 0,
                    measure_unit: data.measure_unit ?? "mm",
                    quot_type: 2,
                    delivery_time: quotationFees.delivery_time?.days ?? 0,
                    warranty_time: data.warranty_time ?? 0,
                });
                if (quotDetails !== undefined) {
                    const quotationDetails = await db.update(Quotations).values({
                        quotation_details: quotDetails.id,
                        taxes: quotationFees.importFees?.freightTaxes ?? 0,
                    }).where(eq(Quotations.id, quotation.id));
                    if (quotationDetails !== undefined) {
                        return quotation;
                    }
                }
            }
        }
    }
}

export async function productExists(term: number | string, data: {
    handle: string;
    description: string;
    short_desc: string;
    tags: string;
    width: number;
    height: number;
    length: number;
    measure_unit: string;
    weight: number;
    weight_unit: string;
}) {
    if (typeof (term) === "number") {
        const product = await db.select().from(Products).where(eq(Products.id, term));
        return product;
    } else {
        const product = await db.insert(Products).values({
            name: term,
            handle: data.handle,
            description: data.description,
            short_description: data.short_desc,
            tags: data.tags,
            sku: generateIdentifier("sku"),
            mpn: generateIdentifier("mpn"),
            upc: generateIdentifier("upc"),
            ean: generateIdentifier("ean"),
            weight: data.weight ?? calcWeight(data.width ?? 1, data.height ?? 1, data.length ?? 1, data.measure_unit ?? "mm"),
            width: data.width,
            height: data.height,
            length: data.length
        });
        return product;
    }
}
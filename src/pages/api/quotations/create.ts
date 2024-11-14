import {
    Products,
    Quotations,
    Quotation_Details,
    Images,
    Product_Relations,
    db, like, eq
} from "astro:db";
import { generateIdentifier, calcWeight, calcImportFees } from "../../../utils/functions";
import type { FastQuotation, Quotation } from "../../../types/Quotation";
import { weight } from "../../../utils/converter";

export async function saveData(data: FastQuotation) {
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
            shipping = 0,
            storeLink = '';
        if (data.importType === 2) {
            if (data.store_id !== undefined) store = data.store_id;
            if (data.country_id !== undefined) country = data.country_id;
            if (data.shipping !== undefined) shipping = data.shipping;
            if (data.link !== undefined) storeLink = data.link;
        }
        const quotationFees = await calcImportFees(data);
        if (quotationFees.message === "ok") {
            const quotation = await db.insert(Quotations).values({
                number: data.number ?? generateIdentifier('quotation'),
                quotation_date: data.quotation_date ?? new Date()
            }).returning();
            if (quotation !== undefined) {
                let quotWeight = weight(data.measure_unit ?? 'g', data.weight ?? 0);
                const quotationFees = await calcImportFees(data);
                const quotDetails = await db.insert(Quotation_Details).values({
                    quotation_id: quotation[0].id,
                    product_id: product[0].id,
                    quantity: quotationQuantity,
                    store_id: store,
                    country_id: country,
                    price_exportation: quotationFees.prices?.exportation,
                    price_gob: quotationFees.prices?.gob,
                    price_pyme: quotationFees.prices?.pyme,
                    price_retail: quotationFees.prices?.retail,
                    price_wholesale: quotationFees.prices?.wholesale,
                    price_wholesale_vip: quotationFees.prices?.wholesale_vip,
                    store_price: quotationPrice,
                    shipping: shipping,
                    taxes: quotationFees.importFees?.freightTaxes,
                    store_link: storeLink,
                    weight: quotWeight.g,
                    width: data.width,
                    height: data.height,
                    length: data.length,
                    measure_unit: data.measure_unit,
                    quot_type: data.importType,
                    delivery_time: quotationFees.delivery_time?.days,
                    warranty_time: quotationFees.warranty
                }).returning();
                if (quotDetails !== undefined) {
                    const quotationDetails = await db.
                        update(Quotations).
                        set({ total: quotationTotal, taxes: quotationFees.importFees?.freightTaxes })
                        .where(eq(Quotations.id, quotation[0].id));
                    if (quotationDetails !== undefined) {
                        return quotation;
                    }
                }
            }
        }
    }
    return undefined;
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
            shipping = 0,
            storeLink = '';
        if (data.importType === 2) {
            if (data.store_id !== undefined) store = data.store_id;
            if (data.country_id !== undefined) country = data.country_id;
            if (data.shipping !== undefined) shipping = data.shipping;
            if (data.link !== undefined) storeLink = data.link;
        }
        const quotationFees = await calcImportFees(data);
        if (quotationFees.message === "ok") {
            const quotation = await db.insert(Quotations).values({
                number: data.number ?? generateIdentifier('quotation'),
                quotation_date: data.quotation_date ?? new Date()
            }).returning();
            if (quotation !== undefined) {
                let quotWeight = weight(data.measure_unit ?? 'g', data.weight ?? 0);
                const quotDetails = await db.insert(Quotation_Details).values({
                    quotation_id: quotation[0].id,
                    product_id: product[0].id,
                    quantity: quotationQuantity,
                    store_id: store,
                    country_id: country,
                    price_exportation: quotationFees.prices?.exportation,
                    price_gob: quotationFees.prices?.gob,
                    price_pyme: quotationFees.prices?.pyme,
                    price_retail: quotationFees.prices?.retail,
                    price_wholesale: quotationFees.prices?.wholesale,
                    price_wholesale_vip: quotationFees.prices?.wholesale_vip,
                    store_price: quotationPrice,
                    shipping: shipping,
                    taxes: quotationFees.importFees?.freightTaxes,
                    store_link: storeLink,
                    weight: quotWeight.g,
                    width: data.width,
                    height: data.height,
                    length: data.length,
                    measure_unit: data.measure_unit,
                    quot_type: data.importType,
                    delivery_time: quotationFees.delivery_time?.days,
                    warranty_time: quotationFees.warranty
                }).returning();
                if (quotDetails !== undefined) {
                    const quotationDetails = await db.
                        update(Quotations).
                        set({ total: quotationTotal, taxes: quotationFees.importFees?.freightTaxes })
                        .where(eq(Quotations.id, quotation[0].id));
                    if (quotationDetails !== undefined) {
                        return quotation;
                    }
                }
            }
        }
    }
    return undefined;
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
        const sku = await generateIdentifier("sku");
        const mpn = await generateIdentifier("mpn");
        const ean = await generateIdentifier("ean");
        const upc = await generateIdentifier("upc");
        const product = await db.insert(Products).values([{
            name: term,
            handle: data.handle,
            tags: data.tags ?? "",
            description: data.description,
            short_description: data.short_desc,
            upc: (upc !== undefined) ? upc : '',
            sku: (sku !== undefined) ? sku : '',
            mpn: (mpn !== undefined) ? mpn : '',
            ean: (ean !== undefined) ? ean : '',
            weight: data.weight,
            weight_unit: data.weight_unit,
            width: data.width ?? 1,
            height: data.height ?? 1,
            length: data.length ?? 1,
            measure_unit: data.measure_unit ?? "mm",
        },]).returning();
        return product;
    }
}
import {
    Products,
    Quotations,
    Quotations_Details,
    Images,
    Product_Relations,
    db, like, eq
} from "astro:db";
import { generateIdentifier, calcWeight } from "../../../utils/functions";

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

export async function saveFastData(data: any) {
    if (data.product_id) {
        const product = await db.select().from(Products).where(eq(Products.id, data.product_id));
        if (product !== undefined && data.product_id !== undefined) {
            const product = await db.insert(Products).values({
                name: data.product,
                handle: data.product,
                description: data.link,
                short_description: data.product,
                tags: data.product,
                sku: generateIdentifier("sku"),
                mpn: generateIdentifier("mpn"),
                upc: generateIdentifier("upc"),
                ean: generateIdentifier("ean"),
                weight: data.weight ?? calcWeight(data.width, data.height, data.length, data.measure_unit),
                width: data.width,
                height: data.height,
                length: data.length
            });
            if (product !== undefined) {
                let quotationPrice = parseFloat(data.price);
                let quotationShipping = parseFloat(data.shipping);
                let quotationQuantity = parseInt(data.quantity);
                let quotationTotal = quotationPrice * quotationQuantity;
                let quotDiscount = parseFloat(data.discount);
                const quotation = await db.insert(Quotations).values({
                    number: generateIdentifier('quotation'),
                    quotation_date: data.date,
                    total: quotationTotal.toFixed(2),
                    taxes: (quotationTotal * 0.13).toFixed(2),
                });
                if (quotation !== undefined) {
                    const quotDetails = await db.insert(Quotations_Details).values({
                        quotation_id: quotation.id,
                        product_id: product.id,
                        quantity: quotationQuantity,
                        price: quotationPrice.toFixed(2),
                        shipping: quotationShipping.toFixed(2),
                        taxes: (quotationTotal * 0.13).toFixed(2),
                        discount: quotDiscount,
                        store_id: data.store,
                        country_id: data.country,
                        store_link: data.link,
                        quot_type: data.type
                    });
                }
            }
        }
    }
}
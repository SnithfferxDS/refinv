import {
    Products,
    Quotations,
    Quotations_Details,
    Images,
    Product_Relations,
    db, like
} from "astro:db";


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
    const quotationDetails = await db.insert(Quotations_Details).values({
        quotation_id: quotation.id,
        product_id: data.product_id,
        quantity: data.quantity,
        price: data.price,
        taxes: data.taxes,
        discount: data.discount,
        processed: data.processed,
    });
    const product = await db.select().from(Products).where(Products.id, data.product_id);
    const image = await db.select().from(Images).where(Images.id, data.image_id);
    const productRelation = await db.insert(Product_Relations).values({
        product_id: product.id,
        image_id: image.id,
        category_id: data.category_id,
    });
    return quotation;
}

export async function search(name: string) {
    const product = await db.select({ name: Products.name })
        .from(Products)
        .where(name ? like(Products.name, `%${name}%`) : undefined);
    return product;
}

export async function saveFastData(data: any) {
    /* {
        product, 
        type,
        link,
        store,
        country,
        date,
        price,
        shipping,
        weight,
        quantity,
        } */
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
}
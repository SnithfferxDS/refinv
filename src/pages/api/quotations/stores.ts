import { db, eq, Stores } from "astro:db";
// extraer tiendas segun el tipo de cotización
export async function getStores(type: number) {
    const stores = await db
        .select({
            id: Stores.id,
            name: Stores.name,
        })
        .from(Stores)
        .where(eq(Stores.store_type, type))
        .get();
    return stores;
}
import { defineDb, defineTable, column } from 'astro:db';

const Products = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    title: column.text(),
    short_description: column.text(),
    tags: column.json(),
    sku: column.text(),
    mpn: column.text(),
    upc: column.text(),
    ean: column.text(),
    isbn: column.text(),
    measure_unit: column.text(),
    weight: column.number(),
    width: column.number(),
    height: column.number(),
    length: column.number(),
    outer_diameter: column.number(),
    inner_diameter: column.number(),
    brand: column.number({reference: () => Brands.column.id}),
    customizable: column.boolean(),
    customizable_fields: column.text(),
    status: column.number(),
    created_at: column.date(),
    updated_at: column.date(),
    deleted_at: column.date(),
  }
});

const Categories = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text(),
    description: column.text(),
    status: column.number(),
    parent_id: column.number({reference: () => Categories.column.id}),
    logo: column.text(),
    main: column.boolean(),
    updated_at: column.date(),
    deleted_at: column.date()
  }
});

const Suppliers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text(),
    address:column.text(),
    phone:column.text(),
    email:column.text(),
    website:column.text(),
    contact:column.text(),
    country:column.text(),
    state:column.text(),
    city:column.text(),
    street:column.text(),
    optional:column.text(),
    logo:column.text(),
    updated_at: column.date(),
    deleted_at: column.date()
  }
});

const Status = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    description:column.text(),
    active: column.boolean(),
    updated_at: column.date(),
    deleted_at: column.date()
  }
});

const Brands = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text(),
    description:column.text(),
    logo:column.text(),
    active: column.boolean(),
    updated_at: column.date(),
    deleted_at: column.date()
  }
});

const Purchases = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    number: column.text(),
    purchase_date: column.date(),
    ingress_date: column.date(),
    procesed_date: column.date(),
    total: column.number(),
    taxes: column.number(),
    discount: column.number(),
    purchase_details: column.number(),
    supplier_id: column.number(),
    buyer_id: column.number(),
    procesed: column.boolean(),
    updated_at: column.date(),
    deleted_at: column.date()
  }
});

const Purchase_details = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
invoice_number: column.text(),
    product_id: column.number(),
    price: column.number(),
    taxes: column.number(),
    discount: column.number(),
    quantity: column.number(),
    procesed: column.boolean(),
    updated_at: column.date(),
  deleted_at: column.date(),
    }
});

hash TEXT,
    sale_date DATETIME,
    process_date DATETIME,
    paid_date DATETIME,
    total DECIMAL(10,2),
    taxes DECIMAL(10,2),
    discount DECIMAL(10,2),
    sale_details INTEGER,
    seller_id INTEGER,
    buyer_id INTEGER,
    procesed BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME


// https://astro.build/db/config
export default defineDb({
  tables: {Products, Categories, Suppliers, Status},
});

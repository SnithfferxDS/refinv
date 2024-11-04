import { defineDb, defineTable, column, NOW } from 'astro:db';

const Products = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    description: column.text({ optional: true }),
    title: column.text({ optional: true }),
    short_description: column.text({ optional: true }),
    tags: column.json(),
    sku: column.text({ optional: true }),
    mpn: column.text({ optional: true }),
    upc: column.text({ unique:true }),
    ean: column.text({ optional: true }),
    isbn: column.text({ optional: true }),
    weight: column.number({ default: 0.0 }),
    width: column.number({ default: 0.0 }),
    height: column.number({ default: 0.0 }),
    length: column.number({ default: 0.0 }),
    inner_diameter: column.number({ default: 0.0 }),
    outer_diameter: column.number({ default: 0.0 }),
    measure_unit: column.text({ default: 'mm' }),
    brand_id: column.number({ references: () => Brands.columns.id }),
    customizable: column.boolean({ optional: true }),
    customizable_fields: column.text({ optional: true }),
    status: column.number({ references: () => Statuses.columns.id, default: 1 }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Categories = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text({unique: true}),
    description: column.text({ optional: true }),
    status: column.boolean(),
    relations: column.number({ references: () => Category_Relations.columns.id, default: 1 }),
    logo: column.text({ optional: true }),
    main: column.boolean({ default: false }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Images = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    image_url: column.text({ optional: true }),
    image_thumbnail: column.text({ optional: true }),
    possition: column.number(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Aestetics = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text({unique: true}),
    description:column.text(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Product_Relations = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    product_id: column.number({ references: () => Products.columns.id }),
    image_id: column.number({ references: () => Images.columns.id }),
    category_id: column.number({ references: () => Categories.columns.id }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Category_Relations = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    parent_id: column.number({ references: () => Categories.columns.id }),
    child_id: column.number({ references: () => Categories.columns.id }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Aestetic_Relations = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    aestetics_grade: column.number({ references: () => Aestetics.columns.id }),
    product_id: column.number({ references: () => Products.columns.id }),
    quantity: column.number(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Suppliers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text({unique: true}),
    address:column.text({ optional: true }),
    phone:column.text({ optional: true }),
    email:column.text({ optional: true }),
    website:column.text({ optional: true }),
    contact:column.text({ optional: true }),
    country:column.text({ optional: true }),
    state:column.text({ optional: true }),
    city:column.text({ optional: true }),
    street:column.text({ optional: true }),
    optional:column.text({ optional: true }),
    logo:column.text({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Statuses = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    description:column.text({ optional: true }),
    active: column.boolean({ default: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Brands = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text({ unique: true }),
    description:column.text({ optional: true }),
    logo:column.text({ optional: true }),
    active: column.boolean({ default: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true }),
  }
});

const Purchases = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    number: column.text({ unique: true }),
    purchase_date: column.date(),
    ingress_date: column.date(),
    procesed_date: column.date(),
    total: column.number({ default: 0.0 }),
    taxes: column.number({ default: 0.0 }),
    discount: column.number({ default: 0.0 }),
    purchase_details: column.number(),
    supplier_id: column.number(),
    buyer_id: column.number(),
    procesed: column.boolean({default: false}),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true })
  }
});

const Purchase_Details = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    invoice_number: column.text(),
    product_id: column.number(),
    price: column.number({ default: 0.0 }),
    taxes: column.number({ default: 0.0 }),
    discount: column.number({ default: 0.0 }),
    quantity: column.number({ default: 1 }),
    procesed: column.boolean({default: false}),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true })
    }
});

const Sales = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    hash: column.text(),
    sale_date: column.date(),
    process_date: column.date(),
    paid_date: column.date(),
    total: column.number({ default: 0.0 }),
    taxes: column.number({ default: 0.0 }),
    discount: column.number({ default: 0.0 }),
    sale_details: column.number(),
    seller_id: column.number(),
    buyer_id: column.number(),
    procesed: column.boolean({ default: false }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true })
  }
});

const Sales_Details = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    sale_id: column.number({ references: () => Sales.columns.id }),
    product_id: column.number({ references: () => Products.columns.id }),
    quantity: column.number({ default: 1 }),
    price: column.number({ default: 0.0 }),
    taxes: column.number({ default: 0.0 }),
    discount: column.number({ default: 0.0 }),
    procesed: column.boolean({ default: false }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true })
  }
});

const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    email: column.text({ unique: true }),
    password: column.text(),
    active: column.boolean({ default: true }),
    level: column.number({ default: 0 }),
    avatar: column.text({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true }),
    deleted_at: column.date({ optional: true })
  }
});

const Sellers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    email: column.text({ unique: true }),
    phone: column.text({ optional: true }),
    code: column.text({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Prices = defineTable({
  columns: {
    id:column.number({primaryKey:true}),
    product_id: column.number(),
    last: column.number(),
    cost: column.number(),
    tax:  column.number(),
    profit: column.number(),
    extra_profit: column.number(),
    price: column.number(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Stocks = defineTable({
  columns: {
    id: column.number({primaryKey:true}),
    product_id: column({references: () => Products.columns.id}),
    quantity:column.number(),
    warehouse_id:column.number(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
});

const Warehouses = defineTable ({
  columns: {
    id: column.number({primaryKey:true}),
    name: column.text(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ optional: true })
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    Products, 
    Categories, 
    Category_Relations, 
    Product_Relations,
    Aestetic_Relations,
    Suppliers,
    Statuses,
    Brands,
    Purchases,
    Purchase_Details,
    Sales,
    Sales_Details,
    Users,
    Sellers,
    Images,
    Prices,
    Stocks,
    Warehouses
  },
});
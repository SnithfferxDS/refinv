import { defineDb, defineTable, column, NOW } from 'astro:db';

const Products = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text(),
        handle: column.text({ optional: true }),
        description: column.text({ optional: true }),
        short_description: column.text({ optional: true }),
        tags: column.json({ optional: true }),
        sku: column.text({ optional: true }),
        mpn: column.text({ optional: true }),
        upc: column.text({ unique: true }),
        ean: column.text({ optional: true }),
        isbn: column.text({ optional: true }),
        weight: column.number({ optional: true, default: 0.0 }),
        weight_unit: column.text({ optional: true, default: 'g' }),
        width: column.number({ optional: true, default: 0.0 }),
        height: column.number({ optional: true, default: 0.0 }),
        length: column.number({ optional: true, default: 0.0 }),
        inner_diameter: column.number({ optional: true, default: 0.0 }),
        outer_diameter: column.number({ optional: true, default: 0.0 }),
        measure_unit: column.text({ optional: true, default: 'mm' }),
        customizable: column.boolean({ optional: true }),
        customizable_fields: column.text({ optional: true }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true }),
        deleted_at: column.date({ optional: true })
    }
});


const Categories = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text({ unique: true }),
        description: column.text({ optional: true }),
        status: column.boolean(),
        parent_id: column.number({ optional: true }),
        children: column.boolean({ default: false }),
        logo: column.text({ optional: true }),
        main: column.boolean({ default: false }),
        dai: column.number({ default: 0.0 }),
        permission: column.boolean({ default: false }),
        licence: column.number({ default: 0.00 }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true }),
        deleted_at: column.date({ optional: true })
    }
});

const Images = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text({ unique: true }),
        image_url: column.text({ optional: true }),
        image_thumbnail: column.text({ optional: true }),
        possition: column.number({ default: 1 }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true }),
        deleted_at: column.date({ optional: true })
    }
});

const Product_Relations = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        product_id: column.number(),
        image_id: column.number(),
        category_id: column.number(),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true })
    }
});

const Quotations = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        number: column.text({ unique: true }),
        quotation_date: column.date(),
        process_date: column.date({ optional: true }),
        paid_date: column.date({ optional: true }),
        total: column.number({ default: 0.0 }),
        taxes: column.number({ default: 0.0 }),
        discount: column.number({ default: 0.0 }),
        seller_id: column.number({ optional: true }),
        buyer_id: column.number({ optional: true }),
        processed: column.boolean({ default: false }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true })
    }
});

const Quotation_Details = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        quotation_id: column.number(),
        product_id: column.number(),
        quantity: column.number({ default: 1 }),
        price_exportation: column.number({ default: 0.0 }),
        price_gob: column.number({ default: 0.0 }),
        price_pyme: column.number({ default: 0.0 }),
        price_retail: column.number({ default: 0.0 }),
        price_wholesale: column.number({ default: 0.0 }),
        price_wholesale_vip: column.number({ default: 0.0 }),
        store_price: column.number({ default: 0.0 }),
        shipping: column.number({ default: 0.0 }),
        taxes: column.number({ default: 0.0 }),
        discount: column.number({ default: 0.0 }),
        weight: column.number({ optional: true, default: 0.0 }),
        weight_unit: column.text({ optional: true, default: 'kg' }),
        width: column.number({ optional: true, default: 0.0 }),
        height: column.number({ optional: true, default: 0.0 }),
        length: column.number({ optional: true, default: 0.0 }),
        measure_unit: column.text({ optional: true, default: 'cm' }),
        store_id: column.number(),
        country_id: column.number(),
        store_link: column.text({ optional: true }),
        quot_type: column.number({ default: 1 }),
        processed: column.boolean({ default: false }),
        quot_status: column.number({ default: 1 }),
        clientInformation: column.number({ default: 1 }),
        seller_id: column.number({ optional: true }),
        buyer_id: column.number({ optional: true }),
        currier: column.number({ default: 1 }),
        delivery_time: column.number({ default: 1 }),
        warranty_time: column.number({ default: 1 }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true })
    }
});

const Stores = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text({ unique: true }),
        logo: column.text({ optional: true }),
        address: column.text({ optional: true }),
        website: column.text({ optional: true }),
        phone: column.text({ optional: true }),
        email: column.text({ optional: true }),
        contact_name: column.text({ optional: true }),
        contact_phone: column.text({ optional: true }),
        contact_email: column.text({ optional: true }),
        taxes: column.number({ default: 0.0 }),
        shipping: column.boolean({ default: true }),
        store_type: column.number({ default: 1 }),
        active: column.boolean({ default: true }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true })
    }
});

const Countries = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text({ unique: true }),
        tax: column.number({ default: 0.00 }),
        tlc: column.number({ default: 0.00 }),
        impex: column.number({ default: 0.00 }),
        created_at: column.date({ default: NOW }),
        updated_at: column.date({ optional: true })
    }
});

/*
const Aestetics = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name:column.text({unique: true}),
    description:column.text(),
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
emailVerified: column.boolean({ default: false }),
verificationToken: column.text({ optional: true }),
resetToken: column.text({ optional: true }),
resetTokenExpiry: column.date({ optional: true }),
createdAt: column.date({ default: NOW }),
updatedAt: column.date({ optional: true }),
deleted_at: column.date({ optional: true }),
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
product_id: column.number({references: () => Products.columns.id}),
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
})*/

// https://astro.build/db/config
export default defineDb({
    tables: {
        Products,
        Categories,
        Product_Relations,
        Quotations,
        Quotation_Details,
        Images,
        Stores,
        Countries,
        // Suppliers,
        // Statuses,
        // Brands,
        // Purchases,
        // Purchase_Details,
        // Sales,
        // Sales_Details,
        // Users,
        // Sellers,
    },
});
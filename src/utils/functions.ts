import {
    db,
    eq,
    Products,
    Quotations,
    Stores,
    Countries,
    Categories
} from "astro:db";
import type { NormalQuotation, FastQuotation, Quotation, Quotation_Detail, Quotation_Details } from "../types/Quotation";

export async function generateIdentifier(typo: string) {
    let date = new Date(),
        hoy = date.toLocaleString("es-SV"),
        dia = date.getDate().toString(),
        mes = date.getMonth() + 1,
        anio = date.getFullYear(),
        random = Math.floor(Math.random() * 1000),
        additional = Math.floor(Math.random() * 10),
        hora = date.getHours().toString(),
        minutos = date.getMinutes().toString(),
        segundos = date.getSeconds().toString(),
        identifier = "";
    if (typo === "quotation") {
        identifier = "Qt-" + anio + mes + dia + "-" + hora + minutos + segundos + "-" + random.toString() + additional.toString();
        const quotation = await db.select().from(Quotations).where(eq(Quotations.number, identifier));
        if (quotation.length > 0) {
            return generateIdentifier(typo);
        }
    } else if (typo === "invoice") {
        identifier = "Inv-" + anio + mes + dia + hora + minutos + segundos + "-" + random.toString() + additional.toString();
        const quotation = await db.select().from(Quotations).where(eq(Quotations.number, identifier));
        if (quotation.length > 0) {
            return generateIdentifier(typo);
        }
    } else if (typo === "upc") {
        identifier = anio + mes + dia + hora + minutos + segundos + random.toString() + additional.toString();
        const product = await db.select().from(Products).where(eq(Products.upc, identifier));
        if (product.length > 0) {
            return generateIdentifier(typo);
        }
    } else if (typo === "sku") {
        identifier = "DS-" + anio + mes + dia + random.toString() + "-" + additional.toString();
        const product = await db.select().from(Products).where(eq(Products.sku, identifier));
        if (product.length > 0) {
            return generateIdentifier(typo);
        }
    } else if (typo === "mpn") {
        identifier = "DS-" + anio + mes + dia + "-" + hora + minutos + random.toString() + additional.toString();
        const product = await db.select().from(Products).where(eq(Products.mpn, identifier));
        if (product.length > 0) {
            return generateIdentifier(typo);
        }
    } else if (typo === "ean") {
        identifier = "0" + anio + mes + dia + random.toString() + additional.toString();
        const product = await db.select().from(Products).where(eq(Products.ean, identifier));
        if (product.length > 0) {
            return generateIdentifier(typo);
        }
    }
    return identifier;
}
export function calcWeight(width: number, height: number, length: number, measure: string) {
    let weight = 0;
    if (width && height && length) {
        weight = width * height * length;
    }
    switch (measure) {
        case 'cm':
            weight = weight * 10;
            break;
        case 'in':
            weight = weight * 25.4;
            break;
        case 'ft':
            weight = weight * 304.8;
            break;
        case 'm':
            weight = weight * 1000;
            break;
        case 'yd':
            weight = weight * 914.4;
            break;
        default:
            weight = weight * 2.205;
            break;
    }
    return weight / 1000;
}

async function recordExists(typo: string, id: string) {
    if (typo === "quotation") {
        const quotation = await db.select().from(Quotations).where(eq(Quotations.number, id));
        return quotation; // !== undefined ? quotation : undefined;
    } else if (typo === "invoice") {
        //const invoice = await db.select().from(db.table("Invoices")).where(eq(db.table("Invoices").number, id));
        return undefined; //invoice !== undefined;
    } else if (typo === "upc") {
        const product = await db.select().from(Products).where(eq(Products.upc, id));
        return product !== undefined;
    } else if (typo === "sku") {
        const product = await db.select().from(Products).where(eq(Products.sku, id));
        return product !== undefined;
    } else if (typo === "mpn") {
        const product = await db.select().from(Products).where(eq(Products.mpn, id));
        return product !== undefined;
    } else if (typo === "ean") {
        const product = await db.select().from(Products).where(eq(Products.ean, id));
        return product !== undefined;
    }
}

export function local(peso: number) {
    let fuel = 0;
    let storage = 0;
    let flete = 0;
    let documentacion = 0;
    let handle = 0;
    let fee = { tramite: 0.0, flete: 0.0, adicional: 0.0, error: 0 };
    if (peso > 0) {
        fuel = peso * 0.015;
        storage = peso * 0.001;
        if (peso <= 35) {
            flete = (peso <= 10) ? 0.085 : peso * 0.065;
        } else {
            flete = peso * 0.05;
        }
        documentacion = 0.25;
        handle = ((fuel + storage) / peso) * peso;
        fee.tramite = handle + documentacion;
        fee.adicional = 0.005;
        fee.flete = flete;
    } else {
        fee.error = 1;
    }
    return fee;
}

export function cargo(peso: number) {
    let docs = 1.6,
        pVolume = 0.61,
        a = 0.85,
        b = 2.4,
        fee = {
            tramite: 0.0, flete: 0.0, adicional: 0.0, error: 0
        };
    if (peso > 0) {
        if (peso < 27.99) {
            fee.tramite = (pVolume * peso) + docs;
            fee.adicional = (a * peso) + b;
            fee.flete = peso * 3.25;
        } else if (peso > 27.999 && peso < 97.99) {
            fee.tramite = (pVolume * peso) + (docs * (peso / 10));
            fee.adicional = (a * peso) + b;
            fee.flete = peso * (100 / 2.05);
        } else if (peso > 97.999) {
            fee.tramite = (pVolume * peso) + (docs * (peso / 10));
            fee.adicional = (a * peso) + b;
            fee.flete = peso * (100 / 1.05);
        } else {
            fee.error = 2;
        }
    } else {
        fee.error = 1;
    }
    return fee;
}

export function aero(weight: number, price: number) {
    let devolution = 0;
    let fuel = 0;
    let storage = 0;
    let freight = 0;
    let cif = 0;
    let docs = 0;
    let handle = 0;
    let fee = {
        tramite: 0.0, flete: 0.0, adicional: 0.0, error: 0
    };
    if (weight > 0) {
        devolution = (price > 100) ? (price / 100) * 1.5 : 1.5;
        fuel = 0.85 * weight;
        storage = 0.65 * weight;
        if (weight <= 35) {
            freight = (weight <= 10) ? 4.55 : weight * 3.35;
        } else {
            freight = weight * 2.55;
        }
        cif = (price + freight) + devolution;
        docs = 2.5;
        if (cif >= 0 && cif <= 25) {
            handle = 2.25;
        } else if (cif > 25 && cif <= 100) {
            handle = 5.65;
        } else if (cif > 100 && cif <= 300) {
            handle = 11.30;
        } else if (cif > 300 && cif <= 500) {
            handle = 16.95;
        } else if (cif > 500 && cif <= 1000) {
            handle = 33.9;
        } else if (cif > 1000 && cif <= 10000) {
            handle = 5.65 * (cif / 100);
        } else if (cif > 10000 && cif <= 100000) {
            handle = 5.65 * (cif / 1000);
        } else {
            handle = 0.0;
        }
        fee.tramite = handle + docs;
        fee.adicional = (fuel + devolution) + storage;
        fee.flete = freight;
    } else {
        //1 Error el peso es cero
        //2 Error el peso es menor a cero
        fee.error = (weight < 0) ? 2 : 1;
    }
    return fee;
}

export function digital(amount: number, weight: number) {
    let devolution = 0;
    let storage = 0;
    let freight = 0;
    let cif = 0;
    let docs = 0;
    let handle = 0;
    let fee = {
        tramite: 0.0, flete: 0.0, adicional: 0.0, error: 0
    };
    if (weight > 0) {
        devolution = (amount > 100) ? (amount / 100) * 1.5 : 1.5;
        storage = 0.65 * weight;
        if (weight <= 35) {
            freight = (weight <= 10) ? 2.5 : weight * 1.25;
        } else {
            freight = weight * 2.5;
        }
        cif = (amount + freight) + devolution;
        docs = 0.5;
        if (cif >= 0 && cif <= 25) {
            handle = 0.25;
        } else if (cif > 25 && cif <= 100) {
            handle = 1.5;
        } else if (cif > 100 && cif <= 300) {
            handle = 2.85;
        } else if (cif > 300 && cif <= 500) {
            handle = 3.95;
        } else if (cif > 500 && cif <= 1000) {
            handle = 4.5;
        } else if (cif > 1000) {
            handle = 5 + (cif * 0.1010210);
        } else {
            handle = 0.0;
        }
        fee.tramite = handle + docs;
        fee.adicional = devolution + storage;
        fee.flete = freight;
    } else {
        //1 Error el peso es cero
        //2 Error el peso es menor a cero
        fee.error = (weight < 0) ? 2 : 1;
    }
    return fee;
}

export function amular(weight: number) {
    return (28.0855 / weight) * 0.0001;
}

export function calcProfit(amount: number) {
    let prices = {
        pyme: 0.00,
        gob: 0.00,
        retail: 0.00,
        wholesale: 0.00,
        wholesale_vip: 0.00,
        exportation: 0.00,
    };
    let base = 15,
        pyme = 40,
        gob = 30,
        retail = 25,
        wholesale = 20,
        wholesale_vip = 15,
        exportation = 10;
    if (amount > 0) {
        if (amount > 0 || amount <= 10) {
            prices.pyme = amount * (((base + pyme) + 5) / 100);
            prices.gob = amount * (((base + gob) + 5) / 100);
            prices.retail = amount * (((base + retail) + 5) / 100);
            prices.wholesale = amount * (((base + wholesale) + 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) + 5) / 100);
            prices.exportation = amount * (((base + exportation) + 5) / 100);
        } else if (amount > 10 || amount <= 100) {
            prices.pyme = amount * ((base + pyme) / 100);
            prices.gob = amount * ((base + gob) / 100);
            prices.retail = amount * ((base + retail) / 100);
            prices.wholesale = amount * ((base + wholesale) / 100);
            prices.wholesale_vip = amount * ((base + wholesale_vip) / 100);
            prices.exportation = amount * ((base + exportation) / 100);
        } else if (amount > 100 || amount <= 300) {
            prices.pyme = amount * (((base + pyme) - 5) / 100);
            prices.gob = amount * (((base + gob) - 5) / 100);
            prices.retail = amount * (((base + retail) - 5) / 100);
            prices.wholesale = amount * (((base + wholesale) - 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) - 5) / 100);
            prices.exportation = amount * (((base + exportation) - 5) / 100);
        } else if (amount > 300 || amount <= 1000) {
            prices.pyme = amount * (((base + pyme) - 5) / 100);
            prices.gob = amount * (((base + gob) - 5) / 100);
            prices.retail = amount * (((base + retail) - 5) / 100);
            prices.wholesale = amount * (((base + wholesale) - 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) - 5) / 100);
            prices.exportation = amount * (((base + exportation) - 5) / 100);
        } else if (amount > 1000 || amount <= 5000) {
            prices.pyme = amount * (((base + pyme) - 5) / 100);
            prices.gob = amount * (((base + gob) - 5) / 100);
            prices.retail = amount * (((base + retail) - 5) / 100);
            prices.wholesale = amount * (((base + wholesale) - 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) - 5) / 100);
            prices.exportation = amount * (((base + exportation) - 5) / 100);
        } else if (amount > 5000 || amount <= 10000) {
            prices.pyme = amount * (((base + pyme) - 5) / 100);
            prices.gob = amount * (((base + gob) - 5) / 100);
            prices.retail = amount * (((base + retail) - 5) / 100);
            prices.wholesale = amount * (((base + wholesale) - 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) - 5) / 100);
            prices.exportation = amount * (((base + exportation) - 5) / 100);
        } else {
            prices.pyme = amount * (((base + pyme) - 5) / 100);
            prices.gob = amount * (((base + gob) - 5) / 100);
            prices.retail = amount * (((base + retail) - 5) / 100);
            prices.wholesale = amount * (((base + wholesale) - 5) / 100);
            prices.wholesale_vip = amount * (((base + wholesale_vip) - 5) / 100);
            prices.exportation = amount * (((base + exportation) - 4) / 100);
        }
    }
    return prices;
}

export function calcDays(date_start: Date, date_end: Date, extra = 0) {
    let f1mf2 = 0,
        days = 0;
    if (date_start < date_end) {
        let diff = date_end.getTime() - date_start.getTime();
        f1mf2 = diff / 86400;
    } else if (date_start == date_end) {
        f1mf2 = 1;
    }
    days = (f1mf2 > 0) ? Math.abs(Math.ceil(f1mf2)) : 1;
    days = (days < 5) ? days + 15 : days + extra;
    return (days > 0)
        ? { message: "El paquete se entregará en: ", days: days }
        : { message: "Error en la fecha, fecha es negativa.", days: days };
}

export async function getTaxes(amount: number = 0, id: number, tipo: string) {
    let tax = 0.00;
    if (amount > 0) {
        if (id > 0) {
            switch (tipo.toLowerCase()) {
                case "tax":
                    const taxStore = await db.select({ tax: Stores.taxes }).from(Stores).where(eq(Stores.id, id));
                    if (taxStore !== undefined) {
                        let storeTaxes = parseFloat(taxStore.tax);
                        tax = (amount * (storeTaxes / 100));
                    }
                    break;
                case "dai":
                    const category = await db.select({ permission: Categories.permission, dai: Categories.dai }).from(Categories).where(eq(Categories.id, id));
                    if (category !== undefined) {
                        let permisos = category.permission;
                        let dai = category.dai;
                        tax = permisos ? ((amount * (dai / 100)) + 10) : (amount * (dai / 100));
                    }
                    break;
                case "tlc":
                    const pais = await db.select({ tlc: Country.tlc }).from(Country).where(eq(Country.id, id));
                    if (pais !== undefined) {
                        let tlc = pais.tlc;
                        tax = (tlc <= 0) ? amount * 1 : (amount * (tlc / 100));
                    }
                    break;
            }
        }
    }
    return tax;
}

export async function calcImportFees(datos: NormalQuotation | FastQuotation) {
    /*------------------ Declaración de variables conocidas -----------------*/
    const iva = 0.13;
    const seguro = 1.5;
    let hoy = new Date(),
        weight = 1,
        store = 0,
        country = 0,
        weight_unit = "g",
        shipping = 0,
        category = 0,
        currier = 0,
        warranty_time = 0,
        warranty_period = 'days',
        height = 0,
        width = 0,
        length = 0,
        measure_unit = "mm",
        price = 0,
        quantity = 0,
        warranty = 0,
        costo = 0,
        costoDS = 0,
        pounds = 0,
        dai = 0,
        tlc = 0,
        taxes = 0,
        freightTaxes = 0,
        freightCost = 0,
        vatR = 0,
        profit = {
            exportation: 0.00,
            gob: 0.00,
            pyme: 0.00,
            retail: 0.00,
            wholesale: 0.00,
            wholesale_vip: 0.00,
        },
        delivery = new Date(),
        importFees = { tramite: 0.0, flete: 0.0, adicional: 0.0, error: 0 };
    /*------------------ Verificación de cotizante -----------------*/
    // if (datos.buyer) AND datos['cotizador'] != 0) {
    //     cotizador = intval(datos['cotizador']);
    // } else {
    //     c = get_User_Id();
    //             # Sí no hay cliente cotizante en las sesiones, se asigna el usuario por defecto.
    //         cotizador = (c > 0) ? c : 65;
    // }
    /*------------------ Asignación de datos -----------------
    */
    price = datos.price;
    quantity = datos.quantity;
    if (datos.weight !== undefined) weight = datos.weight;
    if (datos.weight_unit !== undefined) weight_unit = datos.weight_unit;
    if (datos.height !== undefined) height = datos.height;
    if (datos.width !== undefined) width = datos.width;
    if (datos.length !== undefined) length = datos.length;
    if (datos.measure_unit !== undefined) measure_unit = datos.measure_unit;
    if (datos.warranty_time !== undefined) warranty_time = datos.warranty_time;
    if (datos.importType === 2) {
        if (datos.store_id !== undefined) store = datos.store_id;
        if (datos.country_id !== undefined) country = datos.country_id;
        if (datos.shipping !== undefined) shipping = datos.shipping;
        if (datos.category_id !== undefined) category = datos.category_id;
        if (datos.delivery !== undefined) delivery = new Date(datos.delivery);
        if (datos.currier !== undefined) currier = datos.currier;
    }
    let tiempo_Envio = { message: '', days: 0 };
    /*------------------ Verificación de datos -----------------*/
    if (price > 0) {
        if (warranty_period === 'years') {
            warranty = warranty_time * 12;
        } else if (warranty_period === 'months') {
            warranty = warranty_time * 1;
        } else {
            warranty = warranty_time / 30;
        }
        /*------------- Corvirtiendo peso a kilos -------------*/
        let weightTotal = weight * quantity;
        //Calculo de taxes.
        if (store > 0) {
            const storeTaxes = await getTaxes((price * quantity), store, "TAX");
            if (storeTaxes !== undefined) {
                costo = ((price * quantity) + (shipping * quantity)) + storeTaxes;
                switch (weight_unit) {
                    case 'gr':
                        pounds = weightTotal * 0.002;
                        break;
                    case 'oz':
                        pounds = weightTotal * 0.062;
                        break;
                    case 'lb':
                        pounds = weightTotal;
                        break;
                    case 'kb':
                        pounds = weightTotal * 0.002;
                        break;
                    case 'MB':
                        pounds = weightTotal * 0.002;
                        break;
                    case 'GB':
                        pounds = weightTotal * 0.002;
                        break;
                    default:
                        pounds = weightTotal * 2.205;
                        break;
                }
                /*------------- Calculando número de días -------------*/
                if (category == 3) {
                }
                tiempo_Envio = calcDays(hoy, delivery, 20);
            } else {
                tiempo_Envio = calcDays(hoy, delivery, 10);
            }
            /*----------- Calculando flete y adicionales ------------*/
            //let montoMod = descuento(costo);
            if (currier === 1) {
                importFees = aero(pounds, costo);
            } else if (currier === 2) {
                importFees = cargo(pounds);
            } else if (currier === 3) {
                importFees = digital(costo, pounds);
            } else {
                importFees = local(pounds);
            }
            if (importFees.error == 1) {
                return {
                    message: "El peso es CERO, para calcular el flete el peso debe ser mayor a 0.0",
                    type: "error",
                    title: "Error de cotización",
                    subtitle: "Información incompleta"
                };
            } else if (importFees.error == 2) {
                return {
                    mesage: "No se ha podido calcular la cotización, por favor verifique los datos. El precio es menor que cero",
                    type: "error",
                    title: "Error de cotización",
                    subtitle: "Información incompleta"
                };
            }
            /*----------- Calculando Aranceles ------------*/
            //Preparando costos para calcular aranceles.
            let seguro_Aereo = (costo / 100) * seguro;
            let valorCIF = (costo + importFees.flete) + seguro_Aereo;
            //Calculando el iva de aduana.
            //let ivaMod = valorCIF * iva;
            //Calculando el DAI según categoria y país.
            if (category > 0) {
                let daiBase = await getTaxes(valorCIF, category, 'DAI');
                if (country > 0) {
                    if (daiBase > 0) {
                        tlc = await getTaxes(daiBase, country, 'TLC');
                        dai = tlc / quantity;
                    }
                }
            }
            /*----------- Calculando cobros ------------*/
            // Calculo de impuestos
            //taxes = storeTaxes / quantity;
            freightTaxes = ((importFees.tramite + seguro_Aereo) + importFees.adicional) * iva;
            // invoIVA = ((tmts2['tramite'] + seguro_Aereo) + tmts2['adicional']) * iva;
            // invoIVA2 = ((tmts3['tramite'] + seguro_Aereo) + tmts3['adicional']) * iva;
            // Calculo de importe
            freightCost = ((((importFees.flete + importFees.tramite) + importFees.adicional) + dai) + seguro_Aereo) + freightTaxes;
            // imprt2 = ((((tmts2['flete'] + tmts2['tramite']) + tmts2['adicional']) + dai) + seguro_Aereo) + invoIVA;
            // imprt3 = ((((tmts3['flete'] + tmts3['tramite']) + tmts3['adicional']) + dai) + seguro_Aereo) + invoIVA2;
            //costo = importe / quantity; ) + ivaMod
            costoDS = (freightCost + costo) / quantity;
            // curriers[0]['costo'] = number_format(costoDS, 2);
            // curriers[1]['costo'] = number_format(((imprt2 + costo) / quantity), 2);
            // curriers[2]['costo'] = number_format(((imprt3 + costo) / quantity), 2);
            /*----------- Calculando Costos finales y ganancias ------------*/
            vatR = (costoDS > 100) ? costoDS * 0.01 : costoDS * 0.005;
            profit = calcProfit(costoDS);
            let costo_Cescc_CF = costoDS + profit.retail,
                costo_Cescc_CM = costoDS + profit.wholesale,
                costo_Cescc_CG = costoDS + profit.gob;
            /* ------------------------- Verificando sí el costo es mayor que cero. ------------- */
            if (costo_Cescc_CF > 0 && costo_Cescc_CM > 0 && costo_Cescc_CG > 0) {
                return {
                    message: "ok",
                    weight: {
                        total: weightTotal,
                        value: weight,
                        unit: weight_unit,
                        pounds: pounds,
                    },
                    shipping: {
                        shipping: shipping,
                        delivery: delivery,
                    },
                    importFees: {
                        importFees: importFees,
                        freightCost: freightCost,
                        freightTaxes: freightTaxes,
                    },
                    profit: profit,
                    vatR: vatR,
                    costoDS: costoDS,
                    costo: costo,
                    warranty: warranty,
                    delivery_time: tiempo_Envio,
                    prices: {
                        exportation: (costoDS + profit.exportation) + vatR,
                        gob: (((costoDS + profit.gob) + vatR) * iva) + ((costoDS + profit.gob) + vatR),
                        pyme: (((costoDS + profit.pyme) + vatR) * iva) + ((costoDS + profit.pyme) + vatR),
                        retail: (((costoDS + profit.retail) + vatR) * iva) + ((costoDS + profit.retail) + vatR),
                        wholesale: (((costoDS + profit.wholesale) + vatR) * iva) + ((costoDS + profit.wholesale) + vatR),
                        wholesale_vip: (((costoDS + profit.wholesale_vip) + vatR) * iva) + ((costoDS + profit.wholesale_vip) + vatR),
                    }
                }
            } else {
                //Sí el precio está vacío.
                return {
                    mesage: "No se ha podido calcular la cotización, por favor verifique los datos",
                    type: "error",
                    title: "Error de cotización",
                    subtitle: "Información incompleta"
                };
            }
        } else {
            return {
                mesage: "No se ha podido calcular la cotización, por favor verifique los datos",
                type: "error",
                title: "Error de cotización",
                subtitle: "Información incompleta"
            };
        }
    } else {
        //Sí el precio está vacío.
        return {
            mesage: "No se ha podido calcular la cotización, por favor verifique los datos",
            type: "error",
            title: "Error de cotización",
            subtitle: "Información incompleta"
        };
    }
}
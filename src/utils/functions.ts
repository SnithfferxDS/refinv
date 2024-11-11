import {
    db,
    eq,
    Products,
    Quotations,
    Stores,
    Countries,
    Categories
} from "astro:db";
import type { Quotation, Quotation_Detail, Quotation_Details } from "../types/Quotation";

export function generateIdentifier(typo: string) {
    let hoy = new Date();
    let random = Math.floor(Math.random() * 1000);
    let additional = Math.floor(Math.random() * 10);
    let identifier = "";
    if (typo === "quotation") {
        identifier = "Qt-" + hoy.getFullYear().toString() + hoy.getMonth().toString() + hoy.getDate().toString() + "-" + random.toString() + additional.toString();
    } else if (typo === "invoice") {
        identifier = "Inv-" + hoy.getFullYear().toString() + hoy.getMonth().toString() + hoy.getDate().toString() + random.toString() + additional.toString();
    } else if (typo === "upc") {
        identifier = hoy.getFullYear().toString() + hoy.getMonth().toString() + hoy.getDate().toString() + hoy.getHours().toString() + random.toString() + additional.toString();
    } else if (typo === "sku") {
        identifier = "DS-" + hoy.getMonth().toString() + hoy.getDate().toString() + random.toString() + "-" + additional.toString();
    } else if (typo === "mpn") {
        identifier = "DS-" + hoy.getFullYear().toString() + hoy.getMonth().toString() + hoy.getDate().toString() + random.toString() + additional.toString();
    } else if (typo === "ean") {
        identifier = "0" + hoy.getFullYear().toString() + hoy.getMonth().toString() + hoy.getDate().toString() + random.toString() + additional.toString();
    }
    if (recordExists(typo, identifier) !== undefined) {
        generateIdentifier(typo);
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
        return quotation !== undefined;
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
    let fee = {};
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
        fee = {
            tramite: handle + documentacion,
            adicional: 0.005,
            flete: flete
        };
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

export function calcDays(date_start: string, date_end: string, extra = 0) {
    let f_1 = Date.parse(date_start),
        f_2 = Date.parse(date_end),
        f1mf2 = 0,
        days = 0;
    if (f_1 < f_2) {
        f1mf2 = (f_2 - f_1) / 86400;
    } else if (f_1 == f_2) {
        f1mf2 = 1;
    }
    days = (f1mf2 > 0) ? Math.abs(Math.ceil(f1mf2)) : 1;
    days = (days < 5) ? days + 15 : days + extra;
    return (days > 0)
        ? { message: "El paquete se entregará en: ", days: days.toString() + "&nbsp;d&iacute;as" }
        : { message: "Error en la fecha, fecha es negativa.", days: "Días para entrega: " + days.toString() };
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

export function Importes(datos: Quotation_Detail) {
    /*------------------ Declaración de variables conocidas -----------------*/
    let mensaje = '',
        hoy = new Date(),
        error_DAI = '',
        error_Tax = '',
        iva = 0.13,
        seguro = 1.5;
    /*------------------ Verificación de cotizante -----------------*/
    // if (datos.buyer) AND datos['cotizador'] != 0) {
    //     cotizador = intval(datos['cotizador']);
    // } else {
    //     c = get_User_Id();
    //             # Sí no hay cliente cotizante en las sesiones, se asigna el usuario por defecto.
    //         cotizador = (c > 0) ? c : 65;
    // }
    /*------------------ Asignación de datos -----------------*/
    let price = datos.price;
    let weight = 1;
    let quantity = datos.quantity;
    let store = datos.store;
    let country = datos.country;
    let shipping = datos.shipping;
    let category = datos.category;
    let product = datos.product;
    let link = datos.enlace;
    let product_model = datos.sku ?? "";
    let image = datos.images;
    let date = new Date(datos.date);
    let ship_date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours}:${date.getMinutes}:${date.getSeconds}`;
    let mesure = datos.mesure;
    let currier = datos.currier;
    let waranty = datos.warranty;
    let warantyTime = datos.wtime;
    let garantia = 0;
    let cliente = datos.buyer;
    let kilogramos = 0;
    let libras = 0;
    let tiempo_Envio = { message: '', days: '' };
    /*------------------ Verificación de datos -----------------*/
    if (price > 0) {
        switch (warantyTime) {
            case 'days':
                garantia = waranty / 30;
                break;
            case 'years':
                garantia = waranty * 12;
                break;
            case 'months':
                garantia = waranty * 1;
                break;
            default:
                garantia = 0;
                break;
        }
        /*------------- Corvirtiendo peso a kilos -------------*/
        let weightTotal = weight * quantity;
        //Calculo de taxes.
        if (store != '' && store > 0) {
            //kueri4 = "SELECT tax FROM tiendas WHERE id =" . store;
            /* store_tax = tiendas->get_Store_By_Id(store, "tax"); //Sí la tienda ha sido declarada.
            tax = store_tax['tax'];
            taxes = round(((price * quantity) * (floatval(tax) / 100)),2); */
            let taxes = getTaxes((price * quantity), store, "TAX");
            let costo = ((price * quantity) + (shipping * quantity)) + taxes;
            switch (mesure) {
                case 'gr':
                    kilogramos = weight * 0.001;
                    libras = weightTotal * 0.002;
                    break;
                case 'oz':
                    kilogramos = weight * 0.028;
                    libras = weightTotal * 0.062;
                    break;
                case 'lb':
                    kilogramos = weight * 0.454;
                    libras = weightTotal;
                    break;
                case 'kb':
                    kilogramos = weight * (amular((8 ^ 6)));
                    libras = weightTotal * 0.002;
                    break;
                case 'Mb':
                    kilogramos = weight * (amular((1024 ^ 2)));
                    libras = weightTotal * 0.002;
                    break;
                case 'Gb':
                    kilogramos = weight * (amular((1024 ^ 3)));
                    libras = weightTotal * 0.002;
                    break;
                default:
                    kilogramos = weight;
                    libras = weightTotal * 2.205;
                    break;
            }
            /*------------- Calculando número de días -------------*/
            if (category == 3 || category == "3") {
                tiempo_Envio = calcDays(`${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()} ${hoy.getHours}:${hoy.getMinutes}:${hoy.getSeconds}`, ship_date, 20);
            } else {
                tiempo_Envio = calcDays(`${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()} ${hoy.getHours}:${hoy.getMinutes}:${hoy.getSeconds}`, ship_date, 10);
            }
            /*----------- Calculando flete y adicionales ------------*/
            let montoMod = descuento(costo);
            switch (currier) {
                case 'trans':
                    tramites = trans(libras, 'false');
                    tmts2 = aero(libras, montoMod);
                    tmts3 = cargo(libras);
                    curriers = [
                        ['name': "Transexpress"],
                        ['name': "AeroPost"],
                        ['name': "Cargo International"]
                    ];
                    break;
                case 'aero':
                    tramites = aero(libras, montoMod);
                    tmts2 = trans(libras, 'false');
                    tmts3 = cargo(libras);
                    curriers = [
                        ['name': "AeroPost"],
                        ['name': "Transexpress"],
                        ['name': "Cargo (consolidado)"]
                    ];
                    break;
                case 'cargo':
                    tramites = cargo(libras);
                    tmts2 = trans(libras, 'false');
                    tmts3 = aero(libras, montoMod);
                    curriers = [
                        ['name': "Cargo (consolidado)"],
                        ['name': "Transexpress"],
                        ['name': "AeroPost"],
                    ];
                    break;
                case 'digit':
                    tramites = digital(costo, libras);
                    tmts2 = trans(libras, 'false');
                    tmts3 = aero(libras, montoMod);
                    curriers = [
                        ['name': "Cargo Digital"],
                        ['name': "Transexpress"],
                        ['name': "AeroPost"],
                    ];
                    break;
                default:
                    tramites = trans(libras, 'true');
                    tmts2 = aero(libras, montoMod);
                    tmts3 = cargo(libras);
                    curriers = [
                        ['name': "Transexpress"],
                        ['name': "AeroPost"],
                        ['name': "Cargo (consolidado)"]
                    ];
                    break;
            }
            if (isset(tramites['error'])) {
                if (tramites['error'] == '1') {
                    view_data['message'] = "[ERROR]! <br>El peso es CERO, para calcular el flete el peso debe ser mayor a 0.0";
                } else if (tramites['error'] == '2') {
                    view_data['message'] = "[ERROR]! <br>El peso es menor que CERO, para calcular el flete el peso debe ser mayor a 0.0";
                } else if (tramites['error'] == '3') {
                    view_data['message'] = "[ERROR]! <br>Se requiere que el peso sea un número, mayor a CERO o 0.0";
                }
            } else {
                tramite = tramites['tramite'];
                adicional = tramites['adicional'];
                flete = tramites['flete'];
                adicional += 5.00;
            }
            /*----------- Calculando Aranceles ------------*/
            //Preparando costos para calcular aranceles.
            switch (currier) {
                case 'trans':
                    seguro_Aereo = (costo / 100) * seguro;
                    valorCIF = (costo + flete) + seguro_Aereo;
                    vCIF2 = (montoMod + tmts2['flete']) + seguro_Aereo;
                    vCIF3 = (costo + tmts3['flete']) + seguro_Aereo;
                    break;
                case 'aero':
                    seguro_Aereo = (montoMod / 100) * seguro;
                    valorCIF = (montoMod + flete) + seguro_Aereo;
                    vCIF2 = (costo + tmts2['flete']) + seguro_Aereo;
                    vCIF3 = (costo + tmts3['flete']) + seguro_Aereo;
                    break;
                case 'cargo':
                    seguro_Aereo = (costo / 100) * seguro;
                    valorCIF = (costo + flete) + seguro_Aereo;
                    vCIF2 = (costo + tmts2['flete']) + seguro_Aereo;
                    vCIF3 = (montoMod + tmts3['flete']) + seguro_Aereo;
                    break;
                case 'digit':
                    seguro_Aereo = (costo / 100) * seguro;
                    valorCIF = (costo + flete) + seguro_Aereo;
                    vCIF2 = (costo + tmts2['flete']) + seguro_Aereo;
                    vCIF3 = (montoMod + tmts3['flete']) + seguro_Aereo;
                    break;
                default:
                    seguro_Aereo = (costo / 100) * seguro;
                    valorCIF = (costo + flete) + seguro_Aereo;
                    vCIF2 = (montoMod + tmts2['flete']) + seguro_Aereo;
                    vCIF3 = (costo + tmts3['flete']) + seguro_Aereo;
                    break;
            }
            //Calculando el iva de aduana.
            let ivaMod = valorCIF * iva;
            //ivam2 = vCIF2 * iva;
            //ivam3 = vCIF3 * iva;
            //Calculando el DAI según categoria y país.
            if (category != '' && category > 0) {
                let daiBase = get_Impuestos(valorCIF, category, 'DAI');
                if (!empty(country) && country > 0) {
                    if (is_string(daiBase)) {
                        error_DAI = (daiBase == "Error identificador") ? "No has elegido un pa&iacute;s, para aplicar el descuento al DAI" : "El monto es menor a CERO, no se puede aplicar el descuento al DAI";
                    } else {
                        dai = (daiBase > 0) ? (get_Impuestos(daiBase, country, 'TLC') / quantity) : 0.0;
                    }
                } else {
                    dai = 0.00;
                    error_DAI = "Es necesario elegir un pa&iacute;s, para calcular el descuento del TLC.";
                }
            } else {
                dai = 0.00; //Sí la categoría no ha sido declarada.
                error_DAI = "No has elegido una categor&iacute;a, para calcular el DAI del artículo.";
            }
            /*----------- Calculando cobros ------------*/
            // Calculo de impuestos
            taxes = taxes / quantity;
            ivaDeFactura = ((tramite + seguro_Aereo) + adicional) * iva;
            invoIVA = ((tmts2['tramite'] + seguro_Aereo) + tmts2['adicional']) * iva;
            invoIVA2 = ((tmts3['tramite'] + seguro_Aereo) + tmts3['adicional']) * iva;
            // Calculo de importe
            importe = ((((flete + tramite) + adicional) + dai) + seguro_Aereo) + ivaDeFactura;
            imprt2 = ((((tmts2['flete'] + tmts2['tramite']) + tmts2['adicional']) + dai) + seguro_Aereo) + invoIVA;
            imprt3 = ((((tmts3['flete'] + tmts3['tramite']) + tmts3['adicional']) + dai) + seguro_Aereo) + invoIVA2;
            //costo = importe / quantity; ) + ivaMod
            costods = (importe + costo) / quantity;
            curriers[0]['costo'] = number_format(costods, 2);
            curriers[1]['costo'] = number_format(((imprt2 + costo) / quantity), 2);
            curriers[2]['costo'] = number_format(((imprt3 + costo) / quantity), 2);
            /*----------- Calculando Costos finales y ganancias ------------*/
            retencion = (costods > 100) ? costods * 0.01 : costods * 0.005;
            ganancia = cal_ganancia(costods);
            gananciaCG = ganancia['CG']; //Ganancia Gobierno
            gananciaCF = ganancia['CF']; //Ganancia Consumidor
            gananciaCM = ganancia['CM']; //Ganancia Mayoreo
            costo_Cescc_CF = costods + gananciaCF;
            costo_Cescc_CM = costods + gananciaCM;
            costo_Cescc_CG = costods + gananciaCG;
            /* ------------------------- Verificando sí el costo es mayor que cero. ------------- */
            if (costo_Cescc_CF > 0 AND costo_Cescc_CM > 0 AND costo_Cescc_CG > 0) {
                if (category != '' AND category > 0) {
                    //Calculando el ces.
                    cesccCF = get_Impuestos(costo_Cescc_CF, category, 'CES'); //CESCC Consumidor
                    cesccCM = get_Impuestos(costo_Cescc_CM, category, 'CES'); //CESCC Mayoreo
                    cesccCG = get_Impuestos(costo_Cescc_CG, category, 'CES'); //CESCC Gobierno
                    cescc_Taxes['cf'] = cesccCF;
                    cescc_Taxes['cm'] = cesccCM;
                    cescc_Taxes['cg'] = cesccCG;
                } else {
                    error_CES = "No has elegido una categoria, para calcular los impuestos.";
                }
            } else {
                //Sí ha ocurrido un error al calcular los impuestos, se notifica por medio de los errores.
                msg_data = {
                    'data': ["'TAX' = error_Tax", "'DAI' = error_DAI", "'CESCC' =error_CES"],
                    'msg': "Ha ocurrido un error al calcular los impuestos.<br>Aseg&uacute;rate de poner una cantidad mayor a cero y eleguir categor&iacutea pa&iacute;s y tienda.",
                    'title': "Falta de información.",
                    'subtitle': "",
                    'type': "request",
                    'icon': "fas fa-exclamation-triangle"
                };
            }
            /*----------- Calculando el precio por cliente. -----------*/
            ivaReal = [
                'cg': (costods + gananciaCG) * iva,
                'cf': (costods + gananciaCF) * iva,
                'cm': (costods + gananciaCM) * iva,]; //IVA real del costo.
            precios['cg'] = round((((costods + gananciaCG) + cesccCG) + retencion) + ivaReal['cg'], 3); //Precio de gobierno
            precios['cf'] = round(((((costods + gananciaCF) + cesccCF) + retencion) + ivaReal['cf']), 3); //Precio de consumidor
            precios['cm'] = round(((((costods + gananciaCM) + cesccCM) + retencion) + ivaReal['cm']), 3); //Precio de mayoreo
            //pasando el precio para insertarlo en base de datos.
            precioCF = precios['cf'];
            /*----------- Sí los impuestos han sido calculados exitosamente. -----------*/
            if (error_CES == '' and error_DAI == '' and error_Tax == '') {
                users = usuarios -> get_User_By_Id(cotizador, "nombre,email");
                user_name = users['nombre'];
                user_email = users['email'];
                stores = tiendas -> get_Store_By_Id(store, "name");
                store_name = stores['name'];
                countries = paises -> get_Country_By_Id(country, "nombre");
                country_name = countries['nombre'];
                categories = categorias -> get_Category_By_Id(category, "nombre");
                category_name = categories['nombre'];
                tiempo = intval(tiempo_Envio['dias']);
                //Insertando producto a la base de datos
                valores_Ha_Insertar = {
                    'productName': product,
                    'modelo': product_model,
                    'category': category,
                    'peso': kilogramos,
                    'image': image,
                    'reference': datos['ref']
                };
                guarda_producto = producto -> setProductData(valores_Ha_Insertar);
                //log_Sipi->log_TransacStatement("insert into cotizados", 'calculador', user_name, hoy);
                //users = usuarios->get_User_By_Id(cotizador,"nombre");
                clienteId = usuarios -> getUserByName(cliente, "id_usuario");
                usuario = users['nombre'];
                coti_id = intval(guarda_producto);
                if (!isset(guarda_producto['errors'])) {
                    //Sí todo ha ido bien.
                    arrayCoti = {
                        'fecha': hoy,
                        'producto': coti_id,
                        'precio': price,
                        'envio': shipping,
                        'tax': taxes,
                        'peso': kilogramos,
                        'tienda': store,
                        'pais': country,
                        'cliente': cliente,
                        'quoter': user_name,
                        'cant': quantity,
                        'costods': costods,
                        'costo': (costo / quantity),
                        'consumer': precioCF,
                        'enlace': link,
                        'estado': 1,
                        'entrega': tiempo,
                        'currier': currier,
                        'garantia': garantia,
                        'number': datos['num']
                    };
                    guarda_cotizacion = cotizacion -> insert_New_Row(arrayCoti);
                    //log_Sipi->log_TransacStatement("insert into cotizaciones", 'calculador', user_name, hoy);
                    id_cotizado = guarda_cotizacion['registros'];//Sí la cotización se guardo correctamente.
                    if (guarda_cotizacion['mensaje'] == 'success') {
                        //log_Sipi->log_Activity(user_name,'Guardado de cotización #' . id_cotizado,hoy,'Calculador'); //Se crea un log en la base de datos.
                        mensaje = "Cotizaci&oacute;n #".guarda_cotizacion['registros']; //Se pasa el número de cotización
                    } else {
                        //log_Sipi->log_Activity(user_name,'Fallo al guardar cotización',hoy,'Calculador'); //Se crea un log en la base de datos.
                        mensaje = "No se ha podido guardar la cotizaci&oacute;n.<br>".guarda_cotizacion['mensaje'];
                    }
                } else { //Sí el guardado de cotización ha dado errores, se crea un log y se pasa un mensaje informativo.
                    //log_Sipi->log_Activity(usuario,'Fallo al guardar producto',hoy,'Calculador');
                    mensaje = "No se ha podido guardar la cotizaci&oacute;n.<br>".guarda_producto['errores'];
                }
                /*----------- Se pasan todos los datos al array, para ser enviado a la vista. -----------*/
                msg_data = {
                    'data': "",
                    'msg': mensaje,
                    'title': "Cotización Exitosa",
                    'subtitle': "#&nbsp;".id_cotizado,
                    'type': "success",
                    'icon': "fas fa-check-circle"
                };
                imgArray = explode(",", image);
                cotizado = {
                    'ganancia': ganancia,
                    'category': category_name,
                    'costods': number_format(costods, 2),
                    'curriers': curriers,
                    'country': country_name,
                    'fees': number_format((importe / quantity), 2),
                    'link': datos['enlace'],
                    'product_model': product_model,
                    'product': "#&nbsp;".id_cotizado. "&nbsp;".product,
                    'priceCF': number_format(precios['cf'], 2),
                    'priceCM': number_format(precios['cm'], 2),
                    'priceCG': number_format(precios['cg'], 2),
                    'price': number_format(price, 2),
                    'quantity': quantity,
                    'shipping': number_format(shipping, 2),
                    'store': store_name,
                    'taxes': number_format(taxes, 2),
                    'weight': kilogramos,
                    'time': tiempo_Envio,
                    'imageurl': "uploads/imagenes/".datos['ref'].imgArray[0],
                    'title': "Cotizado",
                    'mensaje': json_encode(messenger -> messageBuilder("alert", msg_data), JSON_FORCE_OBJECT),
                    'client': (empty(cliente)) ? 'Sin identificaci&oacute;n' : cliente,
                    'cotizador': (empty(user_name)) ? 'Sin identificaci&oacute;n' : user_name,
                    'garantia': garantia,
                    'IVA': ivaReal,
                    'IVAmod': number_format((ivaMod / quantity), 2),
                    'CES': cescc_Taxes,
                    'DAI': number_format(dai, 2),
                    'id': id_cotizado
                };
                //Se somprueba sí el usuario está declarado.
                /*----------- Se pasan los datos a la vista. -----------*/
                view = view('Cotizaciones/Cotizado', cotizado);
                mailData = {
                    'title': "Cotización de ".product,
                    'nombre': (empty(cliente)) ? 'Sin identificaci&oacute;n' : cliente,
                    'id': id_cotizado,
                    'id_product': coti_id,
                    'producto': product,
                    'modelo': product_model,
                    'enlace': datos['enlace'],
                    'precio': number_format(price, 2),
                    'envio': number_format((shipping * quantity), 2),
                    'taxes': number_format((taxes * quantity), 2),
                    'flete': number_format(importe, 2),
                    'utilidad': number_format(gananciaCF, 2),
                    'tiempo': tiempo_Envio,
                    'cant': quantity,
                    'fecha': date("d/M/Y"),
                    'sugerido': number_format(precios['cf'], 2),
                    'sumas': number_format(price * quantity, 2)
                }

                messenger -> cartero("normal-coti_created", user_email, "Cotización normal", mailData);
            } else {
                //Sí ha ocurrido un error al calcular los impuestos, se notifica por medio de los errores.
                msg_data = {
                    'data': ["'TAX' = error_Tax", "'DAI' = error_DAI", "'CESCC' = error_CES"],
                    'msg': "Ha ocurrido un error al calcular los impuestos.",
                    'title': "Falta de información.",
                    'subtitle': "",
                    'type': "request",
                    'icon': "fas fa-exclamation-triangle"
                };
                view = json_encode(messenger -> messageBuilder("alert", msg_data), JSON_FORCE_OBJECT);
            }
        } else {
            taxes = 0.00;
            error_Tax = "No has elegido una tienda, para calcular el TAX";
        }
    } else {
        //Sí el precio es menor a cero
        users = usuarios -> get_User_By_Id(cotizador, "nombre");
        usuario = users['nombre'];
        //log_Sipi->log_Activity(usuario,'Fallo al cotizar producto division por CERO',hoy,'Calculador');
        msg_data = {
            'data': ["'TAX' = ''", "'DAI' = ''", "'CESCC' =''"],
            'msg': usuario. "<br>(&sum;<sub>n</sub> (0 &times; 0)) &divide; 0 &cong; [CERO]! <br>Debes poner un precio mayor a CERO, para que devuelva algo más que CERO",
            'title': "Divición por cero.",
            'subtitle': "Precio = 0",
            'type': "notallow",
            'icon': "fas fa-ban"
        };
        view = json_encode(messenger -> messageBuilder("alert", msg_data), JSON_FORCE_OBJECT);
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
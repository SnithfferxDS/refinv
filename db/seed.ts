import {
	db,
	Products,
	Categories,
	Product_Relations,
	Quotations,
	Quotation_Details,
	Stores,
	Countries,
	Images
} from 'astro:db';
import { generateIdentifier } from '../src/utils/functions';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Products).values([
		{
			id: 1,
			name: 'Product 1',
			tags: '',
			upc: await generateIdentifier('upc') ?? '1234567890',
			sku: await generateIdentifier('sku') ?? '1234567890',
			mpn: await generateIdentifier('mpn') ?? '1234567890',
			ean: await generateIdentifier('ean') ?? '1234567890',
		},
		{
			id: 3,
			name: 'Producto 2',
			tags: '',
			upc: await generateIdentifier('upc') ?? '1214777615249',
			sku: await generateIdentifier('sku') ?? '1214777615249',
			mpn: await generateIdentifier('mpn') ?? '1214777615249',
			ean: await generateIdentifier('ean') ?? '1214777615249',
		},
		{
			id: 4,
			name: 'Producto 2',
			upc: await generateIdentifier('upc') ?? '121454875549',
			sku: await generateIdentifier('sku') ?? '121454875549',
			mpn: await generateIdentifier('mpn') ?? '121454875549',
			ean: await generateIdentifier('ean') ?? '121454875549',
			tags: ''
		},
		{
			id: 5,
			name: 'Producto 2',
			upc: await generateIdentifier('upc') ?? '1214540125249',
			sku: await generateIdentifier('sku') ?? '1214540125249',
			mpn: await generateIdentifier('mpn') ?? '1214540125249',
			ean: await generateIdentifier('ean') ?? '1214540125249',
			tags: ''
		},
		{
			id: 6,
			name: 'Producto 2',
			upc: await generateIdentifier('upc') ?? '12100487615249',
			sku: await generateIdentifier('sku') ?? '12100487615249',
			mpn: await generateIdentifier('mpn') ?? '12100487615249',
			ean: await generateIdentifier('ean') ?? '12100487615249',
			tags: ''
		}
	]);
	await db.insert(Categories).values([
		{
			id: 1,
			name: "Almacenamiento",
			children: true,
			status: true,
			main: true
		}, {
			id: 2,
			name: "Computadoras",
			status: true,
			main: true
		}, {
			id: 3,
			name: "HDD",
			status: true,
			parent_id: 1
		}, {
			id: 4,
			name: "SSD",
			parent_id: 1,
			status: true
		}
	]);
	await db.insert(Product_Relations).values([
		{
			id: 1,
			product_id: 1,
			category_id: 1,
			image_id: 1
		}, {
			id: 2,
			product_id: 2,
			category_id: 1,
			image_id: 2
		}
	]);
	await db.insert(Quotations).values([
		{
			id: 1,
			number: 'QDS-2022-001',
			quotation_date: new Date()
		},
		{
			id: 2,
			number: 'QDS-2022-002',
			quotation_date: new Date()
		}
	]);
	await db.insert(Quotation_Details).values([
		{
			id: 1,
			quotation_id: 1,
			product_id: 2,
			quantity: 5,
			store_id: 1,
			country_id: 1,
			quot_type: 1
		}
	]);
	await db.insert(Stores).values([
		{
			id: 1,
			name: 'Amazon',
			store_type: 2,
			shipping: true
		},
		{
			id: 2,
			name: 'eBay',
			store_type: 2,
			shipping: true
		},
		{
			id: 3,
			name: 'Walmart',
			store_type: 2,
			shipping: true
		},
		{
			id: 4,
			name: 'BestBuy',
			store_type: 2,
			shipping: true
		},
		{
			id: 5,
			name: 'Multinet',
			store_type: 1,
			shipping: true
		},
		{
			id: 6,
			name: 'Walmart SV',
			store_type: 1,
			shipping: false
		}
	]);
	await db.insert(Countries).values([
		{ id: 1, name: 'United States' },
		{ id: 2, name: 'China' },
		{ id: 3, name: 'España' },
		{ id: 4, name: 'Australia' },
		{ id: 5, name: 'Mexico' }
	]);
	await db.insert(Images).values([
		{
			id: 1,
			name: 'image 1'
		},
		{
			id: 2,
			name: 'image 2'
		}
	])
	/*
<OPTION value='1'>Envio Santa Ana 1 $1</OPTION>
<OPTION value='1'>Envio Ciudad Real $1</OPTION>
<OPTION value='1'>Envio Chalchuapa $1</OPTION>
<OPTION value='4'>Envio Especial 1 $4</OPTION>
<OPTION value='3'>Envio Atiquizaya $3</OPTION>
<OPTION value='3'>Envio Turin $3</OPTION>
<OPTION value='3'>Envio Juayua $3</OPTION>
<OPTION value='50'>Envio Metapan $50</OPTION>
<OPTION value='2'>Envio Zona Franca $2</OPTION>
<OPTION value='3'>Envio Ataco $3</OPTION>
<OPTION value='5'>Envio Especial 2 $5</OPTION>
<OPTION value='3'>Envio Candelaria $3</OPTION>
<OPTION value='3'>Envio San Salvador $3</OPTION>
<OPTION value='1'>Envio El Porvenir $1</OPTION>
<OPTION value='3'>Envio San Lorenzo $3</OPTION>
<OPTION value='1.5'>Envio Santa Ana 2 $1.5</OPTION>
<OPTION value='2'>Envio Texistepeque $2</OPTION>
<OPTION value='4'>Envio Especial 1 $4</OPTION>
<OPTION value='5'>Envio Especial 2 $5</OPTION>
<OPTION value='6'>Envio Especial 3 $6</OPTION>
<OPTION value='3'>Envio Especial 1 $3</OPTION>
<OPTION value='3'>Envio Apaneca $3</OPTION>
<OPTION value='3'>Envio Tacuba $3</OPTION>
<OPTION value='4'>Envio Especial 1 $4</OPTION>
<OPTION value='3'>Envio Santiago Frontera $3</OPTION>
<OPTION value='3'>Envio San Cristobal $3</OPTION>
<OPTION value='3'>Envio Guaymango $3</OPTION>
<OPTION value='3'>Envio Jujutla $3</OPTION>
<OPTION value='8'>Envio Especial 4 $8</OPTION>
<OPTION value='1'>Envio Especial 1 $1</OPTION>
<OPTION value='4'>Envio Especial 2 $4</OPTION>
<OPTION value='2'>Envio Especial 2 $2</OPTION>
<OPTION value='10'>Envio Especial 5 $10</OPTION>
<OPTION value='3'>Envio Especial 3 $3</OPTION>
<OPTION value='5'>Envio Especial 3 $5</OPTION>
<OPTION value='4'>Envio Especial 4 $4</OPTION>
<OPTION value='8'>Envio Especial 5 $8</OPTION>
<OPTION value='2'>Envio Santa Ana 3 $2</OPTION>
<OPTION value='10'>Envio Especial 6 $10</OPTION>
<OPTION value='15'>Envio Especial 7 $15</OPTION>
<OPTION value='20'>Envio Especial 8 $20</OPTION>
<OPTION value='15'>Envio Especial 6 $15</OPTION>
<OPTION value='6'>Envio Especial 4 $6</OPTION>
<OPTION value='3'>Envio Ahuachapan $3</OPTION>
<OPTION value='25'>Envio Especial 9 $25</OPTION>
<OPTION value='0'>borrar $0</OPTION>
<OPTION value='7'>Envio Especial 5 $7</OPTION>
<OPTION value='3'>Envio El Pajonal $3</OPTION>
<OPTION value='30'>Envio Especial 10 $30</OPTION>
<OPTION value='35'>Envio Especial 11 $35</OPTION>
<OPTION value='40'>Envio Especial 12 $40</OPTION>
<OPTION value='0'>Envio SSA  $0</OPTION>
<OPTION value='5'>Envio Especial 13 $5</OPTION>
<OPTION value='50'>Envio Especial 14 $50</OPTION>
<OPTION value='60'>Envio Especial 15 $60</OPTION>
<OPTION value='3'>Envio C807 $3</OPTION>
<OPTION value='1.5'>Envio Especial 1 $1.5</OPTION>
<OPTION value='2.5'>Envio Especial 1 $2.5</OPTION>
<OPTION value='3'>Envio C807 $3</OPTION>
<OPTION value='2'>Envio C807 $2</OPTION>
<OPTION value='20'>Envio Especial 7 $20</OPTION>
<OPTION value='5'>Envio Especial 2 $5</OPTION>
<OPTION value='2'>Envio Especial 2 $2</OPTION>
<OPTION value='3'>Envio C807 $3</OPTION>
<OPTION value='8'>Envio Especial 6 $8</OPTION>
<OPTION value='6'>Envio Especial 3 $6</OPTION>
<OPTION value='25'>Envio Especial 8 $25</OPTION>
<OPTION value='3'>Envio Especial 3 $3</OPTION>
<OPTION value='2'>Envio C807 $2</OPTION>
<OPTION value='4'>Envio C807 $4</OPTION>
<OPTION value='0'>borrar $0</OPTION>
<OPTION value='4'>Envio C807xpress $4</OPTION>
<OPTION value='30'>Envio Especial 9 $30</OPTION>
<OPTION value='1'>Envio La Magdalena $1</OPTION>
<OPTION value='1'>Envio San Sebastian Salitrillo $1</OPTION>
<OPTION value='1'>Envio Atiquizaya CH $1</OPTION>
<OPTION value='1'>Envio El Refugio CH $1</OPTION>
<OPTION value='1'>Envio Turin CH $1</OPTION>
<OPTION value='35'>Envio Especial 10 $35</OPTION>
<OPTION value='66'>Envio Especial 11 $66</OPTION>
<OPTION value='50'>Envio Especial 12 $50</OPTION>
<OPTION value='3'>Envio Especial 1 $3</OPTION>
<OPTION value='4'>Envio Especial 2 $4</OPTION>
<OPTION value='5'>Envio Especial 3  $5</OPTION>
<OPTION value='9'>Envio Especial 7 $9</OPTION>
<OPTION value='10'>Envio Especial 8 $10</OPTION>
<OPTION value='15'>Envio Especial 9 $15</OPTION>
<OPTION value='20'>Envio Especial 10 $20</OPTION>
<OPTION value='25'>Envio Especial 11 $25</OPTION>
<OPTION value='5'>Envio C807xpress Doc $5</OPTION>
<OPTION value='8'>Envio Especial 2 $8</OPTION>
<OPTION value='10'>Envio Especial 3 $10</OPTION>
<OPTION value='8'>Envio C807xpress 2 $8</OPTION>
<OPTION value='12'>Envio C807xpress 3  $12</OPTION>
<OPTION value='3'>DS SS $3</OPTION>
<OPTION value='3'>DS CF $3</OPTION>
<OPTION value='3'>DS AHU $3</OPTION>
<OPTION value='2'>DS MET $2</OPTION>
<OPTION value='3'>DS SSN $3</OPTION>
<OPTION value='2'>DS ZF $2</OPTION>
<OPTION value='3'>Santa Ana especial 3 $3</OPTION>
*/
}

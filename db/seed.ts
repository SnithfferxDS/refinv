import { db, Categories, Status } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Categories).values([
		{ name: 'Grade A' },
		{ name: 'Grade B' },
		{ name: 'Grade C' },
		{ name: 'Grade D' }
	]);
	await db.insert(Status).values([
		{ name: 'Activo', description: 'Activo' },
		{ name: 'Inactivo', description: 'Inactivo' },
		{ name: 'Pendiente', description: 'Pendiente' },
		{ name: 'Cancelado', description: 'Cancelado' },
		{ name: 'Finalizado', description: 'Finalizado' },
		{ name: 'En proceso', description: 'En proceso' }
	]);
}

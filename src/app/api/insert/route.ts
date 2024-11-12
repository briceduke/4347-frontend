import { insertSchema } from "@/lib/schema";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = insertSchema.parse(body);

		const { table, data } = parsed;
		const columns = Object.keys(data).join(", ");
		const values = Object.values(data)
			.map((val) => `'${val}'`)
			.join(", ");

		const result = await sql.query(
			`INSERT INTO ${table} (${columns}) VALUES (${values})`,
		);

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		return NextResponse.json(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{ error: (error as any).message ?? "Error inserting data" },
			{ status: 500 },
		);
	}
}

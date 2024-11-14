import { updateSchema } from "@/lib/schema";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = updateSchema.parse(body);

		const { table, columns, condition, values } = parsed;
		const setClause = columns
			.map((col, index) => `${col} = '${values[index]}'`)
			.join(", ");

		const result = await sql.query(
			`UPDATE ${table} SET ${setClause} WHERE ${condition}`,
		);

		return NextResponse.json({ success: !!result.rowCount });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		return NextResponse.json(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{ error: (error as any).message ?? "Error updating data" },
			{ status: 500 },
		);
	}
}

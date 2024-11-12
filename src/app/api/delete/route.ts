import { deleteSchema } from "@/lib/schema";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = deleteSchema.parse(body);

		const { table, condition } = parsed;

		const result = await sql.query(`DELETE FROM ${table} WHERE ${condition};`);

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		return NextResponse.json(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{ error: (error as any).message ?? "Error deleting data" },
			{ status: 500 },
		);
	}
}

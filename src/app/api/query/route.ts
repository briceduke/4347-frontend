import { querySchema } from "@/lib/schema";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = querySchema.parse(body);

		const { table, columns, condition } = parsed;
		const columnList = columns.join(", ");

		const result = await sql.query(
			`SELECT ${columnList} FROM ${table}${condition ? ` WHERE ${condition}` : ""};`,
		);

		return NextResponse.json(result.rows);
	} catch (error) {
		console.error(error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Error executing query" },
			{ status: 500 },
		);
	}
}

import { distanceSchema } from "@/lib/schema";
import { sql } from "@vercel/postgres";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
	try {
		const params = request.nextUrl.searchParams;
		const parsed = distanceSchema.parse({
			to: params.get("to"),
			from: params.get("from"),
		});

		const { to, from } = parsed;

		console.log(to, from);

		const result =
			await sql`SELECT latitude, longitude FROM airports WHERE airport_id = ${to} OR airport_id = ${from}`;

		const viewResult =
			await sql`SELECT distance_km FROM AirportDistances WHERE airport1_id = ${from} AND airport2_id = ${to}`;

		return NextResponse.json({
			latLongs: result.rows,
			distance: viewResult.rows[0].distance_km,
		});
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

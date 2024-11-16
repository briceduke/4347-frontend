import { z } from "zod";

export const validTables = [
	"airlines",
	"airplanes",
	"airports",
	"flights",
	"passengers",
	"employees",
	"pilot",
	"flight_attendant",
] as const;

export const validTableColumns = {
	airlines: ["airline_id", "airline_name", "num_employees", "num_planes"],
	airplanes: [
		"plane_id",
		"plane_type",
		"max_distance",
		"capacity",
		"dry_weight",
		"airline_id",
	],
	airports: [
		"airport_id",
		"airport_name",
		"state",
		"city",
		"latitude",
		"longitude",
	],
	flights: [
		"flight_id",
		"start_time",
		"end_time",
		"airplane_id",
		"start_id",
		"end_id",
	],
	passengers: [
		"passenger_id",
		"num_bags",
		"fname",
		"lname",
		"midInit",
		"flight_id",
	],
	employees: [
		"employee_id",
		"airline_id",
		"salary",
		"etype",
		"fname",
		"lname",
		"midInit",
	],
	pilot: ["employee_id", "license_id", "plane_id"],
	flight_attendant: ["employee_id", "plane_id"],
};

export const querySchema = z
	.object({
		table: z.enum(validTables),
		columns: z.array(z.string()),
		condition: z.string().optional(),
	})
	.refine(
		(schema) => {
			const table = schema.table;
			return (
				table &&
				schema.columns.every((col) => validTableColumns[table].includes(col))
			);
		},
		{ message: "Invalid column(s) for the selected table" },
	);

export const insertSchema = z.object({
	table: z.enum(validTables),
	data: z.record(z.string(), z.string().or(z.number())),
});

export const deleteSchema = z.object({
	table: z.enum(validTables),
	condition: z.string().min(1),
});

export const updateSchema = z
	.object({
		table: z.enum(validTables),
		columns: z.array(z.string()),
		condition: z.string().min(1),
		values: z.array(z.string().or(z.number())),
	})
	.refine(
		(schema) => {
			const table = schema.table;
			return (
				table &&
				schema.columns.every((col) => validTableColumns[table].includes(col))
			);
		},
		{ message: "Invalid column(s) for the selected table" },
	);

export const distanceSchema = z.object({
	to: z.string().min(1),
	from: z.string().min(1),
});

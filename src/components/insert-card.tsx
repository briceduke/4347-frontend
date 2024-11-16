import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { validTableColumns, validTables } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface InsertCardProps {
	setQueryResult: Dispatch<SetStateAction<string>>;
	insertData: Record<string, string>;
	setInsertData: Dispatch<SetStateAction<Record<string, string>>>;
}

export function InsertCard({
	setQueryResult,
	setInsertData,
	insertData,
}: InsertCardProps) {
	const [insertTable, setInsertTable] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (insertTable) {
			const newInsertData = validTableColumns[
				insertTable as keyof typeof validTableColumns
			].reduce(
				(acc, col) => {
					acc[col] = "";
					return acc;
				},
				{} as Record<string, string>,
			);
			setInsertData(newInsertData);
		}
	}, [insertTable]);

	const { mutate, isPending } = useMutation({
		mutationKey: ["insert"],
		mutationFn: async () => {
			const response = await fetch("/api/insert", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: insertTable,
					data: insertData,
				}),
			});
			const data = await response.json();
			setQueryResult(JSON.stringify(data, null, 2));
		},
		onError: () => setQueryResult("Error inserting data"),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>insert</CardTitle>
				<CardDescription>enter data for the selected table:</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="insertTable">Select Table</Label>
						<Select onValueChange={setInsertTable}>
							<SelectTrigger id="insertTable">
								<SelectValue placeholder="Select a table" />
							</SelectTrigger>
							<SelectContent>
								{validTables.map((table) => (
									<SelectItem key={table} value={table}>
										{table}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{insertTable &&
						validTableColumns &&
						validTableColumns[
							insertTable as keyof typeof validTableColumns
						].map((col) => (
							<div key={col} className="flex flex-col space-y-1.5">
								<Label htmlFor={col}>{col}</Label>
								<Input
									id={col}
									value={insertData[col]}
									onChange={(e) =>
										setInsertData({
											...insertData,
											[col]: e.target.value,
										})
									}
									placeholder={`Enter ${col}`}
								/>
							</div>
						))}
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => mutate()} disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					insert data
				</Button>
			</CardFooter>
		</Card>
	);
}

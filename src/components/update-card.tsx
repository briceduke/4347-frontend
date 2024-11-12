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
import { type Dispatch, type SetStateAction, useState } from "react";
import { MultiSelect } from "./ui/multi-select";

interface UpdateCardProps {
	setQueryResult: Dispatch<SetStateAction<string>>;
	insertData: Record<string, string>;
	setInsertData: Dispatch<SetStateAction<Record<string, string>>>;
}

export function UpdateCard({
	setQueryResult,
	setInsertData,
	insertData,
}: UpdateCardProps) {
	const [updateTable, setUpdateTable] = useState("");
	const [updateColumns, setUpdateColumns] = useState<string[]>([]);
	const [updateCondition, setUpdateCondition] = useState("");

	const { mutate, isPending } = useMutation({
		mutationKey: ["update"],
		mutationFn: async () => {
			const response = await fetch("/api/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: updateTable,
					columns: updateColumns,
					condition: updateCondition,
					values: updateColumns.map((col) => insertData[col]),
				}),
			});
			const data = await response.json();
			setQueryResult(JSON.stringify(data, null, 2));
		},
		onError: () => setQueryResult("Error updating data"),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update</CardTitle>
				<CardDescription>
					Select table, columns to update, and condition:
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="updateTable">Select Table</Label>
						<Select onValueChange={setUpdateTable}>
							<SelectTrigger id="updateTable">
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
					<div className="flex flex-col space-y-1.5">
						{validTableColumns && updateTable && (
							<>
								<Label htmlFor="updateColumns">Select Columns to Update</Label>

								<MultiSelect
									onValueChange={(value) => setUpdateColumns(value)}
									options={validTableColumns[
										updateTable as keyof typeof validTableColumns
									].map((c) => ({
										label: c,
										value: c,
									}))}
								/>
							</>
						)}
					</div>
					{updateColumns.map((col) => (
						<div key={col} className="flex flex-col space-y-1.5">
							<Label htmlFor={`update_${col}`}>{col}</Label>
							<Input
								id={`update_${col}`}
								value={insertData[col]}
								onChange={(e) =>
									setInsertData({ ...insertData, [col]: e.target.value })
								}
								placeholder={`Enter new value for ${col}`}
							/>
						</div>
					))}
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="updateCondition">Condition</Label>
						<Input
							id="updateCondition"
							value={updateCondition}
							onChange={(e) => setUpdateCondition(e.target.value)}
							placeholder="e.g. employee_id = 'EMP123'"
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => mutate()} disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					Update Data
				</Button>
			</CardFooter>
		</Card>
	);
}

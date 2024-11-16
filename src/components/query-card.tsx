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
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { MultiSelect } from "./ui/multi-select";

interface QueryCardProps {
	setQueryResult: Dispatch<SetStateAction<string>>;
}

export function QueryCard({ setQueryResult }: QueryCardProps) {
	const [queryTable, setQueryTable] = useState("");
	const [queryColumns, setQueryColumns] = useState<string[]>([]);
	const [queryCondition, setQueryCondition] = useState("");

	const { refetch, isLoading } = useQuery({
		queryKey: ["query"],
		queryFn: async () => {
			const response = await fetch("/api/query", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: queryTable,
					columns: queryColumns,
					condition: queryCondition || undefined,
				}),
			});
			const data = await response.json();
			setQueryResult(JSON.stringify(data, null, 2));
		},
		enabled: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>query</CardTitle>
				<CardDescription>
					build your query using the options below:
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="queryTable">Select Table</Label>
						<Select
							onValueChange={(value) => {
								setQueryColumns([]);
								setQueryTable(value);
							}}
						>
							<SelectTrigger id="queryTable">
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
						{validTableColumns && queryTable && (
							<>
								<Label htmlFor="queryColumns">Select Columns</Label>
								<MultiSelect
									onValueChange={setQueryColumns}
									value={queryColumns}
									options={validTableColumns[
										queryTable as keyof typeof validTableColumns
									].map((c) => ({
										label: c,
										value: c,
									}))}
								/>
							</>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="queryCondition">Condition (optional)</Label>
						<Input
							id="queryCondition"
							value={queryCondition}
							onChange={(e) => setQueryCondition(e.target.value)}
							placeholder="e.g. salary > 150000"
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={() => refetch()} disabled={isLoading}>
					{isLoading && <Loader2 className="animate-spin" />}
					execute query
				</Button>
			</CardFooter>
		</Card>
	);
}

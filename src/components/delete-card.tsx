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
import { validTables } from "@/lib/schema";
import { type Dispatch, type SetStateAction, useState } from "react";

interface DeleteCardProps {
	setQueryResult: Dispatch<SetStateAction<string>>;
}

export function DeleteCard({ setQueryResult }: DeleteCardProps) {
	const [deleteData, setDeleteData] = useState({ table: "", condition: "" });

	const handleDelete = async () => {
		try {
			const response = await fetch("/api/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: deleteData.table,
					condition: deleteData.condition,
				}),
			});
			const data = await response.json();
			setQueryResult(JSON.stringify(data, null, 2));
		} catch (error) {
			setQueryResult("Error deleting data");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Delete</CardTitle>
				<CardDescription>
					Enter table name and condition for deletion:
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="deleteTable">Select Table</Label>
						<Select
							onValueChange={(value) =>
								setDeleteData({ ...deleteData, table: value })
							}
						>
							<SelectTrigger id="deleteTable">
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
						<Label htmlFor="deleteCondition">Condition</Label>
						<Input
							id="deleteCondition"
							value={deleteData.condition}
							onChange={(e) =>
								setDeleteData({ ...deleteData, condition: e.target.value })
							}
							placeholder="e.g. employee_id = 'EMP123'"
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={handleDelete}>Delete Data</Button>
			</CardFooter>
		</Card>
	);
}

"use client";

import { DeleteCard } from "@/components/delete-card";
import { InsertCard } from "@/components/insert-card";
import { QueryCard } from "@/components/query-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateCard } from "@/components/update-card";
import { useState } from "react";

export default function AirlineDatabaseInterface() {
	const [selectedOption, setSelectedOption] = useState("");
	const [queryResult, setQueryResult] = useState("");

	const [insertData, setInsertData] = useState<Record<string, string>>({});

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option);
		setQueryResult("");
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Airline Database Interface</h1>
			<div className="grid grid-cols-2 gap-4 mb-4">
				<Button onClick={() => handleOptionSelect("query")}>1. Query</Button>
				<Button onClick={() => handleOptionSelect("insert")}>2. Insert</Button>
				<Button onClick={() => handleOptionSelect("delete")}>3. Delete</Button>
				<Button onClick={() => handleOptionSelect("update")}>4. Update</Button>
				<Button onClick={() => handleOptionSelect("")}>5. Quit</Button>
			</div>

			{selectedOption === "query" && (
				<QueryCard setQueryResult={setQueryResult} />
			)}

			{selectedOption === "insert" && (
				<InsertCard
					setQueryResult={setQueryResult}
					insertData={insertData}
					setInsertData={setInsertData}
				/>
			)}

			{selectedOption === "delete" && (
				<DeleteCard setQueryResult={setQueryResult} />
			)}

			{selectedOption === "update" && (
				<UpdateCard
					setQueryResult={setQueryResult}
					insertData={insertData}
					setInsertData={setInsertData}
				/>
			)}

			{queryResult && (
				<Card className="mt-4">
					<CardHeader>
						<CardTitle>Query Result</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
							{queryResult}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
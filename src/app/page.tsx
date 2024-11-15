"use client";

import { DeleteCard } from "@/components/delete-card";
import { InsertCard } from "@/components/insert-card";
import { QueryCard } from "@/components/query-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateCard } from "@/components/update-card";
import Link from "next/link";
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
		<div className="container mx-auto p-4 font-[family-name:var(--font-geist-sans)]">
			<Card className="mb-4">
				<CardHeader>
					<h1 className="text-2xl font-bold mb-4">
						airport database interface
					</h1>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-4 mb-4">
					<Button onClick={() => handleOptionSelect("query")}>query</Button>
					<Button onClick={() => handleOptionSelect("insert")}>insert</Button>
					<Button onClick={() => handleOptionSelect("delete")}>delete</Button>
					<Button onClick={() => handleOptionSelect("update")}>update</Button>
					<Button asChild>
						<Link href={"/map"}>map</Link>
					</Button>
					<Button onClick={() => handleOptionSelect("")}>quit</Button>
				</CardContent>
			</Card>

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
						<CardTitle>query result</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-[family-name:var(--font-geist-mono)]">
							{queryResult}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

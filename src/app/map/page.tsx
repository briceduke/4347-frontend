"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { scaleLinear } from "d3-scale";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Line,
	Marker,
} from "react-simple-maps";

interface AirportData {
	latLongs: Array<{ latitude: string; longitude: string }>;
	distance: number;
}

const geoUrl = "/world-countries.json";

const fetchAirportDistance = async (
	from: string,
	to: string,
): Promise<AirportData> => {
	const response = await fetch(`/api/distance?from=${from}&to=${to}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

export default function AirportDistanceMap() {
	const [fromAirport, setFromAirport] = useState("KATL");
	const [toAirport, setToAirport] = useState("KAUS");

	const { data, isLoading, isError, error, refetch } = useQuery<
		AirportData,
		Error
	>({
		queryKey: ["airportDistance", fromAirport, toAirport],
		queryFn: () => fetchAirportDistance(fromAirport, toAirport),
		enabled: false, // We'll manually trigger the query
	});

	const handleFetch = () => {
		refetch();
	};

	const colorScale = scaleLinear<string>()
		.domain([0, data?.distance || 2000])
		.range(["#FF5733", "#33FF57"]);

	return (
		<div className="container mx-auto p-4 font-[family-name:var(--font-geist-sans)]">
			<Card className="w-full max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle>airport distance map</CardTitle>
					<CardDescription className="flex justify-between items-center">
						enter airport codes to see the distance
						<Button asChild>
							<Link href={"/"}>back home</Link>
						</Button>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-2 mb-4">
						<Input
							placeholder="From (e.g., KATL)"
							value={fromAirport}
							onChange={(e) => setFromAirport(e.target.value)}
						/>
						<Input
							placeholder="To (e.g., KAUS)"
							value={toAirport}
							onChange={(e) => setToAirport(e.target.value)}
						/>
						<Button onClick={handleFetch} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								"fetch"
							)}
						</Button>
					</div>

					{isError && (
						<div className="text-red-500 mb-4">error: {error.message}</div>
					)}

					{data && (
						<div>
							<p className="mb-4">distance: {data.distance.toFixed(2)} km</p>
							<ComposableMap
								projection="geoMercator"
								projectionConfig={{
									scale: 150,
								}}
							>
								<Geographies geography={geoUrl}>
									{({ geographies }) =>
										geographies.map((geo) => (
											<Geography
												key={geo.rsmKey}
												geography={geo}
												fill="#EAEAEC"
												stroke="#D6D6DA"
											/>
										))
									}
								</Geographies>
								<Line
									from={[
										Number.parseFloat(data.latLongs[0].longitude),
										Number.parseFloat(data.latLongs[0].latitude),
									]}
									to={[
										Number.parseFloat(data.latLongs[1].longitude),
										Number.parseFloat(data.latLongs[1].latitude),
									]}
									stroke={colorScale(data.distance)}
									strokeWidth={2}
								/>
								{data.latLongs.map((point, index) => (
									<Marker
										key={`${index * 1}`}
										coordinates={[
											Number.parseFloat(point.longitude),
											Number.parseFloat(point.latitude),
										]}
									>
										<circle r={5} fill="#FF5533" />
									</Marker>
								))}
							</ComposableMap>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import Image from "next/image";
import image from "../../public/image.png";
import image2 from "../../public/image2.png";

const geistSans = localFont({
	src: "./fonts/ComicSansMS.ttf",
	variable: "--font-geist-sans",
	weight: "400 900",
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "4347 Project Frontend",
	description: "WIP",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Providers>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<Image
						src={image}
						alt="LEGO CITY"
						width={400}
						height={400}
						className="absolute -z-10 right-4 bottom-4"
					/>
					<Image
						src={image2}
						alt="LEGO CITY"
						width={400}
						height={400}
						className="absolute -z-10 left-4 bottom-4"
					/>
					{children}
				</body>
			</Providers>
		</html>
	);
}

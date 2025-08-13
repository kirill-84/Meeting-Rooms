import ThemeProvider from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AuthProvider from "./auth-provider";

const font = Inter({ subsets: ["cyrillic"] });
export const metadata: Metadata = {
	title: "Meeting Scheduler",
	description: "The better way to schedule your meetings."
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning={true}> {/* suppressHydrationWarning is important for next-themes */}
			<body className={font.className}>
				<AuthProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<Toaster />
						{children}
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

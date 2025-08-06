import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme/theme-select";
import SignInButton from "./auth-buttons";
import Image from 'next/image'

import Link from "next/link";

export default function Nav() {
	return (
		<nav className="sticky top-0 z-40 bg-background w-full flex flex-col gap-1 pt-1">
			<div className="flex items-center justify-between px-5 py-1">
				<Link href="/">
					<div className="flex items-center gap-1 ">
						<Image src='/logo.svg' width={100} height={100} alt='logo'
							   className='w-[150px] md:w-[200px]'
							   priority={false}
						/>
					</div>
				</Link>
				<div className="flex items-center justify-center gap-3">
					<div>
						<ThemeToggle />
					</div>
					<SignInButton botUsername={process.env.BOT_USERNAME} />
				</div>
			</div>
			<Separator />
		</nav>
	);
}

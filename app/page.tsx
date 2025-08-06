import { getServerSession } from "next-auth";
/*import { authOptions } from "@/app/api/auth/[...nextauth]/route";*/
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/navigation/nav";
import Hero from "./_components/Hero";

export default async function Home() {
	/*const session = await getServerSession(authOptions);

	if (!session) {
		return (
			<div className="flex justify-center mt-10">
				Not logged in to see this
			</div>
		);
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
	});*/

	return (
		<div className="h-full">
			<Nav/>
			<Hero/>
		</div>
		/*<div className="flex flex-col items-center mt-10">
			<h1>{user?.name}</h1>
			<h1 className="truncate max-w-[300px]">{user?.image}</h1>
			<h1>{user?.id}</h1>
			<h1>{user?.createdAt.getTime()}</h1>
		</div>*/
	);
}

"use client";

import { GoArrowLeft } from 'react-icons/go';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

const navigation = [
	{ name: "Projetos", href: "/projetos" },
	{ name: "Contato", href: "/contato" },
];

export const Navigation = () => {
	const searchParams = useSearchParams();
	const customUsername = searchParams.get('customUsername');

	return (
		<nav className="my-16 animate-fade-in">
			<ul className="flex items-center justify-center gap-4">
				{navigation.map((item) => (
					<Link
						key={item.href}
						href={item.href + (customUsername ? `?customUsername=${customUsername}` : '')}
						className="text-lg duration-500 text-zinc-500 hover:text-zinc-300"
					>
						{item.name}
					</Link>
				))}
			</ul>
		</nav>
	);
};

import { FaGithub } from "react-icons/fa";
import { GoMail, GoPerson } from 'react-icons/go';
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa"; 
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import data from "../../data.json";
import { getUser, getSocialAccounts } from "../data";

// TODO: make it edge once Turbopack supports it.
export const runtime = 'nodejs';

export default function Contacts({ searchParams }) {
    const { customUsername } = searchParams;
    const username = customUsername || process.env.GITHUB_USERNAME || data.githubUsername;
    const userData = getUser(username);
    const socialsData = getSocialAccounts(username);
    const [user, githubSocials] = [userData, socialsData];

    const email = user.email || data.email;
    const contacts = [];
    
    if (email) {
        contacts.push({
            icon: <GoMail size={20} />,
            href: "mailto:" + email,
            label: "E-mail", 
            handle: email,
        });
    }
    
    contacts.push({
        icon: <FaGithub size={20} />,
        href: "https://github.com/" + username,
        label: "GitHub",
        handle: username,
    });

    contacts.push({
        icon: <FaLinkedin size={20} />,
        href: "https://linkedin.com/in/felipemch",
        label: "LinkedIn",
        handle: "felipemch",
    });

    // Check if githubSocials is an array before using forEach
    if (Array.isArray(githubSocials)) {
        githubSocials.forEach((s) => {
            if (s.provider === "twitter") {
                contacts.push({
                    icon: <FaTwitter size={20} />,
                    href: s.url,
                    label: "Twitter",
                    handle: "@" + s.url.split("/").pop(),
                });
            }
        });
    }

    return (
        <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
            <Navigation customUsername={username} />
            <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
                <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
                    <div className="flex justify-start mb-4">
                        <Link href="/" className="btn btn-primary">Voltar para a Página Principal</Link>
                    </div>
                    {contacts.map((s) => {
                        return (
                            <Card key={s.href}>
                                <Link
                                    href={s.href}
                                    target="_blank"
                                    className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
                                >
                                    <span
                                        className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                                        aria-hidden="true"
                                    />
                                    <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                                        {s.icon}
                                    </span>{" "}
                                    <div className="z-10 flex flex-col items-center">
                                        <span className="text-xl font-medium duration-150 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                                            {s.handle}
                                        </span>
                                        <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                                            {s.label}
                                        </span>
                                    </div>
                                </Link>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

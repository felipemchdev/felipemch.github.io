import React from "react";
import { Navigation } from "../components/nav";
import data from "../../data.json";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../components/card";

// Modificando para acessar os parâmetros diretamente no componente, sem getServerSideProps
export default async function CertificatesPage({ searchParams }) {
    // Acessando customUsername diretamente dos searchParams
    const { customUsername } = searchParams;

    return (
        <div className="relative pb-16">
            <Navigation customUsername={customUsername} />
            <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-12 md:pt-24 lg:pt-32">
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                        Certificados
                    </h2>
                    <p className="mt-4 text-zinc-400">
                        Meus certificados e conquistas profissionais
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
                    {data.certificates.map((cert, i) => (
                        <Card key={i}>
                            <Link
                                href={cert.link}
                                target="_blank"
                                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
                            >
                                <span
                                    className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                                    aria-hidden="true"
                                />
                                <div className="relative z-10 w-64 h-40 overflow-hidden rounded-lg">
                                    <Image
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="z-10 flex flex-col items-center">
                                    <span className="text-xl font-medium duration-150 lg:text-2xl text-zinc-200 group-hover:text-white font-display">
                                        {cert.title}
                                    </span>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

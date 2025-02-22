import Image from "next/image";
import Link from "next/link";
import { Card } from "./card";
import data from "../../data.json";

export const Certificates = () => {
    return (
        <div className="my-16 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-zinc-200 mb-8">Certificados</h2>
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
    );
};

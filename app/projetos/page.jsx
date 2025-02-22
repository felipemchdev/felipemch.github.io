import React, { Suspense } from "react";
import { Navigation } from "../components/nav";
import data from "../../data.json";
import ProjectsComponent from "./projects";
import Link from "next/link";

export default function ProjectsPage({ searchParams }) {
    const { customUsername } = searchParams;
    const username = customUsername || process.env.GITHUB_USERNAME || data.githubUsername;

    return (
        <div className="relative pb-16">
            <Navigation />
            <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-12 md:pt-24 lg:pt-32">
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                        Projetos
                    </h2>
                    <p className="mt-4 text-zinc-400">
                        {customUsername ? `Projetos de ${customUsername}` : data.description}
                        {/* <pre>{JSON.stringify(vercelProjects.projects[1], null, 4)}</pre> */}
                    </p>
                </div>
                <div className="flex justify-between mb-8">
                    <Link href="/" className="btn btn-primary">Voltar para a Página Principal</Link>
                </div>
                <Suspense fallback={<div className="text-lg text-zinc-500">Carregando...</div>}>
                    <ProjectsComponent username={username} />
                </Suspense>
            </div>
        </div>
    );
}

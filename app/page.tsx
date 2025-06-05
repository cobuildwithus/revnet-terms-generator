import { SparklesIcon } from "@/components/ui/sparkles";
import Image from "next/image";
import { AnalyzeForm } from "./analyzer/form";
import BackgroundImage from "./bg.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative -mt-[var(--header-height)]">
      <div className="absolute inset-0">
        <Image
          src={BackgroundImage}
          alt=" "
          fill
          className="object-cover mix-blend-multiply grayscale-100 opacity-10 dark:opacity-75"
        />
      </div>
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pt-28 pb-16 relative">
        <div className="text-center">
          <div className="inline-flex items-center bg-secondary/75 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
            <SparklesIcon className="mr-2 text-yellow-500" size={16} />
            AI Generator
          </div>

          <h1 className="mt-6 text-5xl sm:text-6xl font-bold mb-6 text-balance">
            Generate your <span className="text-primary">revnet</span> terms in minutes
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Describe your project and let our tool generate optimal tokenomics terms. Get revnet
            terms without the complexity.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <AnalyzeForm />
        </div>
      </main>
    </div>
  );
}

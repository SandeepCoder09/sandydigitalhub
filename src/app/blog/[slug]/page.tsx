import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { readData } from "@/lib/db";

// In Next.js 15 App router, params is a Promise
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await readData("posts.json");
  const post = posts.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-md">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>
          <div className="whitespace-pre-line text-foreground/90">
            {/* In a real app, render markdown or rich text here */}
            {post.content}
            <br/><br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            <br/><br/>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </article>
      </div>
    </div>
  );
}

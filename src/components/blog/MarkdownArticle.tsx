import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownArticleProps {
  className?: string;
  content: string;
}

export function MarkdownArticle({ className, content }: MarkdownArticleProps) {
  return (
    <div
      className={cn(
        "space-y-5 text-base leading-8 text-muted-foreground [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_h2]:pt-6 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:pt-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:text-foreground",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { normalizeMathMarkdown } from "@/utils/markdownMath";

import CodeBlock from "./CodeBlock";


/**
 * Builds themed Markdown component overrides for assistant messages.
 */
function getMarkdownComponents(isDarkMode) {
    return {
        h1: ({ node, ...props }) => <h1 className="mb-3 mt-4 text-2xl font-semibold leading-tight" {...props} />,
        h2: ({ node, ...props }) => <h2 className="mb-2 mt-4 text-xl font-semibold leading-tight" {...props} />,
        h3: ({ node, ...props }) => <h3 className="mb-2 mt-3 text-lg font-semibold leading-tight" {...props} />,
        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
        ul: ({ node, ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
        ol: ({ node, ...props }) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />,
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote
                className={`my-3 border-l-4 pl-4 italic ${isDarkMode ? "border-[#4f7cff] text-[#b7c8ea]" : "border-[#aac2ff] text-[#475467]"}`}
                {...props}
            />
        ),
        hr: () => <hr className={`my-5 ${isDarkMode ? "border-[#2f3d5f]" : "border-[#d8e0ef]"}`} />,
        table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto">
                <table className={`w-full border-collapse text-left text-sm ${isDarkMode ? "border-[#2f3d5f]" : "border-[#d8e0ef]"}`} {...props} />
            </div>
        ),
        th: ({ node, ...props }) => (
            <th className={`border px-3 py-2 font-semibold ${isDarkMode ? "border-[#2f3d5f] bg-[#17223a]" : "border-[#d8e0ef] bg-[#f7f8fb]"}`} {...props} />
        ),
        td: ({ node, ...props }) => (
            <td className={`border px-3 py-2 align-top ${isDarkMode ? "border-[#2f3d5f]" : "border-[#d8e0ef]"}`} {...props} />
        ),
        a: ({ node, ...props }) => (
            <a className="text-[#356dff] underline underline-offset-2 hover:text-[#1f55d6]" target="_blank" rel="noreferrer" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");

            if (match || codeText.includes("\n")) {
                return (
                    <CodeBlock isDarkMode={isDarkMode} language={match?.[1]}>
                        {codeText}
                    </CodeBlock>
                );
            }

            return (
                <code
                    className={`rounded px-1.5 py-0.5 ${isDarkMode ? "bg-[#17223a] text-[#eef4ff]" : "bg-[#eef3ff] text-[#101828]"}`}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        pre: ({ node, ...props }) => <pre className="overflow-x-auto" {...props} />
    };
}


/**
 * Renders assistant Markdown with GFM, math, and syntax highlighting enabled.
 */
export default function MarkdownMessage({ content, isDarkMode }) {
    return (
        <div className="prose prose-sm max-w-full break-words">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                components={getMarkdownComponents(isDarkMode)}
            >
                {normalizeMathMarkdown(content)}
            </ReactMarkdown>
        </div>
    );
}

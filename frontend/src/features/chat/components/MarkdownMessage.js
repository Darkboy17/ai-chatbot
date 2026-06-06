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
                className={`my-3 border-l-4 pl-4 italic ${isDarkMode ? "border-[#41636a] text-[#c5d0dc]" : "border-[#9ecbd1] text-[#4e6074]"}`}
                {...props}
            />
        ),
        hr: () => <hr className={`my-5 ${isDarkMode ? "border-[#2b3747]" : "border-[#dce6ef]"}`} />,
        table: ({ node, ...props }) => (
            <div className="my-4 w-full max-w-full overflow-x-auto">
                <table className={`w-full min-w-max border-collapse text-left text-sm ${isDarkMode ? "border-[#2b3747]" : "border-[#dce6ef]"}`} {...props} />
            </div>
        ),
        th: ({ node, ...props }) => (
            <th className={`border px-3 py-2 font-semibold ${isDarkMode ? "border-[#2b3747] bg-[#171d27]" : "border-[#dce6ef] bg-[#eef3f8]"}`} {...props} />
        ),
        td: ({ node, ...props }) => (
            <td className={`border px-3 py-2 align-top ${isDarkMode ? "border-[#2b3747]" : "border-[#dce6ef]"}`} {...props} />
        ),
        a: ({ node, ...props }) => (
            <a className="text-[#246b70] underline underline-offset-2 hover:text-[#1d5b60]" target="_blank" rel="noreferrer" {...props} />
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
                    className={`rounded px-1.5 py-0.5 ${isDarkMode ? "bg-[#171d27] text-[#eef3f8]" : "bg-[#e8f3f4] text-[#172033]"}`}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        pre: ({ node, ...props }) => <pre className="w-full max-w-full overflow-x-auto" {...props} />
    };
}


/**
 * Renders assistant Markdown with GFM, math, and syntax highlighting enabled.
 */
export default function MarkdownMessage({ content, isDarkMode }) {
    return (
        <div className="prose prose-sm w-full min-w-0 max-w-full break-words">
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

"use client";

import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";


/**
 * Renders a syntax-highlighted code block with copy support.
 */
export default function CodeBlock({ children, isDarkMode, language }) {
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, "");

    const copyCode = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = code;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch (error) {
            toast.error("Failed to copy code");
        }
    };

    return (
        <div className={`my-3 overflow-hidden rounded-[18px] border ${isDarkMode ? "border-[#2f3d5f] bg-[#111c31]" : "border-[#d8e0ef] bg-white"}`}>
            <div className={`flex h-10 items-center justify-between border-b px-3 ${isDarkMode ? "border-[#2f3d5f] bg-[#0b1220]" : "border-[#e6e9f0] bg-[#f7f8fb]"}`}>
                <span className={`text-xs font-semibold ${isDarkMode ? "text-[#8fa2c9]" : "text-[#667085]"}`}>
                    {language || "code"}
                </span>
                <button
                    type="button"
                    onClick={copyCode}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDarkMode ? "text-[#dbe7ff] hover:bg-[#17223a]" : "text-[#475467] hover:bg-[#eaf1ff]"}`}
                    aria-label={copied ? "Code copied" : "Copy code"}
                    title={copied ? "Copied" : "Copy code"}
                >
                    {copied ? <FaCheck className="h-3.5 w-3.5" /> : <FaCopy className="h-3.5 w-3.5" />}
                </button>
            </div>
            <SyntaxHighlighter
                PreTag="div"
                language={language || "text"}
                style={isDarkMode ? oneDark : oneLight}
                customStyle={{
                    borderRadius: 0,
                    margin: 0,
                    padding: "16px",
                    border: "0",
                    background: "transparent"
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

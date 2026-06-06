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
        <div className={`my-3 w-full min-w-0 max-w-full overflow-hidden rounded-[18px] border ${isDarkMode ? "border-[#2b3747] bg-[#121820]" : "border-[#dce6ef] bg-white"}`}>
            <div className={`flex h-10 items-center justify-between border-b px-3 ${isDarkMode ? "border-[#2b3747] bg-[#0f141d]" : "border-[#dce6ef] bg-[#eef3f8]"}`}>
                <span className={`text-xs font-semibold ${isDarkMode ? "text-[#8997a8]" : "text-[#647187]"}`}>
                    {language || "code"}
                </span>
                <button
                    type="button"
                    onClick={copyCode}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDarkMode ? "text-[#dce8ef] hover:bg-[#171d27]" : "text-[#647187] hover:bg-[#e8f3f4]"}`}
                    aria-label={copied ? "Code copied" : "Copy code"}
                    title={copied ? "Copied" : "Copy code"}
                >
                    {copied ? <FaCheck className="h-3.5 w-3.5" /> : <FaCopy className="h-3.5 w-3.5" />}
                </button>
            </div>
            <div className="w-full max-w-full overflow-x-auto">
                <SyntaxHighlighter
                    PreTag="div"
                    language={language || "text"}
                    style={isDarkMode ? oneDark : oneLight}
                    customStyle={{
                        borderRadius: 0,
                        margin: 0,
                        padding: "16px",
                        border: "0",
                        background: "transparent",
                        minWidth: "max-content",
                        overflowX: "visible"
                    }}
                    lineProps={{
                        style: {
                            whiteSpace: "pre"
                        }
                    }}
                    codeTagProps={{
                        style: {
                            whiteSpace: "pre"
                        }
                    }}
                    wrapLongLines={false}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

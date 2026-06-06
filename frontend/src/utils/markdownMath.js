/**
 * Normalizes plain-text math fragments into valid LaTeX syntax.
 */
export function convertPlainMathExpression(expression) {
    let lowerLimit = "";
    let upperLimit = "";
    let normalized = expression.trim().replace(/\.$/, "");
    const limitsMatch = normalized.match(/\s+from\s+([a-zA-Z])\s*=\s*([^\s]+)\s+to\s+([a-zA-Z0-9_{}\\]+)$/i);

    if (limitsMatch) {
        lowerLimit = `${limitsMatch[1]}=${limitsMatch[2]}`;
        upperLimit = limitsMatch[3];
        normalized = normalized.slice(0, limitsMatch.index).trim();
    }

    normalized = normalized
        .replace(/â‰ˆ/g, "\\approx")
        .replace(/â‰¤/g, "\\le")
        .replace(/â‰¥/g, "\\ge")
        .replace(/Ã—/g, "\\times")
        .replace(/Ã·/g, "\\div")
        .replace(/[âˆ†Î”]\s*([a-zA-Z])/g, "\\Delta $1")
        .replace(/([a-zA-Z0-9)])Â²/g, "$1^2")
        .replace(/([a-zA-Z0-9)])Â³/g, "$1^3")
        .replace(/âˆš\s*\(([^()]+)\)/g, "\\sqrt{$1}")
        .replace(/âˆš\s*\[([^\]]+)\]/g, "\\sqrt{$1}");

    const sumLimits = lowerLimit ? `_{${lowerLimit}}^{${upperLimit}}` : "";
    return normalized
        .replace(/âˆ‘\s*\[([^\]]+)\]/g, `\\sum${sumLimits} \\left[$1\\right]`)
        .replace(/âˆ‘/g, `\\sum${sumLimits}`);
}


/**
 * Wraps a single malformed math-looking line in block math when needed.
 */
export function normalizePlainMathLine(line) {
    const trimmed = line.trim();
    const hasStrongMathSymbol = /[â‰ˆâ‰¤â‰¥âˆ‘âˆš]/.test(trimmed);
    const hasFormulaStructure = /[Â²Â³]/.test(trimmed) && /[=+\-*/]/.test(trimmed);

    if (!trimmed || trimmed.includes("$") || (!hasStrongMathSymbol && !hasFormulaStructure)) {
        return line;
    }

    const prefixMatch = trimmed.match(/^(.{1,60}:\s*)(.+)$/);
    const prefix = prefixMatch?.[1] || "";
    const expression = prefixMatch?.[2] || trimmed;
    const expressionHasStrongMathSymbol = /[â‰ˆâ‰¤â‰¥âˆ‘âˆš]/.test(expression);
    const expressionHasFormulaStructure = /[Â²Â³]/.test(expression) && /[=+\-*/]/.test(expression);

    if (!expressionHasStrongMathSymbol && !expressionHasFormulaStructure) {
        return line;
    }

    return `${prefix ? `${prefix}\n\n` : ""}$$\n${convertPlainMathExpression(expression)}\n$$`;
}


/**
 * Normalizes Markdown math delimiters without touching fenced code blocks.
 */
export function normalizeMathMarkdown(content = "") {
    return content
        .split(/(```[\s\S]*?```)/g)
        .map(part => {
            if (part.startsWith("```")) return part;

            return part
                .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$\n${equation.trim()}\n$$`)
                .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation.trim()}$`)
                .split("\n")
                .map(normalizePlainMathLine)
                .join("\n");
        })
        .join("");
}

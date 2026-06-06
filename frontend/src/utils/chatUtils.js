const categories = [
    {
        iconType: 'code',
        color: 'bg-indigo-100 text-indigo-700',
        keywords: ['api', 'app', 'bug', 'code', 'component', 'css', 'debug', 'error', 'frontend', 'html', 'javascript', 'next', 'node', 'program', 'python', 'react', 'script', 'typescript']
    },
    {
        iconType: 'database',
        color: 'bg-cyan-100 text-cyan-700',
        keywords: ['database', 'db', 'mongo', 'mongodb', 'postgres', 'query', 'sql', 'storage']
    },
    {
        iconType: 'math',
        color: 'bg-emerald-100 text-emerald-700',
        keywords: ['algebra', 'calculus', 'equation', 'formula', 'math', 'probability', 'statistics']
    },
    {
        iconType: 'writing',
        color: 'bg-rose-100 text-rose-700',
        keywords: ['article', 'blog', 'copy', 'draft', 'email', 'essay', 'letter', 'paragraph', 'poem', 'rewrite', 'story', 'write', 'writing']
    },
    {
        iconType: 'idea',
        color: 'bg-amber-100 text-amber-700',
        keywords: ['brainstorm', 'idea', 'plan', 'strategy', 'think']
    },
    {
        iconType: 'research',
        color: 'bg-blue-100 text-blue-700',
        keywords: ['analyze', 'compare', 'explain', 'find', 'learn', 'research', 'summary', 'summarize']
    },
    {
        iconType: 'design',
        color: 'bg-violet-100 text-violet-700',
        keywords: ['color', 'design', 'font', 'image', 'layout', 'style', 'ui', 'ux', 'visual']
    },
    {
        iconType: 'business',
        color: 'bg-slate-200 text-slate-700',
        keywords: ['business', 'customer', 'market', 'marketing', 'money', 'price', 'product', 'sales']
    }
];

const fallbackColors = [
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-cyan-100 text-cyan-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-slate-200 text-slate-700'
];

/**
 * Produces a stable array index for deterministic visual choices.
 */
const getStableIndex = (value, length) => {
    const source = value || '';
    let hash = 0;

    for (let i = 0; i < source.length; i += 1) {
        hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
    }

    return hash % length;
};

/**
 * Joins searchable conversation text into one normalized string.
 */
const getConversationText = (conversation) => (
    `${conversation.title || ''} ${conversation.description || ''}`.toLowerCase()
);

/**
 * Finds the first semantic category that matches a conversation.
 */
const getMatchingCategory = (conversation) => {
    const text = getConversationText(conversation);

    return categories.find(category => (
        category.keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(text))
    ));
};

/**
 * Chooses the conversation icon type and color classes.
 */
export const getIconAndColor = (conversation) => {
    const key = conversation.conversation_id || conversation.title || conversation.created_at || '';
    const category = getMatchingCategory(conversation);

    if (category) {
        return {
            iconType: category.iconType,
            color: category.color
        };
    }

    return {
        iconType: 'chat',
        color: fallbackColors[getStableIndex(`${key}-color`, fallbackColors.length)]
    };
};

/**
 * Returns a date clamped to the beginning of its local day.
 */
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Calculates how many local days separate today and the target date.
 */
const getDayDifference = (date) => {
    const today = startOfDay(new Date());
    const target = startOfDay(date);

    return Math.floor((today.getTime() - target.getTime()) / 86400000);
};

/**
 * Formats older conversations by month and year.
 */
const getOlderSectionLabel = (date) => (
    date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
    })
);

/**
 * Groups conversations into sidebar recency sections.
 */
export const groupConversationsByRecency = (conversations) => {
    const sections = [];
    const sectionMap = new Map();

    const getSection = (label) => {
        if (!sectionMap.has(label)) {
            const section = { label, items: [] };
            sectionMap.set(label, section);
            sections.push(section);
        }

        return sectionMap.get(label);
    };

    conversations.forEach((conversation) => {
        const createdAt = new Date(conversation.created_at);
        const dayDifference = Number.isNaN(createdAt.getTime()) ? 31 : getDayDifference(createdAt);
        let label = getOlderSectionLabel(createdAt);

        if (dayDifference === 0) {
            label = 'Today';
        } else if (dayDifference === 1) {
            label = 'Yesterday';
        } else if (dayDifference <= 7) {
            label = 'Previous 7 Days';
        } else if (dayDifference <= 30) {
            label = 'Previous 30 Days';
        }

        getSection(label).items.push(conversation);
    });

    return sections.filter(section => section.items.length > 0);
};

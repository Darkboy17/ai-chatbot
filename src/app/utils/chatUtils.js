import { isToday, isYesterday, isWithinInterval, subDays } from 'date-fns';

export const getRandomIconAndColor = () => {

    const icons = [
        '🌟', '🔄', '💻', '🤖', '🔧', '⚡', '⚠️', '🔨',
        '🚀', '🎉', '🔥', '💡', '📚', '📈', '📉', '📊',
        '📅', '📆', '📋', '📌', '📍', '📎', '📏', '📐',
        '✂️', '🖊️', '🖋️', '🖌️', '🖍️', '📝', '🗒️', '🗓️',
        '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📜',
        '📄', '📃', '📑', '📊', '📈', '📉', '📆', '📅',
        '📂', '📁', '📇', '📋', '📌', '📍', '📎', '📏',
        '📐', '📑', '📒', '📓', '📔', '📕', '📖', '📗',
        '📘', '📙', '📚', '📛', '📜', '📝', '📞', '📟',
        '📠', '📡', '📢', '📣', '📤', '📥', '📦', '📧'
    ];

    const colors = [
        'bg-green-400', 'bg-emerald-400', 'bg-blue-400', 'bg-purple-400',
        'bg-gray-700', 'bg-indigo-900', 'bg-red-800', 'bg-yellow-800',
        'bg-teal-800', 'bg-pink-800', 'bg-orange-800', 'bg-lime-800',
        'bg-cyan-800', 'bg-violet-800', 'bg-rose-800', 'bg-amber-800',
        'bg-green-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500',
        'bg-gray-800', 'bg-indigo-800', 'bg-red-700', 'bg-yellow-700',
        'bg-teal-700', 'bg-pink-700', 'bg-orange-700', 'bg-lime-700',
        'bg-cyan-700', 'bg-violet-700', 'bg-rose-700', 'bg-amber-700',
        'bg-green-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600',
        'bg-gray-900', 'bg-indigo-700', 'bg-red-600', 'bg-yellow-600',
        'bg-teal-600', 'bg-pink-600', 'bg-orange-600', 'bg-lime-600',
        'bg-cyan-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600',
        'bg-green-300', 'bg-emerald-300', 'bg-blue-300', 'bg-purple-300',
        'bg-gray-600', 'bg-indigo-600', 'bg-red-500', 'bg-yellow-500',
        'bg-teal-500', 'bg-pink-500', 'bg-orange-500', 'bg-lime-500',
        'bg-cyan-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500'
    ];

    return {
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
    };
};

export const groupConversationsByDate = (conversations) => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const grouped = conversations.reduce((acc, conversation) => {
        const date = new Date(conversation.created_at);
        const { icon, color } = getRandomIconAndColor();

        const enrichedConversation = {
            ...conversation,
            icon,
            color
        };

        if (isToday(date)) {
            if (!acc.find(g => g.section === 'Today')) {
                acc.push({ section: 'Today', items: [] });
            }
            acc.find(g => g.section === 'Today').items.push(enrichedConversation);
        }
        else if (isYesterday(date)) {
            if (!acc.find(g => g.section === 'Yesterday')) {
                acc.push({ section: 'Yesterday', items: [] });
            }
            acc.find(g => g.section === 'Yesterday').items.push(enrichedConversation);
        }
        else if (isWithinInterval(date, { start: sevenDaysAgo, end: today })) {
            if (!acc.find(g => g.section === 'Last 7 Days')) {
                acc.push({ section: 'Last 7 Days', items: [] });
            }
            acc.find(g => g.section === 'Last 7 Days').items.push(enrichedConversation);
        }

        return acc;
    }, []);

    return grouped.filter(section => section.items.length > 0);
};
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
    return (
        <div className="markdown-ai-response">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-[var(--accent)]">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2 text-[var(--accent)]">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5 text-[var(--text-primary)]">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-sm font-semibold mt-2 mb-1 text-[var(--text-primary)]">{children}</h4>,
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-[var(--text-primary)]">{children}</strong>,
                    em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 pl-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 pl-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                    hr: () => <hr className="my-3 border-[var(--border)] opacity-50" />,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-3 border-[var(--accent)] pl-3 py-1 my-2 bg-[var(--accent)]/5 rounded-r-lg text-sm italic">
                            {children}
                        </blockquote>
                    ),
                    code: ({ inline, children }) =>
                        inline ? (
                            <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                        ) : (
                            <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg my-2 overflow-x-auto">
                                <code className="text-xs font-mono">{children}</code>
                            </pre>
                        ),
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline hover:opacity-80 transition-opacity">
                            {children}
                        </a>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-2 rounded-lg border border-[var(--border)]">
                            <table className="w-full text-xs">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
                    th: ({ children }) => <th className="px-3 py-2 text-left font-semibold border-b border-[var(--border)]">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border-b border-[var(--border)]">{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

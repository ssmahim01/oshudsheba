interface Props {
  content: string;
}

export function BlogContent({ content }: Props) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="
          prose prose-gray dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-[#007BFF] dark:prose-a:text-[#007BFF] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-img:rounded-xl prose-img:shadow-md
          prose-blockquote:border-l-[#007BFF]0 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-code:text-[#007BFF] dark:prose-code:text-amber-300 prose-code:bg-[#007BFF] dark:prose-code:bg-[#007BFF]/20
          prose-ul:text-gray-700 dark:prose-ul:text-gray-300
          prose-ol:text-gray-700 dark:prose-ol:text-gray-300
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Plain text: render as paragraphs split by newlines
  return (
    <div className="space-y-4">
      {content.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}
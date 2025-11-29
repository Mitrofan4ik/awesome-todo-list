interface HighlightTextProps {
  text: string;
  query: string;
}

export const HighlightText = ({ text, query }: HighlightTextProps) => {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="highlight">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
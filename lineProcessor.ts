type LineProcessor = (lines: string[]) => string[];

export const trimLines: LineProcessor = (lines) =>
  lines.map((line) => line.trim());

export const indentJapaneseNovel: LineProcessor = (lines) => {
  const BRACKET_PAIRS: Record<string, string> = {
    "「": "」",
    "『": "』",
    "（": "）",
    "［": "］",
    "【": "】",
    "〔": "〕",
    "〈": "〉",
    "《": "》",
  };

  let activeClosingBracket: string | null = null;

  return lines.map((line) => {
    if (!line) {
      return line;
    }

    if (line.startsWith("　")) {
      if (activeClosingBracket && line.endsWith(activeClosingBracket)) {
        activeClosingBracket = null;
      }
      return line;
    }

    if (activeClosingBracket) {
      if (activeClosingBracket && line.endsWith(activeClosingBracket)) {
        activeClosingBracket = null;
      }
      return `　${line}`;
    }

    const firstChar = line[0];
    const closing = BRACKET_PAIRS[firstChar];

    if (closing) {
      const hasClosing = line.endsWith(closing);
      const isEndWithClosing = line.trimEnd().endsWith(closing);

      if (hasClosing && isEndWithClosing) {
        return line;
      } else if (!hasClosing) {
        activeClosingBracket = closing;
        return line;
      }
    }

    return `　${line}`;
  });
};

export const all: LineProcessor[] = [
  indentJapaneseNovel,
];

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

  return lines.map((line) => {
    if (!line || line.startsWith("　")) {
      return line;
    }

    const firstChar = line.trimStart().charAt(0);
    const bracket = BRACKET_PAIRS[firstChar];
    if (!bracket) {
      return `　${line}`;
    }

    return line.trimEnd().at(-1) === bracket ? line : `　${line}`;
  });
};

export const all: LineProcessor[] = [
  indentJapaneseNovel,
];

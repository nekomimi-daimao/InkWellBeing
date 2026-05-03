import * as path from "jsr:@std/path";
import * as cli from "jsr:@std/cli/parse-args";
import * as lineProcessor from "./lineProcessor.ts";

async function format() {
  const args = cli.parseArgs(Deno.args);
  const [inputPathRaw] = args._;

  if (!inputPathRaw) {
    console.error("deno run --allow-read --allow-write format.ts <file_path>");
    Deno.exit(1);
  }

  const inputPath = String(inputPathRaw);

  try {
    const content = await Deno.readTextFile(inputPath);
    const lines = content.split(/\r?\n/);

    const formatted = doFormat(lines);

    const parsedPath = path.parse(inputPath);
    const newFileName = `${parsedPath.name}_${parsedPath.ext}`;
    const outputPath = path.join(parsedPath.dir, newFileName);
    await Deno.writeTextFile(outputPath, formatted.join("\n"));

    console.log("done");
    console.log(outputPath);
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  format();
}

export function doFormat(raw: string[]): string[] {
  let formatted = structuredClone(raw);
  for (const e of lineProcessor.all) {
    formatted = e(formatted);
  }
  return formatted;
}

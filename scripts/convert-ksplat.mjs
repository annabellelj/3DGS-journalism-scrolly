import fs from "node:fs/promises";
import path from "node:path";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

if (!globalThis.window) {
  globalThis.window = {
    setTimeout,
    clearTimeout,
  };
}

const [, , inputPath, outputPath, compressionArg, minAlphaArg] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/convert-ksplat.mjs <input.ply> <output.ksplat> [compressionLevel=1] [minAlpha=5]");
  process.exit(1);
}

const compressionLevel = Number.isFinite(Number(compressionArg)) ? Number(compressionArg) : 1;
const minAlpha = Number.isFinite(Number(minAlphaArg)) ? Number(minAlphaArg) : 5;

const resolvedInput = path.resolve(inputPath);
const resolvedOutput = path.resolve(outputPath);

const plyData = await fs.readFile(resolvedInput);
const arrayBuffer = plyData.buffer.slice(plyData.byteOffset, plyData.byteOffset + plyData.byteLength);

const splatBuffer = await GaussianSplats3D.PlyLoader.loadFromFileData(
  arrayBuffer,
  minAlpha,
  compressionLevel,
  true,
  0
);

await fs.writeFile(resolvedOutput, Buffer.from(splatBuffer.bufferData));

console.log(`Wrote ${resolvedOutput}`);

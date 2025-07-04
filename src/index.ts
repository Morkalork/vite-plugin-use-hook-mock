import type { PluginOption } from "vite";
import fs from "fs";
import path from "path";

export interface UseHookMockPluginOptions {
  /**
   * File extensions to try when looking for mock files.
   * (default ['.ts', '.tsx', '.js', '.jsx'])
   */
  extensions?: string[];
  /**
   * Regex to identify hook imports you want to mock.
   * Should match the import path *without* extension.
   * (default /(^|\/)use-[^\/]+$/)
   */
  hookPattern?: RegExp;
}

export default function useHookMockPlugin(
  options: UseHookMockPluginOptions = {}
): PluginOption {
  const exts = (options as any).extensions ?? [".ts", ".tsx", ".js", ".jsx"];
  const hookPattern = (options as any).hookPattern ?? /(^|\/)use-[^\/]+$/;

  const plugin: PluginOption = {
    name: "vite-plugin-use-hook-mock",
    enforce: "pre",
    async resolveId(importee, importer) {
      if (
        !importer ||
        importee.startsWith("\0") ||
        /^[a-z]+:\/\//i.test(importee) ||
        importee.startsWith("/")
      ) {
        return null;
      }

      const clean = importee.split("?")[0].split("#")[0];
      if (!hookPattern.test(clean)) {
        return null;
      }

      const basedir = path.dirname(importer);
      for (const ext of exts) {
        const mockPath = path.resolve(basedir, `${clean}.mock${ext}`);
        if (fs.existsSync(mockPath)) {
          const resolved = await this.resolve(mockPath, importer, {
            skipSelf: true,
          });
          if (resolved) {
            return resolved.id;
          }
        }
      }

      return null;
    },
  };

  return plugin;
}

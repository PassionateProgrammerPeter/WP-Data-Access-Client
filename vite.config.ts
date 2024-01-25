import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ mode }) => {

	return {
		plugins: [
			react()
		],
		base: "./",
		build: {
			outDir: "./build",
			emptyOutDir: true,
			sourcemap: false,
			minify: "esbuild",
			rollupOptions: {
				input: "src/main.tsx",
				output: {
					entryFileNames: `[name].js`,
					chunkFileNames: `[name]-[hash].js`,
					assetFileNames: `[name]-[hash].[ext]`
				}
			}
		}
	}

})

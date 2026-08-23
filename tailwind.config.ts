import { Config } from "tailwindcss";
import { createRequire } from "node:module";

const nativewindPreset = createRequire(import.meta.url)("nativewind/preset");

type CustomConfig = Config & {
    safelist?: (string | { pattern: RegExp; variants?: string[] })[];
};

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./types/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [nativewindPreset],
    plugins: [],
    theme: {
        extend: {
            maxWidth: {
                "250": "1000px",
            },
            fontFamily: {
                pretendard: ["Pretendard-Regular"],
                "pretendard-medium": ["Pretendard-Medium"],
                "pretendard-semibold": ["Pretendard-SemiBold"],
                "pretendard-bold": ["Pretendard-Bold"],
                "pretendard-extrabold": ["Pretendard-ExtraBold"],
            },
            colors: {
                background: {
                    default: "var(--background)",
                    paper: "var(--surface)",
                    deep: "var(--background-deep)",
                },
                text: {
                    default: "var(--text)",
                    secondary: "var(--text-secondary)",
                    disabled: "var(--text-disabled)",
                    light: "var(--text-light)",
                },
                divider: "var(--border)",

                primary: {
                    main: "var(--primary)",
                    hover: "var(--hover)",
                    active: "var(--active)",
                    light: "var(--light)",
                    contrast: "var(--text-light)",
                },
                secondary: {
                    main: "var(--secondary)",
                    chart: "var(--secondary-chart)",
                    contrast: "var(--text-light)",
                },
                error: {
                    main: "var(--error)",
                    contrast: "var(--text-light)",
                    light: "var(--error-light)",
                },
                success: {
                    main: "var(--success)",
                    contrast: "var(--text-light)",
                    light: "var(--success-light)",
                },
                warning: {
                    main: "var(--warning)",
                    contrast: "var(--text-light)",
                    light: "var(--warning-light)",
                },
            },
        },
    },
    safelist: [
        {
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning)-(main|hover|active|light|contrast)/,
        },
    ],
} satisfies CustomConfig;

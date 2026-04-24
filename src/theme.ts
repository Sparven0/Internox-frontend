import {
  createLightTheme,
  type BrandVariants,
  type Theme,
} from "@fluentui/react-components";

const internoxBrand: BrandVariants = {
  10: "#f0fdf7",
  20: "#d6f7e9",
  30: "#adefcf",
  40: "#7de6b4",
  50: "#4ddc99",
  60: "#1fd47f",
  70: "#00c06b",
  80: "#00a85d",
  90: "#008f4f",
  100: "#007642",
  110: "#005e34",
  120: "#004726",
  130: "#003019",
  140: "#001a0d",
  150: "#000d06",
  160: "#000300",
};

const baseTheme: Theme = createLightTheme(internoxBrand);

export const internoxTheme: Theme = {
  ...baseTheme,

  // Fonts
  fontFamilyBase: "'DM Sans', sans-serif",
  fontFamilyNumeric: "'DM Sans', sans-serif",
  fontFamilyMonospace: "monospace",

  // Font sizes
  fontSizeBase100: "11px",
  fontSizeBase200: "12px",
  fontSizeBase300: "14px",
  fontSizeBase400: "16px",
  fontSizeBase500: "20px",
  fontSizeBase600: "24px",
  fontSizeHero700: "36px",

  // Font weights
  fontWeightRegular: 400,
  fontWeightMedium: 400,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  // Backgrounds
  colorNeutralBackground1: "#ffffff",
  colorNeutralBackground2: "#f7f7f5",
  colorNeutralBackground3: "#f0f0ec",
  colorNeutralBackground4: "#e8e8e4",

  // Text
  colorNeutralForeground1: "#1a1a1a",
  colorNeutralForeground2: "#555555",
  colorNeutralForeground3: "#888888",
  colorNeutralForeground4: "#aaaaaa",

  // Borders
  colorNeutralStroke1: "#e0e0db",
  colorNeutralStroke2: "#d0d0ca",

  // Brand / accent
  colorBrandBackground: "#00c06b",
  colorBrandBackgroundHover: "#00a85d",
  colorBrandBackgroundPressed: "#008f4f",
  colorBrandForeground1: "#00c06b",
  colorBrandForeground2: "#008f4f",
};

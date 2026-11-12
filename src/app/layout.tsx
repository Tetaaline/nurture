import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NURTURE",
  description:
    "NURTURE helps parents and teenagers understand, express and connect with each other.",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#A84A32",
    colorPrimaryForeground: "#FFFFFF",
    colorBackground: "#FFFFFF",
    colorForeground: "#2B1E17",
    colorMutedForeground: "#6B5446",
    colorMuted: "#F5E3D6",
    colorNeutral: "#2B1E17",
    colorBorder: "#EADCCD",
    colorInput: "#FFFFFF",
    colorInputForeground: "#2B1E17",
    colorRing: "#A84A32",
    colorDanger: "#B83A26",
    colorSuccess: "#2F8A57",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-dm-sans), system-ui, sans-serif",
    borderRadius: "10px",
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  elements: {
    cardBox: { borderRadius: "14px", boxShadow: "none", border: "1px solid #EADCCD" },
    headerTitle: { fontFamily: "var(--font-lora), Georgia, serif" },
    formButtonPrimary: { minHeight: "48px", fontWeight: 700 },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider
          appearance={clerkAppearance}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/onboarding"
          signUpFallbackRedirectUrl="/onboarding"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

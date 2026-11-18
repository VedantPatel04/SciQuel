import "@/app/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import clsx from "clsx";
import { type Session } from "next-auth";
import {
  Alegreya_Sans_SC,
  Besley,
  Quicksand,
  Source_Serif_4,
} from "next/font/google";
import AuthProvider from "../../../app/AuthProvider";

export const metadata = {
  title: "SciQuel",
  description: "SciQuel",
};

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  variable: "--font-quicksand",
});

const alegreyaSansSC = Alegreya_Sans_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-alegreya-sans-sc",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const besley = Besley({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-besley",
});

export default function RootLayoutBody({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <div
      className={clsx(
        quicksand.variable,
        besley.className,

        alegreyaSansSC.variable,
        sourceSerif4.variable,

        "m-0 flex min-h-screen flex-col p-0",
      )}
    >
      <AuthProvider session={session}>
        <a
          href="#main"
          className="skip center absolute overflow-hidden outline focus:static "
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header></Header>

          <main
            id="main"
            className="flex flex-1 flex-col pt-36 font-quicksand xs:pt-24 sm:pt-10"
          >
            {children}
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { IconWorld } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useAtom(localeAtom);

  useEffect(() => {
    const currentLocale =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1] || "ar";
    setLocale(currentLocale as "ar" | "en");
  }, []);

  const languages = [
    { code: "en", name: "E", flag: "🇺🇸" },
    { code: "ar", name: "ع", flag: "🇸🇦" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocale(newLocale as "ar" | "en");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2">
          <IconWorld />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={locale === language.code ? "bg-accent" : ""}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

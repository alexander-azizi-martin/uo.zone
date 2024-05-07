import { setupI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";

interface I18nProviderProps {
  locale: string;
  messages?: any;
  children: React.ReactNode;
}

export function I18nProvider({
  locale,
  messages,
  ...props
}: I18nProviderProps) {
  return (
    <LinguiProvider
      i18n={
        setupI18n({
          locale,
          messages: { [locale]: messages },
        }) as any
      }
      {...props}
    />
  );
}

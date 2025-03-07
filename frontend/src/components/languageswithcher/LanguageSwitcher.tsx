'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './styles/LanguageSwitcher.module.css';

const languages = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'English' },
];

interface LanguageSwitcherProps {
  isCollapsed?: boolean;
}

export function LanguageSwitcher({ isCollapsed = false }: LanguageSwitcherProps) {
  const { changeLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode).then(() => {
      changeLanguage(langCode);
      setIsOpen(false);
      localStorage.setItem('preferred-language', langCode);
    });
  };

  return (
    <div className={cn(styles.languageSwitcher, isCollapsed && styles.collapsed)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.languageButton}
        aria-label="Change language"
      >
        <GlobeIcon className={styles.currentLanguage} />
        <span className={styles.languageLabel}>
          {languages.find(lang => lang.code === i18n.language)?.label}
        </span>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`${styles.languageOption} ${
                i18n.language === lang.code ? styles.selected : ''
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

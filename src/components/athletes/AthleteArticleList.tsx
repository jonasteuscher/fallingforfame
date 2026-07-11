"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Locale } from "@/i18n/config";
import type { AthleteArticle } from "@/types/athlete";

type ConfirmedArticle = AthleteArticle & { url: string };

type AthleteArticleListProps = {
  articles: ConfirmedArticle[];
  locale: Locale;
  viewAllLabel: string;
  showLessLabel: string;
};

const initialArticleCount = 4;

export function AthleteArticleList({
  articles,
  locale,
  viewAllLabel,
  showLessLabel,
}: AthleteArticleListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasHiddenArticles = articles.length > initialArticleCount;
  const visibleArticles = isExpanded
    ? articles
    : articles.slice(0, initialArticleCount);

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {visibleArticles.map((article) => (
          <li key={article.url}>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full border border-border bg-surface p-5 transition hover:border-primary focus-visible:rounded-sm"
            >
              {article.logo ? (
                <span className="relative mb-5 flex h-14 w-full max-w-44 items-center">
                  <Image
                    src={article.logo}
                    alt={`${article.publisher ?? getDomainLabel(article.url)} logo`}
                    fill
                    sizes="176px"
                    className="object-contain object-left"
                    style={{
                      transform: article.logoScale
                        ? `scale(${article.logoScale})`
                        : undefined,
                      transformOrigin: "left center",
                    }}
                  />
                </span>
              ) : null}
              <span className="block text-xl font-semibold text-foreground">
                {getArticleLabel(article, locale)}
              </span>
              <span className="mt-2 block text-sm uppercase tracking-wide text-foreground/62">
                {article.publisher ?? getDomainLabel(article.url)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {hasHiddenArticles ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          className="mt-6 inline-flex min-h-12 cursor-pointer items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {isExpanded ? showLessLabel : viewAllLabel}
        </button>
      ) : null}
    </div>
  );
}

function getArticleLabel(article: AthleteArticle, locale: Locale) {
  return article.title?.[locale] ?? article.publisher ?? getDomainLabel(article.url);
}

function getDomainLabel(url: string | null) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

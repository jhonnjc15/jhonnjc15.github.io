import { marked } from "marked";
import { useState } from "react";
import React from 'react';

const Faq = ({ data }) => {
  const [isActive, setIsActive] = useState([]);
  const accordionHandler = (index) => {
    if (isActive.includes(index)) {
      setIsActive(isActive.filter((item) => item !== index));
    } else {
      setIsActive((prev) => [...prev, index]);
    }
  };
  return (
    <section className="faqs section bg-gradient-to-b from-primary/5 via-white to-secondary/5">
      <div className="container max-w-[1230px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-border/50 backdrop-blur text-left">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-sm">
              {data.faq.title}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-dark md:text-4xl">
              {data.faq.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-offset lg:max-w-[440px]">
              {data.faq.description}
            </p>
          </div>

          <div className="rounded-3xl bg-white/90 p-5 shadow-2xl ring-1 ring-border/60 backdrop-blur lg:p-8">
            {data.faq.faq_list.map((item, i) => {
              const isOpen = isActive.includes(i);

              return (
                <div
                  className={`accordion border-b border-border/70 ${isOpen ? "active" : ""}`}
                  onClick={() => accordionHandler(i)}
                  key={`item-${i}`}
                >
                  <div className="accordion-header relative flex cursor-pointer items-start gap-3 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 pl-1 text-left text-lg font-semibold text-dark">
                      {item.title}
                    </div>
                    <svg
                      className={`accordion-icon absolute right-0 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <path
                        fill="currentColor"
                        d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className={`accordion-content overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-4 pl-[60px] pr-2 text-text">
                      <p
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: marked.parseInline(item.content),
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;

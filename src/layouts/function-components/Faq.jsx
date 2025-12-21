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
        <div className="row items-start gap-8">
          <div className="text-center lg:col-4 lg:text-start">
            <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
              {data.faq.title}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-dark md:text-4xl">
              {data.faq.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-offset lg:max-w-[404px]">
              {data.faq.description}
            </p>
          </div>
          <div className="mt-8 lg:col-8 lg:mt-0">
            <div className="rounded-2xl bg-white/90 px-5 py-5 shadow-2xl ring-1 ring-border/60 backdrop-blur lg:px-10 lg:py-8">
              {data.faq.faq_list.map((item, i) => (
                <div
                  className={`accordion border-b border-border/70 ${
                    isActive.includes(i) ? "active" : undefined
                  }`}
                  onClick={() => accordionHandler(i)}
                  key={`item-${i}`}
                >
                  <div className="accordion-header relative flex items-start gap-3 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 pl-1 text-left text-lg font-semibold text-dark">
                      {item.title}
                    </div>
                    <svg
                      className="accordion-icon absolute right-0 top-1/2 -translate-y-1/2 text-primary"
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
                  <div className="accordion-content pb-4 pl-[60px] text-text">
                    <p
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: marked.parseInline(item.content),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;

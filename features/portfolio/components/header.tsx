"use client";

import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  language: "en" | "fr";
}

const sectionLabels = {
  en: ["About", "Services", "Skills", "Experience", "Education", "Projects", "Blog", "Contact"],
  fr: ["About", "Services", "Skills", "Experience", "Education", "Projects", "Blog", "Contact"]
} as const;

export function PortfolioHeader({ language }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["about", "services", "skills", "experience", "education", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = "/DjiotsaChristianResume(2).pdf";
    link.download = "Christian_Djiotsa_resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const items = sectionLabels[language];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href={`/${language}`} className="text-xl font-bold text-blue-700">
            Djiotsa
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => {
              if (item === "Blog") {
                return (
                  <a
                    key={item}
                    href={`/${language}/blog`}
                    className="font-medium transition-colors relative text-gray-700 hover:text-blue-700"
                  >
                    {item}
                  </a>
                );
              }

              const sectionId = item.toLowerCase();
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionId)}
                  className={`font-medium transition-colors relative ${
                    isActive ? "text-blue-700" : "text-gray-700 hover:text-blue-700"
                  }`}
                >
                  {item}
                  {isActive ? (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
                  ) : null}
                </button>
              );
            })}
            <button
              onClick={downloadPDF}
              className="flex items-center bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
          <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen((value) => !value)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen ? (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item) =>
                item === "Blog" ? (
                  <a
                    key={item}
                    href={`/${language}/blog`}
                    className="block w-full text-left px-3 py-2 font-medium transition-colors text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                  >
                    {item}
                  </a>
                ) : (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`block w-full text-left px-3 py-2 font-medium transition-colors ${
                      activeSection === item.toLowerCase()
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
              <button onClick={downloadPDF} className="flex items-center w-full text-left px-3 py-2 text-blue-700 font-medium">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

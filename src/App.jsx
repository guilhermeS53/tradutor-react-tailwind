import { useState, useEffect } from "react";

const lang = [
  { code: "en", name: "Inglês" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Espanhol" },
  { code: "fr", name: "Francês" },
  { code: "de", name: "Alemão" },
  { code: "it", name: "Italiano" },
];

function App() {
  const [sourceLang, setSourceLang] = useState("pt");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [sourceText, targetLang, sourceLang]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (err) {
      setError(`Erro ao tentar traduzir: ${err.message}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceLangChange = (event) => {
    const selectedLang = event.target.value;
    setSourceLang(selectedLang);

    if (selectedLang === targetLang) {
      setWarning(
        "Por favor, selecione um idioma de entrada diferente do idioma de saída."
      );
    } else {
      setWarning("");
    }
  };

  const handleTargetLangChange = (event) => {
    const selectedLang = event.target.value;
    setTargetLang(selectedLang);

    if (selectedLang === sourceLang) {
      setWarning(
        "Por favor, selecione um idioma de saída diferente do idioma de entrada."
      );
    } else {
      setWarning("");
    }
  };

  const swapTranslate = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-3 px-4 flex items-center">
          <h1 className="text-headerColor text-2xl font-semibold">
            Tradutor Google
          </h1>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={sourceLang}
              onChange={handleSourceLangChange}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
              name="lang"
              id="lang"
            >
              {lang.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="p-2 rounded-full hover:bg-gray-100 outline-none"
              onClick={swapTranslate}
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              value={targetLang}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
              onChange={handleTargetLangChange}
            >
              {lang.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {warning && (
            <div className="p-4 bg-yellow-100 border-t border-yellow-500 text-yellow-700">
              {warning}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Digite seu texto aqui"
                className="w-full h-40 text-lg text-textColor bg-transparent resize-none border-none outline-none"
                name="text"
                id="text"
              ></textarea>
            </div>

            <div className="p-4 relative bg-secondaryBackground border-l border-gray-200 ">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>{" "}
                </div>
              ) : (
                <p className="text-lg text-textColor">{translatedText}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {error && (
        <div className="p-4 bg-red-100 border-t border-red-500 text-red-700">
          {error}
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto py-3 px-4 text-sm text-headerColor">
          &copy; {new Date().getFullYear()} Tradutor Google - Developed by
          Guilherme Sousa
        </div>
      </footer>
    </div>
  );
}

export default App;

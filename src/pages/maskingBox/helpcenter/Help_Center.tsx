import { useState } from "react";
import {
  Search,
  Book,
  FileQuestion,
  Phone,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { faqData } from "./constant";

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveQuestion(null); // Close any open question when toggling categories
  };

  const toggleQuestion = (question: string) => {
    setActiveQuestion(activeQuestion === question ? null : question);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white py-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Centre d'aide et Support</h1>
          <p className="text-lg mb-6">
            Trouvez des réponses à vos questions sur l'utilisation de
            l'application
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Rechercher une question ou un sujet..."
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl  mx-auto py-8 px-4 md:px-8">
        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-blue-100 p-6 rounded-lg flex flex-col items-center text-center hover:bg-blue-100 transition-colors">
            <Book className="h-8 w-8 text-blue-900 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-black">
              Documentation
            </h3>
            <p className="text-gray-600 dark:text-black">
              Consultez nos guides détaillés et tutoriels
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg flex flex-col items-center text-center hover:bg-blue-100 transition-colors">
            <FileQuestion className="h-8 w-8 text-blue-900 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-black">FAQ</h3>
            <p className="text-gray-600 dark:text-black">
              Réponses aux questions fréquemment posées
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg flex flex-col items-center text-center hover:bg-blue-100 transition-colors">
            <Phone className="h-8 w-8 text-blue-900 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-black">
              Support technique
            </h3>
            <p className="text-gray-600 dark:text-black">
              Contactez notre équipe pour une assistance personnalisée
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Questions fréquemment posées
          </h2>

          <div className="space-y-4">
            {faqData.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 dark:border-0 rounded-lg overflow-hidden"
              >
                {/* Category header */}
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-left"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-2 font-semibold">{category.title}</span>
                  </div>
                  {activeCategory === category.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {/* Questions */}
                {activeCategory === category.id && (
                  <div className="p-4 bg-white dark:bg-gray-700">
                    <div className="space-y-4">
                      {category.questions.map((item) => (
                        <div
                          key={item.id}
                          className="border-b border-gray-100 dark:border-black pb-4 last:border-b-0 last:pb-0"
                        >
                          {/* Question */}
                          <button
                            className="w-full flex items-center justify-between text-left font-normal  hover:text-blue-700"
                            onClick={() => toggleQuestion(item.id)}
                          >
                            <span>{item.question}</span>
                            {activeQuestion === item.id ? (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>

                          {/* Answer */}
                          {activeQuestion === item.id && (
                            <div className="mt-3 text-gray-600">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-blue-50 dark:bg-gray-800 p-5 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold mb-2">
                Besoin d'aide supplémentaire ?
              </h3>
              <p className="text-gray-600 dark:text-gray-200 mb-4">
                Notre équipe de support est disponible pour vous aider avec
                n'importe quelle question que vous pourriez avoir.
              </p>
              <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { advisoryService, type TechnicalArticle } from "../../../../services/advisoryService";
import { H1, Paragraph } from "../../../atoms/Typography/Typography";
import { Badge } from "../../../atoms/Badge/Badge";
import { Spinner } from "../../../atoms/Spinner/Spinner";

export function TechnicalArticles() {
  const [articles, setArticles] = useState<TechnicalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<TechnicalArticle | null>(null);
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    const tags = tagFilter ? [tagFilter] : undefined;
    setLoading(true);
    advisoryService.getArticles(tags).then(setArticles).catch(() => {}).finally(() => setLoading(false));
  }, [tagFilter]);

  // Collect all unique tags
  const allTags = [...new Set(articles.flatMap((a) => a.crop_tags))];

  if (selectedArticle) {
    return (
      <div>
        <button onClick={() => setSelectedArticle(null)} className="mb-4 text-sm text-collie-600 hover:underline">
          ← Volver a artículos
        </button>
        <article className="rounded-xl bg-white p-8 shadow-md">
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedArticle.crop_tags.map((tag) => (
              <Badge key={tag} variant="success">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {selectedArticle.author && <span>Por {selectedArticle.author}</span>}
            {selectedArticle.published_at && (
              <span>{new Date(selectedArticle.published_at).toLocaleDateString("es-PE")}</span>
            )}
          </div>
          <div className="prose mt-6 max-w-none text-gray-700 whitespace-pre-line">
            {selectedArticle.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div>
      <H1>Artículos Técnicos</H1>
      <Paragraph className="mt-2">Recomendaciones y guías agronómicas para tus cultivos.</Paragraph>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setTagFilter("")}
            className={`rounded-full px-3 py-1 text-sm ${!tagFilter ? "bg-collie-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Todos
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`rounded-full px-3 py-1 text-sm ${tagFilter === tag ? "bg-collie-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center"><Spinner /></div>
      ) : (
        <div className="mt-6 space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="cursor-pointer rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-collie-700">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{article.content.slice(0, 200)}...</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.crop_tags.map((tag) => (
                      <Badge key={tag} variant="success">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="ml-4 text-right text-xs text-gray-400 whitespace-nowrap">
                  {article.author && <p>{article.author}</p>}
                  {article.published_at && <p>{new Date(article.published_at).toLocaleDateString("es-PE")}</p>}
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="py-12 text-center text-gray-500">No hay artículos disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}

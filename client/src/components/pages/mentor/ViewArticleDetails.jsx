import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';

function ViewArticleDetails() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiClient.get(`/mentor/articles/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        console.error("Error fetching article details:", err);
        setError("Failed to load article details.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!article) {
    return <div className="text-center py-8 text-gray-500">Article not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-4xl font-extrabold text-gray-900 leading-tight">
            {article.title}
          </CardTitle>
          <p className="text-md text-gray-600 mt-2">Category: <span className="font-semibold">{article.category}</span></p>
          <p className="text-sm text-gray-500">Published: {new Date(article.publicationDate).toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: article.content }}>
          </div>
   
          <div className="mt-8 flex justify-end">
            <Button onClick={() => navigate(-1)} variant="outline" className="px-6 py-3 text-lg">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewArticleDetails;

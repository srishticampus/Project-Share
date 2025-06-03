import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';

function ViewArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.get('/mentor/articles');
        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await apiClient.delete(`/mentor/articles/${articleId}`);
        setArticles(articles.filter(article => article._id !== articleId));
        alert('Article deleted successfully!');
      } catch (err) {
        console.error("Error deleting article:", err);
        setError("Failed to delete article.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-64 mb-6" /> {/* Skeleton for title */}
        <div className="mb-4">
          <Skeleton className="h-10 w-40" /> {/* Skeleton for Create New Article button */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Articles</h1>
      <div className="mb-4">
        <Link to="/mentor/create-article">
          <Button>Create New Article</Button>
        </Link>
      </div>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article._id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <p className="text-sm text-gray-600">Category: {article.category}</p>
                <p className="text-xs text-gray-500">Published: {new Date(article.publicationDate).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2 line-clamp-3">{article.content}</p>
                <p className="text-sm text-gray-500">Views: {article.views}</p>
                <p className="text-sm text-gray-500">Comments: {article.comments.length}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/mentor/articles/${article._id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link to={`/mentor/articles/${article._id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button variant="destructive" onClick={() => handleDelete(article._id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewArticles;

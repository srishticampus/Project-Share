import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';

function EditArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title: '', category: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiClient.get(`/mentor/articles/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        console.error("Error fetching article for edit:", err);
        setError("Failed to load article for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prevArticle => ({ ...prevArticle, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.put(`/mentor/articles/${articleId}`, article);
      alert('Article updated successfully!');
      navigate('/mentor/articles'); // Redirect back to view all articles
    } catch (err) {
      console.error("Error updating article:", err);
      setError("Failed to update article.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-40 w-full mb-4" />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!article) {
    return <div className="text-center py-8 text-gray-500">Article not found for editing.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">Edit Article</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                id="title"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Article Title"
                required
                className="text-lg py-2 px-4"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Input
                id="category"
                name="category"
                value={article.category}
                onChange={handleChange}
                placeholder="Article Category (e.g., Tech, Career, Lifestyle)"
                required
                className="text-lg py-2 px-4"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <Textarea
                id="content"
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Write your article content here..."
                rows="15"
                required
                className="text-lg py-2 px-4"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/mentor/articles')} className="px-6 py-3 text-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="px-6 py-3 text-lg">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditArticle;

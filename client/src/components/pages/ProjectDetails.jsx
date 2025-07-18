import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProject } from "@/lib/apiClient";
import { ArrowLeft } from 'lucide-react';
import ReportForm from '@/components/ReportForm'; // Import ReportForm
import apiClient from '@/lib/apiClient'; // Import apiClient

function ProjectDetails() {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  //function to get color class based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { project, tasks } = await getProject(id);
        setProject(project);
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching project:', error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="border rounded-md p-4">
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="border rounded-md p-4">
              <Skeleton className="h-6 w-1/4 mb-2" />
              <ul className="list-disc pl-5 space-y-2">
                <li><Skeleton className="h-4 w-full" /></li>
                <li><Skeleton className="h-4 w-full" /></li>
                <li><Skeleton className="h-4 w-full" /></li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* back button */}
      <Button onClick={() => navigate(-1)} className="mb-6 flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{project.description}</p>
          {project.creator && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-semibold">Creator</h3>
              <p>Name: {project.creator.name}</p>
              <p>Email: {project.creator.email}</p>
              <p>Bio: {project.creator.bio}</p>
              {/* <p>Links: {project?.creator?.portfolioLinks?.map((link) => <a href={link} target="_blank" rel="noreferrer">{link}</a>)}</p> */}
            </div>
          )}
          {tasks && tasks.length > 0 && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <ul className="list-disc pl-5">
                {tasks.map((task) => (
                  <li key={task._id}>
                    {task.title}: {task.description}
                    {task.createdBy && (
                      <div className="ml-5">
                        <p className="text-sm font-semibold">Created by:</p>
                        <p className="text-sm">Username: {task.createdBy.name}</p>
                        <p className="text-sm">Email: {task.createdBy.email}</p>
                        {/* <p className="text-sm">Bio: {task.createdBy.bio}</p> */}
                        {/* <p className="text-sm">Portfolio Links: {task.createdBy?.portfolioLinks?.map((link) => <a href={link} target="_blank" rel="noreferrer">{link}</a>)}</p> */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center"> {/* Added items-center for alignment */}
          {project.status && <span className={`text-sm p-2 ${getStatusColor(project.status)}`}>{project.status}</span>}
          {/* Add ReportForm */}
          <ReportForm
            reportType="Project"
            reportId={project._id}
            onReportSubmit={handleReportSubmit}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

// Function to handle report submission
const handleReportSubmit = async ({ reportType, reportId, reason, description }) => {
  try {
    const response = await apiClient.post('/reports', {
      reportType,
      reportId,
      reason,
      description,
    });
    console.log('Report submitted successfully:', response.data);
    alert('Report submitted successfully!'); // Provide user feedback
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Failed to submit report.'); // Provide user feedback
  }
};

export default ProjectDetails;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists or will be added
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '@/components/pages/creator/projectService'; // Import API functions

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); // For editing/deleting
  const [newProjectData, setNewProjectData] = useState({ title: '', description: '', techStack: '', status: 'Planning' });

  useEffect(() => {
    // Fetch projects on component mount
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.data); // Assuming the API returns data in the 'data' field
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Special handling for techStack if it's comma-separated
    if (name === 'techStack') {
      setNewProjectData({ ...newProjectData, [name]: value });
    } else {
      setNewProjectData({ ...newProjectData, [name]: value });
    }
  };

  const handleCreateProject = async () => {
    // Basic validation
    if (!newProjectData.title || !newProjectData.description) {
      alert('Title and Description are required.');
      return;
    }

    try {
      const techStackArray = newProjectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
      const data = await createProject({...newProjectData, techStack: techStackArray});
      setProjects([...projects, data.data]); // Assuming the API returns the new project in the 'data' field
      setNewProjectData({ title: '', description: '', techStack: '', status: 'Planning' }); // Reset form
      setIsCreateDialogOpen(false); // Close dialog
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    }
  };

  const openEditDialog = (project) => {
    setCurrentProject(project);
    setNewProjectData({ // Pre-fill form for editing
      title: project.title,
      description: project.description,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack, // Join array back to string for input
      status: project.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!currentProject || !newProjectData.title || !newProjectData.description) {
      alert('Title and Description are required.');
      return;
    }

    try {
      const techStackArray = newProjectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
      const data = await updateProject(currentProject.id, { ...newProjectData, techStack: techStackArray });
      setProjects(projects.map(p => p.id === currentProject.id ? data.data : p)); // Assuming the API returns the updated project in the 'data' field
      setCurrentProject(null);
      setNewProjectData({ title: '', description: '', techStack: '', status: 'Planning' }); // Reset form
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project.');
    }
  };

  const openDeleteDialog = (project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!currentProject) return;

    try {
      await deleteProject(currentProject.id);
      setProjects(projects.filter(p => p.id !== currentProject.id));
      setCurrentProject(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'In Progress': return 'default';
      case 'Planning': return 'secondary';
      case 'Completed': return 'outline'; // Or another variant like 'success' if defined
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Manage Projects</CardTitle>
            <CardDescription>Create, view, update, and manage your projects.</CardDescription>
          </div>
          <div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new project. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" name="title" value={newProjectData.title} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    {/* Assuming Textarea component exists */}
                    <Textarea id="description" name="description" value={newProjectData.description} onChange={handleInputChange} className="col-span-3" placeholder="Describe your project..." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="techStack" className="text-right">
                      Tech Stack
                    </Label>
                    <Input id="techStack" name="techStack" value={newProjectData.techStack} onChange={handleInputChange} className="col-span-3" placeholder="Comma-separated (e.g., React, Node)"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <select id="status" name="status" value={newProjectData.status} onChange={handleInputChange} className="col-span-3 border rounded p-2">
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleCreateProject}>Save Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Tech Stack</TableHead>
                <TableHead className="hidden sm:table-cell">Collaborators</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{project.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {project.techStack.map(tech => <Badge key={tech} variant="secondary" className="mr-1 mb-1">{tech}</Badge>)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{project.collaborators}</TableCell>
                  <TableCell className="text-right">
                    {/* Edit Dialog Trigger */}
                    <Dialog open={isEditDialogOpen && currentProject?.id === project.id} onOpenChange={(isOpen) => { if (!isOpen) { setIsEditDialogOpen(false); setCurrentProject(null); } else { openEditDialog(project); } }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => openEditDialog(project)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Project</DialogTitle>
                          <DialogDescription>Make changes to your project details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title-edit" className="text-right">
                              Title
                            </Label>
                            <Input id="title-edit" name="title" value={newProjectData.title} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description-edit" className="text-right">
                              Description
                            </Label>
                            <Textarea id="description-edit" name="description" value={newProjectData.description} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="techStack-edit" className="text-right">
                              Tech Stack
                            </Label>
                            <Input id="techStack-edit" name="techStack" value={newProjectData.techStack} onChange={handleInputChange} className="col-span-3" placeholder="Comma-separated"/>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status-edit" className="text-right">
                              Status
                            </Label>
                            <select id="status-edit" name="status" value={newProjectData.status} onChange={handleInputChange} className="col-span-3 border rounded p-2">
                              <option value="Planning">Planning</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={() => { setIsEditDialogOpen(false); setCurrentProject(null); }}>Cancel</Button>
                          </DialogClose>
                          <Button type="button" onClick={handleUpdateProject}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Dialog Trigger */}
                    <Dialog open={isDeleteDialogOpen && currentProject?.id === project.id} onOpenChange={(isOpen) => { if (!isOpen) { setIsDeleteDialogOpen(false); setCurrentProject(null); } else { openDeleteDialog(project); } }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => openDeleteDialog(project)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the project "{currentProject?.title}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={() => { setIsDeleteDialogOpen(false); setCurrentProject(null); }}>Cancel</Button>
                          </DialogClose>
                          <Button type="button" variant="destructive" onClick={handleDeleteProject}>Delete Project</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No projects found. Create one!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {/* Optional: Add pagination if needed */}
        {/* <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>1-{projects.length}</strong> of <strong>{projects.length}</strong> projects
            </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}

export default ProjectManagement;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select imports
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '@/components/pages/creator/projectService';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewCollaboratorsDialogOpen, setIsViewCollaboratorsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [newProjectData, setNewProjectData] = useState({ title: '', description: '', techStack: '', status: 'Planning', category: '' }); // Added category

  const projectCategories = [
    "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
    "Machine Learning", "Cloud Computing", "Cybersecurity", "DevOps",
    "Project Management", "Marketing", "Content Creation", "Business Strategy"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjectData({ ...newProjectData, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setNewProjectData({ ...newProjectData, category: value });
  };

  const handleCreateProject = async () => {
    if (!newProjectData.title || !newProjectData.description || !newProjectData.category) {
      alert('Title, Description, and Category are required.');
      return;
    }

    try {
      const techStackArray = newProjectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
      const data = await createProject({...newProjectData, techStack: techStackArray});
      setProjects([...projects, data.data]);
      setNewProjectData({ title: '', description: '', techStack: '', status: 'Planning', category: '' }); // Reset form
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    }
  };

  const openEditDialog = (project) => {
    setCurrentProject(project);
    setNewProjectData({
      title: project.title,
      description: project.description,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack,
      status: project.status,
      category: project.category || '' // Pre-fill category
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!currentProject || !newProjectData.title || !newProjectData.description || !newProjectData.category) {
      alert('Title, Description, and Category are required.');
      return;
    }

    try {
      const techStackArray = newProjectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
      const data = await updateProject(currentProject.id, { ...newProjectData, techStack: techStackArray });
      setProjects(projects.map(p => p.id === currentProject.id ? data.data : p));
      setCurrentProject(null);
      setNewProjectData({ title: '', description: '', techStack: '', status: 'Planning', category: '' }); // Reset form
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
      case 'Completed': return 'outline';
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
                    <Textarea id="description" name="description" value={newProjectData.description} onChange={handleInputChange} className="col-span-3" placeholder="Describe your project..." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select onValueChange={handleCategoryChange} value={newProjectData.category}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <TableHead>Category</TableHead> {/* Added Category column */}
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
                  <TableCell>{project.category}</TableCell> {/* Display category */}
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {project.techStack.map(tech => <Badge key={tech} variant="secondary" className="mr-1 mb-1">{tech}</Badge>)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {project.collaborators.length > 0 ? (
                      <Dialog open={isViewCollaboratorsDialogOpen && currentProject?.id === project.id} onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setIsViewCollaboratorsDialogOpen(false);
                          setCurrentProject(null);
                          setSelectedCollaborators([]);
                        } else {
                          setCurrentProject(project);
                          setSelectedCollaborators(project.collaborators);
                          setIsViewCollaboratorsDialogOpen(true);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setCurrentProject(project);
                            setSelectedCollaborators(project.collaborators);
                            setIsViewCollaboratorsDialogOpen(true);
                          }}>
                            {project.collaborators.length} <Eye className="ml-1 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Collaborators for "{currentProject?.title}"</DialogTitle>
                            <DialogDescription>
                              List of collaborators currently assigned to this project.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            {selectedCollaborators.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-2">
                                {selectedCollaborators.map((collaborator, index) => (
                                  <li key={index}>{collaborator.name || collaborator.email || 'Unknown Collaborator'}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>No collaborators assigned to this project.</p>
                            )}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span>0</span>
                    )}
                  </TableCell>
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
                            <Label htmlFor="category-edit" className="text-right">
                              Category
                            </Label>
                            <Select onValueChange={handleCategoryChange} value={newProjectData.category}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {projectCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                  <TableCell colSpan={7} className="text-center">No projects found. Create one!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectManagement;

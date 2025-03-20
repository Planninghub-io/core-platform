
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, PlusCircle, CheckCircle2, Calendar, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  priority: string;
  completed: boolean;
}

interface TaskManagementProps {
  eventId: string;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "medium"
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to a database
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
      priority: "medium"
    });
    setIsAddingTask(false);

    toast({
      description: "Task added successfully",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      description: "Task deleted",
    });
  };

  // Dummy data for team members (in a real app, this would come from the database)
  const teamMembers = [
    { id: "1", name: "Sarah Johnson" },
    { id: "2", name: "Michael Chen" },
    { id: "3", name: "Jessica Wong" },
    { id: "4", name: "David Rodriguez" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-[#8B5CF6]" />
              Tasks
            </CardTitle>
            <CardDescription>
              Create and assign tasks to your team members
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingTask(true)} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingTask ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Add New Task</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={newTask.dueDate} 
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value) => setNewTask({...newTask, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select 
                    value={newTask.assignee} 
                    onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newTask.description} 
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task details"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
                  Add Task
                </Button>
              </div>
            </div>
          ) : null}

          {tasks.length === 0 && !isAddingTask ? (
            <div className="text-center py-8">
              <ListChecks className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a task for your event.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setIsAddingTask(true)} 
                  className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          ) : null}

          {tasks.length > 0 ? (
            <div className="mt-4 space-y-4">
              {tasks.map(task => {
                const priorityOption = priorityOptions.find(p => p.value === task.priority);
                const assignee = teamMembers.find(m => m.id === task.assignee);
                
                return (
                  <div 
                    key={task.id} 
                    className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={task.completed} 
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className={task.completed ? 'bg-green-500 text-white' : ''}
                        />
                        <div>
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            {assignee && (
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                  {assignee.name}
                                </span>
                              </div>
                            )}
                            {priorityOption && (
                              <div className={`text-xs px-2 py-0.5 rounded-full ${priorityOption.color}`}>
                                {priorityOption.label} Priority
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, UserPlus, Mail, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface TeamManagementProps {
  eventId: string;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "team-member"
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be a database call
    const memberToAdd: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role
    };

    setTeamMembers([...teamMembers, memberToAdd]);
    setNewMember({ name: "", email: "", role: "team-member" });
    setIsAddingMember(false);

    toast({
      description: "Team member added successfully",
    });
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast({
      description: "Team member removed",
    });
  };

  const roles = [
    { value: "organizer", label: "Organizer" },
    { value: "coordinator", label: "Coordinator" },
    { value: "team-member", label: "Team Member" },
    { value: "vendor", label: "Vendor" },
    { value: "volunteer", label: "Volunteer" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6 text-[#8B5CF6]" />
              Event Team
            </CardTitle>
            <CardDescription>
              Add and manage team members for this event
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingMember(true)} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingMember ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Add Team Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newMember.name} 
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter team member name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newMember.email} 
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newMember.role} 
                  onValueChange={(value) => setNewMember({...newMember, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
                  Add Member
                </Button>
              </div>
            </div>
          ) : null}

          {teamMembers.length === 0 && !isAddingMember ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No team members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a team member to your event.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setIsAddingMember(true)} 
                  className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            </div>
          ) : null}

          {teamMembers.length > 0 ? (
            <div className="mt-4">
              <ul className="divide-y divide-gray-200">
                {teamMembers.map(member => (
                  <li key={member.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {roles.find(r => r.value === member.role)?.label || member.role}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveMember(member.id)}
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

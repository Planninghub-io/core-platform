
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
}

const UserManagement = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [targetEmail, setTargetEmail] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Redirect if not authenticated
  useAuthRedirect();

  // Check if user is a super admin and fetch users if they are
  useState(() => {
    const checkSuperAdmin = async () => {
      try {
        const { data, error } = await supabase.rpc('is_super_admin');
        
        if (error) {
          throw error;
        }
        
        setIsSuperAdmin(!!data);
        
        if (data) {
          setLoading(true);
          
          // Fetch users
          const { data: users, error: usersError } = await supabase
            .from('user_profiles')
            .select('id, email, created_at');
            
          if (usersError) {
            throw usersError;
          }
          
          setUsers(users || []);
        }
      } catch (error: any) {
        console.error('Error checking super admin status:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to verify admin status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkSuperAdmin();
  });

  const handleDeleteByEmail = async () => {
    if (!targetEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const response = await supabase.functions.invoke('delete-user-account', {
        method: 'DELETE',
        body: { targetEmail }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "Success",
        description: `User with email ${targetEmail} has been deleted`,
      });
      
      // Reset form
      setTargetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDeleteUser = async (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsDeleting(true);
      
      const response = await supabase.functions.invoke('delete-user-account', {
        method: 'DELETE',
        body: { targetUserId: selectedUser.id }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "Success",
        description: `User ${selectedUser.email} has been deleted`,
      });
      
      // Remove user from the list
      setUsers(users.filter(u => u.id !== selectedUser.id));
      
      // Close dialog
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="container py-8">
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">
            You do not have permission to access this page. This page is only available to super administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <div className="space-y-6">
        <Tabs defaultValue="userList">
          <TabsList className="mb-4">
            <TabsTrigger value="userList">User List</TabsTrigger>
            <TabsTrigger value="deleteByEmail">Delete by Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="userList" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">No users found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="deleteByEmail" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Delete User by Email</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  User Email
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteByEmail}
                    disabled={isDeleting || !targetEmail}
                  >
                    {isDeleting ? "Deleting..." : "Delete User"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                <p className="font-semibold">Warning</p>
                <p>This action will permanently delete the user account and all associated data. This cannot be undone.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user 
              <span className="font-medium mx-1">{selectedUser?.email}</span> 
              and all associated data, including events, invitations, and other content.
              <div className="mt-2 text-red-500 font-semibold">This action cannot be undone.</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;

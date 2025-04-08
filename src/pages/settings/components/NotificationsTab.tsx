
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";

const NotificationsTab = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailActivity, setEmailActivity] = useState(true);
  const [alwaysSendEmail, setAlwaysSendEmail] = useState(false);
  const [pageUpdates, setPageUpdates] = useState(true);
  const [workspaceDigest, setWorkspaceDigest] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [slackLevel, setSlackLevel] = useState("off");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mobile push notifications</CardTitle>
          <CardDescription>
            Receive push notifications on mentions and comments via your mobile app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Enable push notifications</Label>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Slack notifications</CardTitle>
          <CardDescription>
            Receive notifications in your Slack workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="slack-notifications">Enable Slack notifications</Label>
            </div>
            <Switch
              id="slack-notifications"
              checked={slackNotifications}
              onCheckedChange={setSlackNotifications}
            />
          </div>
          
          {slackNotifications && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="slack-level" className="min-w-32">Notification level:</Label>
              <Select
                value={slackLevel}
                onValueChange={setSlackLevel}
              >
                <SelectTrigger id="slack-level" className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All activity</SelectItem>
                  <SelectItem value="mentions">Mentions only</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-activity">Activity in your workspace</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails when you get comments, mentions, page invites, and access requests
              </p>
            </div>
            <Switch
              id="email-activity"
              checked={emailActivity}
              onCheckedChange={setEmailActivity}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="always-send">Always send email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about activity in your workspace, even when you're active on the app
              </p>
            </div>
            <Switch
              id="always-send"
              checked={alwaysSendEmail}
              onCheckedChange={setAlwaysSendEmail}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="page-updates">Page updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive email digests for changes to pages you're subscribed to
              </p>
            </div>
            <Switch
              id="page-updates"
              checked={pageUpdates}
              onCheckedChange={setPageUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="workspace-digest">Workspace digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive email digests of what's happening in your workspace
              </p>
            </div>
            <Switch
              id="workspace-digest"
              checked={workspaceDigest}
              onCheckedChange={setWorkspaceDigest}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Manage notification settings</span>
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;

// import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Building,
  Bell,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetSystemStatsQuery,
  useGetRecentActivitiesQuery,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useGetChatRoomsQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useCreateChatRoomMutation,
} from "@/redux/features/admin/adminApi";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import type {
  RecentActivity,
  Announcement,
  ChatRoom,
  ChatMessage,
} from "@/types/admin";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";

interface NewAnnouncement {
  title: string;
  content: string;
}

export function AdminDashboard() {
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
    useState<boolean>(false);
  const [newAnnouncement, setNewAnnouncement] = useState<NewAnnouncement>({
    title: "",
    content: "",
  });
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  const { data: statsData, isLoading: statsLoading } = useGetSystemStatsQuery();
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetRecentActivitiesQuery();
  const { data: announcementsData, isLoading: announcementsLoading } =
    useGetAnnouncementsQuery();
  const { data: chatRoomsData, isLoading: chatRoomsLoading } =
    useGetChatRoomsQuery();
  const { data: chatMessagesData, isLoading: chatMessagesLoading } =
    useGetChatMessagesQuery(selectedChatRoom || "", {
      skip: !selectedChatRoom,
    });

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [sendMessage] = useSendMessageMutation();
  const [createChatRoom] = useCreateChatRoomMutation();

  const handleCreateAnnouncement = async () => {
    try {
      await createAnnouncement(newAnnouncement).unwrap();
      toast.success("Announcement created successfully");
      setIsAnnouncementDialogOpen(false);
      setNewAnnouncement({ title: "", content: "" });
    } catch (error) {
      toast.error("Failed to create announcement");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChatRoom || !newMessage.trim()) return;

    try {
      await sendMessage({
        roomId: selectedChatRoom,
        message: newMessage,
      }).unwrap();
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (
    statsLoading ||
    activitiesLoading ||
    announcementsLoading ||
    chatRoomsLoading
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = statsData?.data;
  const activities = activitiesData?.data || [];
  const announcements = announcementsData?.data || [];
  const chatRooms = chatRoomsData?.data || [];
  const messages = chatMessagesData?.data || [];

  return (
    // <DashboardLayout>
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Instructors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInstructors}</div>
            <p className="text-xs text-muted-foreground">Active faculty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDepartments}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity: RecentActivity) => (
              <div key={activity.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{activity.type}</span>
                  <Badge variant="secondary">{activity.count}</Badge>
                </div>
                <Progress value={activity.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {activity.period}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status and Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Status</span>
                <Badge
                  variant={
                    stats?.serverStatus === "online"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {stats?.serverStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <Badge
                  variant={
                    stats?.databaseStatus === "healthy"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {stats?.databaseStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm text-muted-foreground">
                  {stats?.lastBackup
                    ? formatDistanceToNow(new Date(stats.lastBackup), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Announcements</CardTitle>
            <Dialog
              open={isAnnouncementDialogOpen}
              onOpenChange={setIsAnnouncementDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Add a new announcement to notify users about important
                    updates.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title">Title</label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement((prev: NewAnnouncement) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content">Content</label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement((prev: NewAnnouncement) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAnnouncementDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement: Announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start space-x-4"
                >
                  <Bell className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Posted{" "}
                      {announcement.createdAt
                        ? formatDistanceToNow(
                            new Date(announcement.createdAt),
                            {
                              addSuffix: true,
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 h-[400px]">
            {/* Chat Rooms List */}
            <div className="col-span-1 border-r pr-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {chatRooms.map((room: ChatRoom) => (
                    <Button
                      key={room.id}
                      variant={
                        selectedChatRoom === room.id ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedChatRoom(room.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {room.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Messages */}
            <div className="col-span-3 flex flex-col h-full">
              {selectedChatRoom ? (
                <>
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4">
                      {messages.map((message: ChatMessage) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender.id === "current-user-id"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender.id === "current-user-id"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.createdAt
                                ? formatDistanceToNow(
                                    new Date(message.createdAt),
                                    { addSuffix: true }
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a chat room to start messaging
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    // </DashboardLayout>
  );
}

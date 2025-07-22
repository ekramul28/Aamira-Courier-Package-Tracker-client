// import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calendar, Bell, BarChart } from "lucide-react";

export function InstructorDashboard() {
  // Mock data - in a real app, this would come from your API/Redux store
  const teachingCourses = [
    {
      id: 1,
      name: "Introduction to Programming",
      students: 45,
      averageGrade: "B+",
    },
    { id: 2, name: "Data Structures", students: 38, averageGrade: "A-" },
    { id: 3, name: "Database Systems", students: 42, averageGrade: "B" },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Grade Programming Assignment 3",
      course: "Introduction to Programming",
      dueDate: "2024-03-15",
    },
    {
      id: 2,
      title: "Prepare Mid-term Exam",
      course: "Data Structures",
      dueDate: "2024-03-20",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Faculty Meeting",
      content: "Monthly faculty meeting scheduled for next week...",
    },
    {
      id: 2,
      title: "Course Evaluation",
      content: "Course evaluation forms are now available...",
    },
  ];

  return (
    // <DashboardLayout userRole="instructor" userName="Dr. Sarah Smith">
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Teaching Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachingCourses.length}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachingCourses.reduce(
                (sum, course) => sum + course.students,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+</div>
            <p className="text-xs text-muted-foreground">Overall average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachingCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{course.name}</span>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">
                      {course.students} students
                    </Badge>
                    <Badge variant="outline">{course.averageGrade}</Badge>
                  </div>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks and Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.course}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    // </DashboardLayout>
  );
}

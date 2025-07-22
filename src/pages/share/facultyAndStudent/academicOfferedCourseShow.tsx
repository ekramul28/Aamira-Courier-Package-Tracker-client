import { motion } from "framer-motion";
// import { useGetOfferedCoursesQuery } from "@/redux/features/academic/offeredCourseApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Users, Calendar, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetAllOfferedCoursesQuery } from "@/redux/features/course/offerCourseApi";

const AcademicOfferedCourseShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: offeredCourses, isLoading } =
    useGetAllOfferedCoursesQuery(undefined);

  const filteredOfferedCourses = offeredCourses?.data?.filter(
    (course) =>
      course.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.academicDepartment.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <Card className="border-border/50">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Offered Courses
            </CardTitle>
            <p className="text-muted-foreground">
              View currently offered courses and their sections
            </p>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by course, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfferedCourses?.map((offeredCourse) => (
                <motion.div
                  key={offeredCourse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold">
                            {offeredCourse.course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {offeredCourse.course.code}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Building2 className="w-3 h-3 mr-1" />
                            {offeredCourse.academicDepartment.name}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {offeredCourse.course.credits} Credits
                          </Badge>
                        </div>

                        {offeredCourse.sections &&
                          offeredCourse.sections.length > 0 && (
                            <div className="pt-2">
                              <p className="text-sm font-medium mb-2">
                                Available Sections:
                              </p>
                              <div className="space-y-2">
                                {offeredCourse.sections.map((section) => (
                                  <div
                                    key={section.id}
                                    className="bg-gray-50 p-3 rounded-lg space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant="outline"
                                        className="bg-white"
                                      >
                                        Section {section.section}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-50 text-green-700"
                                      >
                                        <Users className="w-3 h-3 mr-1" />
                                        {section.maxCapacity} Seats
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {section.daysOfWeek.join(", ")} •{" "}
                                        {section.startTime} - {section.endTime}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredOfferedCourses?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No offered courses found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicOfferedCourseShow;

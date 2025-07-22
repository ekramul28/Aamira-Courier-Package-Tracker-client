import { motion } from "framer-motion";
// import { useGetInstructorsQuery } from "@/redux/features/academic/instructorApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Building2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetAllAcademicFacultiesQuery } from "@/redux/features/academic/academicFacultyApi";
//  import type { TFaculty } from "@/types/faculty";
// import { TFaculty } from "@/types/faculty";

const AcademicInstructorShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: faculties, isLoading } = useGetAllAcademicFacultiesQuery([]);

  const filteredFaculties = faculties?.data?.filter(
    (faculty: any) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.academicDepartment
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
              Academic Faculty
            </CardTitle>
            <p className="text-muted-foreground">
              Meet our experienced faculty members
            </p>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, designation, or department..."
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
              {filteredFaculties?.map((faculty: any) => (
                <motion.div
                  key={faculty.id}
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
                            {faculty.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {faculty.designation}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Building2 className="w-3 h-3 mr-1" />
                            {faculty.academicDepartment}
                          </Badge>
                          {faculty.status && (
                            <Badge
                              variant="secondary"
                              className={`${
                                faculty.status === "active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : faculty.status === "inactive"
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              }`}
                            >
                              {faculty.status}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 pt-2">
                          {faculty.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{faculty.email}</span>
                            </div>
                          )}
                          {faculty.contactNo && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{faculty.contactNo}</span>
                            </div>
                          )}
                        </div>

                        {faculty.assignedSubjects &&
                          faculty.assignedSubjects.length > 0 && (
                            <div className="pt-2">
                              <p className="text-sm font-medium mb-2">
                                Assigned Subjects:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {faculty.assignedSubjects.map(
                                  (subject: any) => (
                                    <Badge
                                      key={subject.id}
                                      variant="outline"
                                      className="bg-gray-50 hover:bg-gray-100"
                                    >
                                      {subject.name}
                                    </Badge>
                                  )
                                )}
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

          {!isLoading && filteredFaculties?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No faculty members found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicInstructorShow;

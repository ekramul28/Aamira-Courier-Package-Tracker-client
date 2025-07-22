import { motion } from "framer-motion";

import { useGetAllAcademicDepartmentsQuery } from "@/redux/features/academic/academicDepartmentApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const AcademicDepartmentShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: departments, isLoading } = useGetAllAcademicDepartmentsQuery(
    []
  );

  const filteredDepartments = departments?.data?.filter((department: any) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              Academic Departments
            </CardTitle>
            <p className="text-muted-foreground">
              Explore our academic departments and their programs
            </p>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search departments..."
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
              {filteredDepartments?.map((department: any) => (
                <motion.div
                  key={department._id}
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
                            {department.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {department.academicFaculty?.name}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {department.description && (
                          <p className="text-sm text-muted-foreground">
                            {department.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {department.headOfDepartment && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              Head: {department.headOfDepartment}
                            </Badge>
                          )}
                          {department.totalStudents && (
                            <Badge
                              variant="secondary"
                              className="bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              <GraduationCap className="w-3 h-3 mr-1" />
                              {department.totalStudents} Students
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredDepartments?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <Building2 className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No departments found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicDepartmentShow;

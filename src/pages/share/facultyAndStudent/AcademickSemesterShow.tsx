import { motion } from "framer-motion";
import { useGetAllAcademicSemestersQuery } from "@/redux/features/academic/academicSemesterApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const AcademicSemesterShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: semesters, isLoading } = useGetAllAcademicSemestersQuery([]);

  const filteredSemesters = semesters?.data?.filter(
    (semester: any) =>
      semester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      semester.year.toString().includes(searchQuery)
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
              Academic Semesters
            </CardTitle>
            <p className="text-muted-foreground">
              View current and upcoming academic semesters
            </p>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by semester name or year..."
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
              {filteredSemesters?.map((semester: any) => (
                <motion.div
                  key={semester.id}
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
                            {semester.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Year: {semester.year}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Code: {semester.code}
                          </Badge>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Duration:
                            </span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Start:</span>{" "}
                              {semester.startMonth}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">End:</span>{" "}
                              {semester.endMonth}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredSemesters?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No semesters found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicSemesterShow;

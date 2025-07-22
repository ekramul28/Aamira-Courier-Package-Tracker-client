import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
} from "@/redux/features/announcement/announcement.api";
import type { TAnnouncement } from "@/types/announcement";
import type { TQueryParam } from "@/types/global";
import AnnouncementForm from "../../components/form/announcement/AnnouncementForm";
import AnnouncementDetails from "../../components/form/announcement/AnnouncementDetails";
// import AnnouncementDetails from "./components/AnnouncementDetails";

export default function AnnouncementManagement() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<TAnnouncement | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Prepare query parameters
  const queryParams: TQueryParam[] = [
    { name: "page", value: page.toString() },
    { name: "limit", value: limit.toString() },
  ];

  if (debouncedSearchQuery) {
    queryParams.push({ name: "searchTerm", value: debouncedSearchQuery });
  }

  if (selectedType && selectedType !== "all") {
    queryParams.push({ name: "type", value: selectedType });
  }

  if (selectedPriority && selectedPriority !== "all") {
    queryParams.push({ name: "priority", value: selectedPriority });
  }

  if (selectedStatus && selectedStatus !== "all") {
    queryParams.push({
      name: "isActive",
      value: selectedStatus === "active" ? "true" : "false",
    });
  }

  // Get announcements with filters
  const { data: announcementsData, isLoading } =
    useGetAllAnnouncementsQuery(queryParams);
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const announcements = announcementsData?.data || [];
  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (announcement: TAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleView = (announcement: TAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailsOpen(true);
  };

  const handleDelete = async (announcement: TAnnouncement) => {
    try {
      await deleteAnnouncement(announcement._id).unwrap();
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAnnouncement(null);
    toast({
      title: "Success",
      description: selectedAnnouncement
        ? "Announcement updated successfully"
        : "Announcement created successfully",
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedPriority("");
    setSelectedStatus("");
    setPage(1);
  };

  const typeToVariant = (type: string) => {
    switch (type) {
      case "enrollment":
        return "default";
      case "academic":
        return "secondary";
      case "job":
        return "outline";
      case "general":
        return "destructive";
      default:
        return "default";
    }
  };

  const priorityToColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Announcement Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage system announcements
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AnnouncementForm
              announcement={selectedAnnouncement}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No announcements found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements?.map((announcement) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {announcement.title}
                        </h3>
                        <Badge variant={typeToVariant(announcement.type)}>
                          {announcement.type}
                        </Badge>
                        <Badge
                          variant={
                            announcement.isActive ? "default" : "secondary"
                          }
                        >
                          {announcement.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span
                          className={`text-sm font-medium ${priorityToColor(
                            announcement.priority
                          )}`}
                        >
                          {announcement.priority} priority
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Start:{" "}
                          {new Date(
                            announcement.startDate
                          ).toLocaleDateString()}
                        </span>
                        {announcement.endDate && (
                          <span>
                            End:{" "}
                            {new Date(
                              announcement.endDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Created:{" "}
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(announcement)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Announcement
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "
                              {announcement.title}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(announcement)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {announcementsData?.meta && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(announcementsData.meta.total / limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcement Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <AnnouncementDetails
            announcement={selectedAnnouncement}
            onClose={() => setIsDetailsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import FacultyProfileSkeleton from "@/components/skeleton/Profile/FacultyProfileSkeleton";
import { useGetMeQuery } from "@/redux/features/users/userApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  Settings,
  Users,
  Database,
} from "lucide-react";
// import FacultyForm from "@/components/form/faculty/FacultyForm";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminForm from "@/components/form/admin/AdminFrom";

const AdminProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading, error } = useGetMeQuery(undefined);

  console.log(data);

  if (isLoading) return <FacultyProfileSkeleton />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 dark:text-red-400">Error loading profile.</p>
      </div>
    );

  const user = data;
  const isOwnProfile = !id || id === user?.id;

  const fullName = `${user?.name?.firstName || ""} ${
    user?.name?.middleName || ""
  } ${user?.name?.lastName || ""}`.trim();

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex justify-center dark:bg-gray-900 p-4 min-h-screen transition-colors duration-500"
    >
      <div className="w-full max-w-6xl space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
          <CardHeader className="relative -mt-16 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800">
                <AvatarImage
                  src={
                    user?.profileImg || "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  alt={fullName}
                />
                <AvatarFallback className="text-2xl">
                  {user?.name?.firstName?.charAt(0)}
                  {user?.name?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl font-bold text-gray-800 dark:text-white"
                >
                  {fullName}
                </motion.h2>
                <motion.div
                  variants={itemVariants}
                  className="flex gap-2 mt-2 justify-center sm:justify-start"
                >
                  <Badge variant="secondary" className="uppercase">
                    {user?.user?.role}
                  </Badge>
                  {user?.user?.status === "active" && (
                    <Badge
                      variant="outline"
                      className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                    >
                      Active
                    </Badge>
                  )}
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-2"
                >
                  {user?.email}
                </motion.p>
              </div>
              {isOwnProfile && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AdminForm admin={user} onSuccess={handleFormSuccess} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">
                  <User className="w-4 h-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="professional">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Professional Info
                </TabsTrigger>
                <TabsTrigger value="admin">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Info
                </TabsTrigger>
                <TabsTrigger value="system">
                  <Database className="w-4 h-4 mr-2" />
                  System Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <InfoGrid>
                    <InfoItem
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={user?.user?.email}
                    />
                    <InfoItem
                      icon={<Phone className="w-4 h-4" />}
                      label="Contact No"
                      value={user?.contactNo}
                    />
                    <InfoItem
                      icon={<Calendar className="w-4 h-4" />}
                      label="Date of Birth"
                      value={
                        user?.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString()
                          : "-"
                      }
                    />
                    <InfoItem
                      icon={<User className="w-4 h-4" />}
                      label="Gender"
                      value={user?.gender}
                    />
                    <InfoItem
                      icon={<MapPin className="w-4 h-4" />}
                      label="Present Address"
                      value={user?.presentAddress}
                    />
                    <InfoItem
                      icon={<MapPin className="w-4 h-4" />}
                      label="Permanent Address"
                      value={user?.permanentAddress}
                    />
                  </InfoGrid>
                </motion.div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Section title="Employment Details">
                    <InfoGrid>
                      <InfoItem
                        icon={<Briefcase className="w-4 h-4" />}
                        label="Designation"
                        value={user?.designation || "Administrator"}
                      />
                      <InfoItem
                        icon={<BookOpen className="w-4 h-4" />}
                        label="Department"
                        value={user?.department || "Administration"}
                      />
                      <InfoItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Joining Date"
                        value={
                          user?.joiningDate
                            ? new Date(user.joiningDate).toLocaleDateString()
                            : "-"
                        }
                      />
                    </InfoGrid>
                  </Section>

                  <Separator className="my-6" />

                  <Section title="Qualifications">
                    <InfoGrid>
                      <InfoItem
                        icon={<Award className="w-4 h-4" />}
                        label="Highest Degree"
                        value={user?.highestDegree}
                      />
                      <InfoItem
                        icon={<GraduationCap className="w-4 h-4" />}
                        label="Specialization"
                        value={user?.specialization}
                      />
                      <InfoItem
                        icon={<BookOpen className="w-4 h-4" />}
                        label="Experience"
                        value={`${user?.experience || 0} years`}
                      />
                    </InfoGrid>
                  </Section>
                </motion.div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Section title="Administrative Details">
                    <InfoGrid>
                      <InfoItem
                        icon={<Shield className="w-4 h-4" />}
                        label="Admin ID"
                        value={user?.id}
                      />
                      <InfoItem
                        icon={<Users className="w-4 h-4" />}
                        label="Admin Level"
                        value={user?.adminLevel || "Super Admin"}
                      />
                      <InfoItem
                        icon={<Settings className="w-4 h-4" />}
                        label="Permissions"
                        value={user?.permissions?.join(", ") || "Full Access"}
                      />
                      <InfoItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Last Login"
                        value={
                          user?.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "-"
                        }
                      />
                      <InfoItem
                        icon={<Shield className="w-4 h-4" />}
                        label="Account Status"
                        value={user?.user?.status}
                      />
                      <InfoItem
                        icon={<BookOpen className="w-4 h-4" />}
                        label="Admin Role"
                        value={user?.adminRole || "System Administrator"}
                      />
                    </InfoGrid>
                  </Section>
                </motion.div>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Section title="System Information">
                    <InfoGrid>
                      <InfoItem
                        icon={<Database className="w-4 h-4" />}
                        label="User ID"
                        value={user?.id}
                      />
                      <InfoItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Account Created"
                        value={
                          user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"
                        }
                      />
                      <InfoItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Last Updated"
                        value={
                          user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : "-"
                        }
                      />
                      <InfoItem
                        icon={<Shield className="w-4 h-4" />}
                        label="Account Type"
                        value={user?.user?.role}
                      />
                      <InfoItem
                        icon={<Users className="w-4 h-4" />}
                        label="Access Level"
                        value={user?.accessLevel || "Full System Access"}
                      />
                      <InfoItem
                        icon={<Settings className="w-4 h-4" />}
                        label="System Role"
                        value={user?.systemRole || "Administrator"}
                      />
                    </InfoGrid>
                  </Section>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const InfoGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number | undefined | null;
}) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
    <div className="text-gray-500 dark:text-gray-400">{icon}</div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{value || "-"}</p>
    </div>
  </div>
);

export default AdminProfile;

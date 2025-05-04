import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';

const Profile = () => {
  const { user } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">You need to be logged in to view this page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Team Member
                </span>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="mt-1 font-medium">{user.name.toLowerCase().replace(' ', '_')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="mt-1 font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="mt-1 font-medium">Team Member</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Email Notifications</p>
                    <p className="mt-1 font-medium">Enabled</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Zone</p>
                    <p className="mt-1 font-medium">UTC (Auto)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setChangePasswordOpen(true)}>Change Password</Button>
            <Button onClick={() => setEditProfileOpen(true)}>Edit Profile</Button>
          </CardFooter>
        </Card>
        
        {/* Dialog forms */}
        <EditProfileForm open={editProfileOpen} onOpenChange={setEditProfileOpen} />
        <ChangePasswordForm open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      </div>
    </MainLayout>
  );
};

export default Profile;

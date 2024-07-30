"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

interface Props {
  user: UserData;
}

const EditProfileButton = ({ user }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShow(true)}>
        Edit profile
      </Button>
      {show && (
        <EditProfileDialog user={user} open={show} onOpenChange={setShow} />
      )}
    </>
  );
};

export default EditProfileButton;

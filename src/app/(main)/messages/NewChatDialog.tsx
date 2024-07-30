import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { UserResponse } from "stream-chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import LoadingButton from "@/components/LoadingButton";

interface Props {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

const NewChatDialog = ({ onChatCreated, onOpenChange }: Props) => {
  const { client, setActiveChannel } = useChatContext();
  const { toast } = useToast();

  const { user: loggedInUser } = useSession();

  const [search, setSearch] = useState("");
  const searchValue = useDebounce(search);

  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", searchValue],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(searchValue
            ? {
                $or: [
                  { name: { $autocomplete: searchValue } },
                  { username: { $autocomplete: searchValue } },
                ],
              }
            : {}),
        },
        {
          name: 1,
          username: 1,
        },
        { limit: 15 },
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedUsers.map((u) => u.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ", " +
              selectedUsers.map((u) => u.name).join(", ")
            : undefined,
      });
      await channel.create();
      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error starting chat. Please try again.",
      });
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
            />
          </div>
          {!!selectedUsers.length && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => {
                return (
                  <SelectedUserTag
                    key={user.id}
                    user={user}
                    onRemove={() => {
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.id !== user.id),
                      );
                    }}
                  />
                );
              })}
            </div>
          )}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => {
                return (
                  <UserResult
                    key={user.id}
                    user={user}
                    onClick={() => {
                      setSelectedUsers((prev) =>
                        prev.some((u) => u.id === user.id)
                          ? prev.filter((u) => u.id !== user.id)
                          : [...prev, user],
                      );
                    }}
                    selected={selectedUsers.some((u) => u.id === user.id)}
                  />
                );
              })}
            {isSuccess && !data.users.length && (
              <p className="my-3 text-center text-muted-foreground">
                No users found. Try a different name
              </p>
            )}
            {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
            {isError && (
              <p className="my-3 text-center text-destructive">
                An error occurred while loading users.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            disabled={!selectedUsers.length}
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Start chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;

interface UserProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

const UserResult = ({ onClick, selected, user }: UserProps) => {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
      onClick={onClick}
      title="button"
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
};

interface SelectedProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

const SelectedUserTag = ({ onRemove, user }: SelectedProps) => {
  return (
    <button
      className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
      onClick={onRemove}
      title="button"
      type="button"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground" />
    </button>
  );
};

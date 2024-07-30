import { PostData } from "@/lib/types";
import React, { useState } from "react";
import { useSubmitCommentMutation } from "./mutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface Props {
  post: PostData;
}

const CommentInput = ({ post }: Props) => {
  const [input, setInput] = useState("");

  const { mutate, isPending } = useSubmitCommentMutation(post.id);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input) return;

    mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => {
          setInput("");
        },
      },
    );
  };

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={!input.trim() || isPending}
      >
        {!isPending ? <SendHorizonal /> : <Loader2 className="animate-spin" />}
      </Button>
    </form>
  );
};

export default CommentInput;

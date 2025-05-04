"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TagInputForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-full max-w-md p-4 space-y-4 bg-white border rounded-md shadow">
      <div>
        <label className="text-sm font-medium">Add Tags (max 8)</label>
        <div className="flex items-center mt-2 space-x-2">
          <Input
            placeholder="Add a tag"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <Button onClick={addTag}>+</Button>
        </div>
        <div className="flex flex-wrap mt-2 gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              onClick={() => removeTag(tag)}
              className="cursor-pointer"
            >
              {tag} <span className="ml-1 text-xs">✕</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <input id="display-on-profile" type="checkbox" />

        <input type="checkbox" id="disable-commenting" />
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Add to portfolio</label>
          <Button variant="outline" className="w-full mt-1">
            Choose
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium">Add Download File</label>
          <Button variant="outline" className="w-full mt-1">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

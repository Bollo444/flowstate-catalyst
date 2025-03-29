"use client";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export default function TeamCharter() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Chen",
      role: "Project Lead",
      avatarUrl: "https://picsum.photos/100",
    },
  ]);
  const [newMember, setNewMember] = useState("");

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([
        ...members,
        {
          id: Date.now().toString(),
          name: newMember,
          role: "Contributor",
          avatarUrl: `https://picsum.photos/100?${Date.now()}`,
        },
      ]);
      setNewMember("");
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="space-y-6 p-6 bg-white/10 rounded-lg border border-[#2D2D2D]">
      <h2 className="text-2xl font-bold text-[#50B584]">Team Charter</h2>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add team member..."
            className="bg-[#1E1E1E] border-[#2D2D2D] text-white"
          />
          <Button
            onClick={addMember}
            className="bg-[#50B584] hover:bg-[#409C74]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-[#8F8F8F]">{member.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => removeMember(member.id)}
                className="text-red-500 hover:bg-red-500/10"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

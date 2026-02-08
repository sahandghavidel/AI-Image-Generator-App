"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  Search,
  Calendar,
  Trash2,
  Download,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";

import Image from "next/image";

import {
  deleteImageProject,
  getUserImageProjects,
} from "~/actions/text-to-image";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { useRouter } from "next/navigation";

interface ImageProject {
  id: string;
  name: string | null;
  prompt: string;
  negativePrompt: string | null;
  imageUrl: string;
  s3Key: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed: number;
  modelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type SortBy = "newest" | "oldest" | "name";

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [imageProjects, setImageProjects] = useState<ImageProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ImageProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const router = useRouter();

  useEffect(() => {
    const initializeProjects = async () => {
      try {
        // Fetch session and projects in parallel
        const [, projectsResult] = await Promise.all([
          authClient.getSession(),
          getUserImageProjects(),
        ]);

        // Set image projects
        if (projectsResult.success && projectsResult.imageProjects) {
          setImageProjects(projectsResult.imageProjects as ImageProject[]);
          setFilteredProjects(projectsResult.imageProjects as ImageProject[]);
        }
      } catch (error) {
        console.error("Image projects initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeProjects();
  }, []);

  // Filter and sort projects
  useEffect(() => {
    let filtered = imageProjects.filter((project) =>
      project.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort projects
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.prompt.localeCompare(b.prompt));
        break;
    }

    setFilteredProjects(filtered);
  }, [imageProjects, searchQuery, sortBy]);

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this image project?")) return;

    const result = await deleteImageProject(projectId);
    if (result.success) {
      setImageProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handleDownload = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                Your Image Projects
              </h1>
              <p className="text-muted-foreground text-base">
                Manage and organize all your text-to-image generations (
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "image" : "images"})
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create")}
              className="gap-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              New Image
            </Button>
          </div>

          {/* Controls Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative max-w-md flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search image projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Prompt A-Z</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Projects Content */}
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="border-muted bg-muted/20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed">
                    <ImageIcon className="text-muted-foreground h-10 w-10" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {searchQuery ? "No images found" : "No image projects yet"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md text-sm">
                  {searchQuery
                    ? `No images match "${searchQuery}". Try adjusting your search terms.`
                    : "Start generating images to see them here."}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/dashboard/create")}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Image
                  </Button>
                )}
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="gap-2"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group transition-all hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                      <Image
                        src={project.imageUrl}
                        alt={project.prompt}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                        {project.prompt}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          {project.width}×{project.height}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleDownload(project.imageUrl, e)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-8 w-8 p-0"
                        onClick={(e) => handleDelete(project.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button - if you want to implement pagination */}
          {filteredProjects.length >= 20 && (
            <div className="text-center">
              <Button variant="outline" className="gap-2">
                Load More Projects
                <Loader2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SignedIn>
    </>
  );
}
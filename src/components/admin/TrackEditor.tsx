"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  X,
  Check,
  Edit2,
  HelpCircle,
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuizEditor from "./QuizEditor";
import MarkdownEditor from "./MarkdownEditor";

interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
  order: number;
  contentUrl?: string;
  textContent?: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Track {
  id: string;
  title: string;
  description: string;
  published: boolean;
  modules: Module[];
}

interface LessonItemProps {
  lesson: Lesson;
  moduleId: string;
  editingLessonId: string | null;
  startEditingLesson: (lesson: Lesson) => void;
  handleDeleteLesson: (lessonId: string) => void;
  editLessonContent: string;
  setEditLessonContent: (val: string) => void;
  editLessonTextContent: string;
  setEditLessonTextContent: (val: string) => void;
  textLessonMode: "PDF" | "MARKDOWN";
  setTextLessonMode: (val: "PDF" | "MARKDOWN") => void;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    lesson: Lesson,
  ) => void;
  isUploading: boolean;
  setEditingLessonId: (id: string | null) => void;
  handleSaveLessonContent: (lesson: Lesson) => void;
}

function LessonItem({
  lesson,
  moduleId,
  editingLessonId,
  startEditingLesson,
  handleDeleteLesson,
  editLessonContent,
  setEditLessonContent,
  editLessonTextContent,
  setEditLessonTextContent,
  textLessonMode,
  setTextLessonMode,
  handleFileUpload,
  isUploading,
  setEditingLessonId,
  handleSaveLessonContent,
}: LessonItemProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={lesson}
      dragListener={false}
      dragControls={controls}
      style={{ listStyle: "none" }}
    >
      <div
        style={{
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: "1px solid var(--border-light)",
          backgroundColor:
            editingLessonId === lesson.id
              ? "rgba(var(--primary-rgb), 0.05)"
              : "var(--background)",
        }}
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          style={{ cursor: "grab", display: "flex", alignItems: "center" }}
          className="p-2 rounded-lg bg-muted/50"
        >
          <GripVertical size={16} color="var(--muted)" />
        </div>
        {lesson.type === "VIDEO" ? (
          <Video size={16} color="var(--primary)" />
        ) : lesson.type === "QUIZ" ? (
          <HelpCircle size={16} color="var(--primary)" />
        ) : (
          <FileText size={16} color="var(--muted)" />
        )}
        <span
          style={{ flex: 1, fontWeight: 500, pointerEvents: "none" }}
          className="select-none"
        >
          {lesson.title}
        </span>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => startEditingLesson(lesson)}
            className="btn btn-outline rounded-lg"
            style={{ color: "var(--primary)" }}
            title="Edit Content"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteLesson(lesson.id)}
            className="btn btn-outline rounded-lg"
            style={{ color: "var(--error)" }}
            title="Delete Lesson"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Inline Content Editor */}
      {editingLessonId === lesson.id && (
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border-light)",
            backgroundColor: "var(--background)",
          }}
        >
          <div style={{ marginBottom: "1rem" }} className="flex flex-col gap-2">
            <label className="font-semibold">
              {lesson.type === "VIDEO"
                ? "Video URL (YouTube)"
                : lesson.type === "TEXT"
                  ? "Upload Lesson PDF"
                  : "Quiz Editor"}
            </label>
            {lesson.type === "QUIZ" ? (
              <QuizEditor lessonId={lesson.id} />
            ) : lesson.type === "VIDEO" ? (
              <input
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editLessonContent}
                onChange={(e) => setEditLessonContent(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex bg-muted/10 p-1 rounded-lg w-fit border border-border">
                    <button
                      onClick={() => setTextLessonMode("MARKDOWN")}
                      className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${textLessonMode === "MARKDOWN" ? "bg-background shadow-sm text-foreground" : "text-foreground hover:text-secondary"}`}
                    >
                      Text Editor
                    </button>
                    <button
                      onClick={() => setTextLessonMode("PDF")}
                      className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${textLessonMode === "PDF" ? "bg-background shadow-sm text-foreground" : "text-foreground hover:text-secondary"}`}
                    >
                      PDF Upload
                    </button>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#f59e0b]">
                      Uploaded PDFs will be given priority over the text
                      content.
                    </p>
                  </div>
                </div>
                {textLessonMode === "MARKDOWN" ? (
                  <MarkdownEditor
                    value={editLessonTextContent}
                    onChange={setEditLessonTextContent}
                    placeholder="Type content here..."
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, lesson)}
                      disabled={isUploading}
                      className="w-full h-fit px-1 py-1 bg-background rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-gray-300 file:text-sm file:font-semibold file:bg-transparent file:text-gray-600 hover:file:bg-gray-100"
                    />
                    {isUploading && (
                      <p className="text-sm text-muted">Uploading PDF...</p>
                    )}
                    {editLessonContent && (
                      <div className="p-3 bg-muted-light rounded-lg border border-border flex items-center justify-between">
                        <span
                          className="text-sm truncate mr-2"
                          title={editLessonContent}
                        >
                          Currently attached:{" "}
                          {editLessonContent.split("/").pop()}
                        </span>
                        <a
                          href={editLessonContent}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary text-xs font-semibold hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => setEditingLessonId(null)}
              className="btn btn-sm btn-outline rounded-full"
            >
              Cancel
            </button>
            {lesson.type !== "QUIZ" && (
              <button
                onClick={() => handleSaveLessonContent(lesson)}
                className="btn btn-sm btn-primary rounded-full"
              >
                Save Content
              </button>
            )}
          </div>
        </div>
      )}
    </Reorder.Item>
  );
}

export default function TrackEditor({ track }: { track: Track }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDeleteId, setLessonToDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [published, setPublished] = useState(track.published);
  const [modules, setModules] = useState<Module[]>(track.modules);

  // Sync state when track updates from router.refresh()
  useEffect(() => {
    setModules(track.modules);
  }, [track.modules]);

  // UI State for adding items
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const [addingLessonToModuleId, setAddingLessonToModuleId] = useState<
    string | null
  >(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<"VIDEO" | "TEXT">("VIDEO");

  // UI State for editing content
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonContent, setEditLessonContent] = useState("");
  const [editLessonTextContent, setEditLessonTextContent] = useState("");
  const [textLessonMode, setTextLessonMode] = useState<"PDF" | "MARKDOWN">(
    "MARKDOWN",
  );

  async function handleUpdateTrack() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tracks/${track.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, published }),
      });

      if (!res.ok) throw new Error("Failed to update track");

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error updating track");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddModule() {
    if (!newModuleTitle.trim()) return;

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newModuleTitle,
          trackId: track.id,
          order: track.modules.length,
        }),
      });

      if (!res.ok) throw new Error("Failed to create module");
      toast.success("Module created successfully");
      setNewModuleTitle("");
      setIsAddingModule(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error creating module");
    }
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Are you sure? This will delete all lessons in this module."))
      return;

    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete module");
      toast.success("Module deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting module");
    }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim() || !addingLessonToModuleId) return;

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newLessonTitle,
          moduleId: addingLessonToModuleId,
          type: newLessonType,
          order: 99,
          contentUrl: newLessonType === "VIDEO" ? "" : undefined,
          textContent:
            newLessonType === "TEXT" ? "New lesson content..." : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create lesson");
      toast.success("Lesson created successfully");

      setNewLessonTitle("");
      setAddingLessonToModuleId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error creating lesson");
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    setLessonToDeleteId(lessonId);
    setIsDeleteDialogOpen(true);
  }

  async function confirmDeleteLesson() {
    if (!lessonToDeleteId) return;

    try {
      const res = await fetch(`/api/lessons/${lessonToDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete lesson");
      toast.success("Lesson deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting lesson");
    } finally {
      setIsDeleteDialogOpen(false);
      setLessonToDeleteId(null);
    }
  }

  async function handleSaveLessonContent(lesson: Lesson) {
    try {
      const body: Partial<Lesson> = {
        title: lesson.title,
        type: lesson.type,
        order: lesson.order,
      };

      if (lesson.type === "VIDEO") {
        body.contentUrl = editLessonContent;
      } else if (lesson.type === "TEXT") {
        if (textLessonMode === "PDF") {
          body.contentUrl = editLessonContent;
          body.textContent = "";
        } else {
          body.contentUrl = "";
          body.textContent = editLessonTextContent;
        }
      }

      const res = await fetch(`/api/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update lesson");
      toast.success("Lesson updated successfully");

      setEditingLessonId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error updating lesson content");
    }
  }

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function syncLessonOrder(lessons: Lesson[]) {
    try {
      const res = await fetch("/api/lessons/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessons: lessons.map((l, index) => ({ id: l.id, order: index })),
        }),
      });

      if (!res.ok) throw new Error("Failed to sync order");
      toast.success("Lesson order synced successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync lesson order to database");
    }
  }

  const handleReorderLessons = (moduleId: string, newLessons: Lesson[]) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, lessons: newLessons } : m)),
    );

    // Debounce syncing to database
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncLessonOrder(newLessons);
    }, 1000);
  };

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    lesson: Lesson,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File is too large (max 3MB)");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch("/api/admin/lessons/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: reader.result,
            contentType: file.type,
            fileName: file.name,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Upload failed");
        }

        const data = await res.json();
        setEditLessonContent(data.url);
        toast.success(
          "PDF uploaded successfully! Click Save Content to persist.",
        );
      } catch (error: any) {
        console.error(error);
        toast.error("Upload failed: " + error.message);
      } finally {
        setIsUploading(false);
      }
    };
  }

  function startEditingLesson(lesson: Lesson) {
    setEditingLessonId(lesson.id);
    if (lesson.type === "TEXT") {
      setEditLessonContent(lesson.contentUrl || "");
      setEditLessonTextContent(lesson.textContent || "");
      setTextLessonMode(
        lesson.contentUrl && !lesson.textContent ? "PDF" : "MARKDOWN",
      );
    } else {
      setEditLessonContent(
        lesson.type === "VIDEO"
          ? lesson.contentUrl || ""
          : lesson.textContent || "",
      );
    }
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header / Track Settings */}
      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3>Track Settings</h3>
          <button
            onClick={handleUpdateTrack}
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              borderRadius: "200px",
            }}
          >
            {isLoading ? (
              <Loader
                size={18}
                className="animate-spin"
                style={{ marginRight: "0.5rem" }}
              />
            ) : (
              <Save size={18} style={{ marginRight: "0.5rem" }} />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label className="label">Track Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: "1.2rem", height: "1.2rem" }}
            />
            <label htmlFor="published">Published (Visible to students)</label>
          </div>
        </div>
      </div>

      {/* Curriculum Builder */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3>Curriculum</h3>
        {!isAddingModule ? (
          <button
            onClick={() => setIsAddingModule(true)}
            className="btn btn-outline rounded-full"
          >
            <Plus size={18} style={{ marginRight: "0.5rem" }} />
            Add Module
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              autoFocus
              placeholder="Module Title"
              className="input"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            />
            <button
              onClick={handleAddModule}
              className="btn btn-primary"
              style={{ padding: "0.5rem" }}
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => setIsAddingModule(false)}
              className="btn btn-outline"
              style={{ padding: "0.5rem" }}
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {modules.map((module) => (
          <div
            key={module.id}
            className="card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            {/* Module Header */}
            <div
              style={{
                padding: "1rem 1.5rem",
                backgroundColor: "var(--muted-light)",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {/* <GripVertical
                  size={20}
                  color="var(--muted)"
                  style={{ cursor: "grab" }}
                /> */}
                <h4>{module.title}</h4>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  onClick={() => setAddingLessonToModuleId(module.id)}
                  className="btn btn-sm btn-outline rounded-lg"
                  style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}
                  disabled={addingLessonToModuleId === module.id}
                >
                  <Plus size={14} style={{ marginRight: "0.25rem" }} />
                  Add Lesson
                </button>
                <button
                  onClick={() => handleDeleteModule(module.id)}
                  className="btn-icon"
                  style={{ color: "var(--error)" }}
                  title="Delete Module"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Lessons List */}
            <div style={{ padding: "0.5rem 0" }}>
              <Reorder.Group
                axis="y"
                values={module.lessons}
                onReorder={(newLessons) =>
                  handleReorderLessons(module.id, newLessons)
                }
              >
                {module.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    moduleId={module.id}
                    editingLessonId={editingLessonId}
                    startEditingLesson={startEditingLesson}
                    handleDeleteLesson={handleDeleteLesson}
                    editLessonContent={editLessonContent}
                    setEditLessonContent={setEditLessonContent}
                    editLessonTextContent={editLessonTextContent}
                    setEditLessonTextContent={setEditLessonTextContent}
                    textLessonMode={textLessonMode}
                    setTextLessonMode={setTextLessonMode}
                    handleFileUpload={handleFileUpload}
                    isUploading={isUploading}
                    setEditingLessonId={setEditingLessonId}
                    handleSaveLessonContent={handleSaveLessonContent}
                  />
                ))}
              </Reorder.Group>

              {/* Add Lesson Form */}
              {addingLessonToModuleId === module.id && (
                <div
                  style={{
                    padding: "0.75rem 1.5rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    backgroundColor: "rgba(var(--primary-rgb), 0.05)",
                  }}
                >
                  <select
                    className="input"
                    style={{ width: "auto" }}
                    value={newLessonType}
                    onChange={(e) =>
                      setNewLessonType(e.target.value as "VIDEO" | "TEXT")
                    }
                  >
                    <option value="VIDEO">Video</option>
                    <option value="TEXT">Text</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                  <input
                    autoFocus
                    placeholder="Lesson Title"
                    className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ flex: 1 }}
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
                  />
                  <button
                    onClick={handleAddLesson}
                    className="btn btn-primary rounded-lg"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setAddingLessonToModuleId(null)}
                    className="btn btn-outline rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {module.lessons.length === 0 &&
                addingLessonToModuleId !== module.id && (
                  <div
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      color: "var(--muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    No lessons in this module yet.
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lesson and all associated student progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
